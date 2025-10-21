import React, { useEffect, useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   StatusBar,
   ActivityIndicator,
   TextInput,
   Modal,
   RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from 'expo-router';
import { getBundles, deleteBundle } from '../services/api';
import api from '../services/api';

export default function ProfileScreen() {
   const { theme, isDark } = useTheme();
   const { colors, gradients } = theme;
   const { onLogout, getUser } = useAuth();
   const navigation = useNavigation();

   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
   const [editModalVisible, setEditModalVisible] = useState(false);
   const [bundles, setBundles] = useState([]);
   const [reviews, setReviews] = useState([]);
   const [loadingBundles, setLoadingBundles] = useState(false);
   const [loadingReviews, setLoadingReviews] = useState(false);
   
   // Edit form state
   const [editForm, setEditForm] = useState({
      username: '',
      email: '',
   });

   const fetchUser = async () => {
      const result = await getUser();
      console.log(result.data);
      setUser(result.data?.user);
      setEditForm({
         username: result.data?.user?.username || '',
         email: result.data?.user?.email || '',
      });
   };

   const fetchBundles = async () => {
      setLoadingBundles(true);
      try {
         const result = await getBundles();
         if (!result.error) {
            setBundles(result.data || []);
         }
      } catch (error) {
         console.error('Error fetching bundles:', error);
      } finally {
         setLoadingBundles(false);
      }
   };

   const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
         // Fetch user's reviews - assuming endpoint exists
         const { data } = await api.get('/users/me/reviews');
         setReviews(data?.reviews || []);
      } catch (error) {
         console.error('Error fetching reviews:', error);
         setReviews([]);
      } finally {
         setLoadingReviews(false);
      }
   };

   useEffect(() => {
      const loadData = async () => {
         setLoading(true);
         await fetchUser();
         await fetchBundles();
         await fetchReviews();
         setLoading(false);
      };
      loadData();
   }, []);

   const onRefresh = async () => {
      setRefreshing(true);
      await fetchUser();
      await fetchBundles();
      await fetchReviews();
      setRefreshing(false);
   };

   const handleUpdateProfile = async () => {
      try {
         // Assuming update endpoint exists
         const { data } = await api.put('/users/me', editForm);
         if (!data.error) {
            setUser(data.user);
            setEditModalVisible(false);
         }
      } catch (error) {
         console.error('Error updating profile:', error);
      }
   };

   const handleDeleteBundle = async (bundleId) => {
      try {
         const result = await deleteBundle(bundleId);
         if (!result.error) {
            setBundles(bundles.filter(b => b._id !== bundleId));
         }
      } catch (error) {
         console.error('Error deleting bundle:', error);
      }
   };

   const handleLogout = async () => {
      await onLogout();
      navigation.reset({
         index: 0,
         routes: [
            {
               name: 'Login',
            },
         ],
      });
   };

   const renderBundleCard = (bundle) => (
      <View
         key={bundle._id}
         style={[
            styles.card,
            {
               backgroundColor: colors.surface,
               borderColor: colors.surfaceBorder,
            },
         ]}
      >
         <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
               <MaterialIcons name="inventory" size={20} color={colors.primary} />
               <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  {bundle.name}
               </Text>
            </View>
            <View style={styles.cardActions}>
               <TouchableOpacity
                  onPress={() => navigation.navigate('BundleDetail', { id: bundle._id })}
                  style={styles.iconButton}
               >
                  <MaterialIcons name="visibility" size={20} color={colors.primary} />
               </TouchableOpacity>
               <TouchableOpacity
                  onPress={() => handleDeleteBundle(bundle._id)}
                  style={styles.iconButton}
               >
                  <MaterialIcons name="delete" size={20} color={colors.error} />
               </TouchableOpacity>
            </View>
         </View>
         
         <View style={styles.cardContent}>
            <View style={styles.infoRow}>
               <MaterialIcons name="devices" size={14} color={colors.textMuted} />
               <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  {bundle.products?.length || 0} parts
               </Text>
            </View>
            
            {bundle.compatibilityScore !== undefined && (
               <View style={styles.scoreContainer}>
                  <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>
                     Compatibility
                  </Text>
                  <View
                     style={[
                        styles.scoreTrack,
                        { backgroundColor: theme.withOpacity(colors.primary, 0.2) },
                     ]}
                  >
                     <View
                        style={[
                           styles.scoreFill,
                           {
                              backgroundColor: colors.primary,
                              width: `${bundle.compatibilityScore}%`,
                           },
                        ]}
                     />
                  </View>
                  <Text style={[styles.scoreValue, { color: colors.primary }]}>
                     {bundle.compatibilityScore}%
                  </Text>
               </View>
            )}
         </View>
         
         <Text style={[styles.cardDate, { color: colors.textMuted }]}>
            Created {new Date(bundle.createdAt).toLocaleDateString()}
         </Text>
      </View>
   );

   const renderReviewCard = (review) => (
      <View
         key={review._id}
         style={[
            styles.card,
            {
               backgroundColor: colors.surface,
               borderColor: colors.surfaceBorder,
            },
         ]}
      >
         <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
               <MaterialIcons name="rate-review" size={20} color={colors.primary} />
               <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                  {review.product?.name || 'Product Review'}
               </Text>
            </View>
            <View style={styles.ratingBadge}>
               <MaterialIcons name="star" size={14} color={colors.warning} />
               <Text style={[styles.ratingText, { color: colors.warning }]}>
                  {review.rating}
               </Text>
            </View>
         </View>
         
         {review.comment && (
            <Text
               style={[styles.reviewComment, { color: colors.textSecondary }]}
               numberOfLines={3}
            >
               {review.comment}
            </Text>
         )}
         
         <Text style={[styles.cardDate, { color: colors.textMuted }]}>
            {new Date(review.createdAt).toLocaleDateString()}
         </Text>
      </View>
   );

   return (
      <>
         <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <ScrollView
               contentContainerStyle={styles.content}
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                     tintColor={colors.primary}
                  />
               }
            >
               <Text style={[styles.title, { color: colors.primary }]}>
                  My Profile
               </Text>

               {loading ? (
                  <ActivityIndicator size="large" color={colors.primary} />
               ) : (
                  <>
                     {/* User Info Section */}
                     <View
                        style={[
                           styles.userInfoCard,
                           {
                              backgroundColor: colors.surface,
                              borderColor: colors.surfaceBorder,
                           },
                        ]}
                     >
                        <View style={styles.userInfoHeader}>
                           <View>
                              <Text
                                 style={[styles.username, { color: colors.textPrimary }]}
                              >
                                 @{user?.username}
                              </Text>
                              <Text style={{ color: colors.textSecondary }}>
                                 {user?.email}
                              </Text>
                           </View>
                           <TouchableOpacity
                              onPress={() => setEditModalVisible(true)}
                              style={[
                                 styles.editButton,
                                 {
                                    backgroundColor: theme.withOpacity(
                                       colors.primary,
                                       0.1
                                    ),
                                 },
                              ]}
                           >
                              <MaterialIcons
                                 name="edit"
                                 size={20}
                                 color={colors.primary}
                              />
                           </TouchableOpacity>
                        </View>
                        
                        <View style={styles.statsRow}>
                           <View style={styles.statItem}>
                              <Text style={[styles.statValue, { color: colors.primary }]}>
                                 {bundles.length}
                              </Text>
                              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                                 Bundles
                              </Text>
                           </View>
                           <View style={styles.statItem}>
                              <Text style={[styles.statValue, { color: colors.primary }]}>
                                 {reviews.length}
                              </Text>
                              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                                 Reviews
                              </Text>
                           </View>
                        </View>
                     </View>

                     {/* Bundles Section */}
                     <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                           <Text
                              style={[styles.sectionTitle, { color: colors.textPrimary }]}
                           >
                              My Bundles
                           </Text>
                           {bundles.length > 0 && (
                              <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
                                 {bundles.length}
                              </Text>
                           )}
                        </View>
                        
                        {loadingBundles ? (
                           <ActivityIndicator size="small" color={colors.primary} />
                        ) : bundles.length > 0 ? (
                           bundles.map(renderBundleCard)
                        ) : (
                           <View
                              style={[
                                 styles.placeholder,
                                 { backgroundColor: colors.surfaceBorder },
                              ]}
                           >
                              <MaterialIcons
                                 name="inventory"
                                 size={32}
                                 color={colors.textMuted}
                              />
                              <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
                                 No bundles yet
                              </Text>
                              <Text style={[styles.placeholderSubtext, { color: colors.textMuted }]}>
                                 Create your first PC build
                              </Text>
                           </View>
                        )}
                     </View>

                     {/* Reviews Section */}
                     <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                           <Text
                              style={[styles.sectionTitle, { color: colors.textPrimary }]}
                           >
                              Review History
                           </Text>
                           {reviews.length > 0 && (
                              <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
                                 {reviews.length}
                              </Text>
                           )}
                        </View>
                        
                        {loadingReviews ? (
                           <ActivityIndicator size="small" color={colors.primary} />
                        ) : reviews.length > 0 ? (
                           reviews.map(renderReviewCard)
                        ) : (
                           <View
                              style={[
                                 styles.placeholder,
                                 { backgroundColor: colors.surfaceBorder },
                              ]}
                           >
                              <MaterialIcons
                                 name="rate-review"
                                 size={32}
                                 color={colors.textMuted}
                              />
                              <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
                                 No reviews yet
                              </Text>
                              <Text style={[styles.placeholderSubtext, { color: colors.textMuted }]}>
                                 Share your experience with products
                              </Text>
                           </View>
                        )}
                     </View>

                     {/* Logout Button */}
                     <TouchableOpacity
                        style={[
                           styles.logoutButton,
                           { backgroundColor: colors.error },
                        ]}
                        onPress={handleLogout}
                     >
                        <MaterialIcons name="logout" size={20} color={colors.textDark} />
                        <Text style={[styles.logoutText, { color: colors.textDark }]}>
                           Log Out
                        </Text>
                     </TouchableOpacity>
                  </>
               )}
            </ScrollView>
         </LinearGradient>

         {/* Edit Profile Modal */}
         <Modal
            visible={editModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setEditModalVisible(false)}
         >
            <View style={styles.modalOverlay}>
               <View
                  style={[
                     styles.modalContent,
                     { backgroundColor: colors.bgSecondary },
                  ]}
               >
                  <View style={styles.modalHeader}>
                     <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                        Edit Profile
                     </Text>
                     <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                        <MaterialIcons name="close" size={24} color={colors.textMuted} />
                     </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                     <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                           Username
                        </Text>
                        <TextInput
                           style={[
                              styles.input,
                              {
                                 backgroundColor: colors.surface,
                                 borderColor: colors.surfaceBorder,
                                 color: colors.textPrimary,
                              },
                           ]}
                           value={editForm.username}
                           onChangeText={(text) =>
                              setEditForm({ ...editForm, username: text })
                           }
                           placeholder="Enter username"
                           placeholderTextColor={colors.textMuted}
                        />
                     </View>

                     <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                           Email
                        </Text>
                        <TextInput
                           style={[
                              styles.input,
                              {
                                 backgroundColor: colors.surface,
                                 borderColor: colors.surfaceBorder,
                                 color: colors.textPrimary,
                              },
                           ]}
                           value={editForm.email}
                           onChangeText={(text) =>
                              setEditForm({ ...editForm, email: text })
                           }
                           placeholder="Enter email"
                           placeholderTextColor={colors.textMuted}
                           keyboardType="email-address"
                           autoCapitalize="none"
                        />
                     </View>

                     <TouchableOpacity
                        style={[
                           styles.saveButton,
                           { backgroundColor: colors.primary },
                        ]}
                        onPress={handleUpdateProfile}
                     >
                        <Text style={[styles.saveButtonText, { color: colors.textDark }]}>
                           Save Changes
                        </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>
      </>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 30,
   },
   content: {
      flexGrow: 1,
      paddingBottom: 40,
   },
   title: {
      fontSize: 32,
      fontWeight: '800',
      letterSpacing: 1.2,
      marginBottom: 16,
   },
   
   // User Info Card
   userInfoCard: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
   },
   userInfoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
   },
   username: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 4,
   },
   editButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
   },
   statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.1)',
   },
   statItem: {
      alignItems: 'center',
   },
   statValue: {
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 4,
   },
   statLabel: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
   },

   // Section
   section: {
      marginBottom: 32,
   },
   sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
   },
   sectionCount: {
      fontSize: 14,
      fontWeight: '600',
   },

   // Cards
   card: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
   },
   cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
   },
   cardHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
   },
   cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      flex: 1,
   },
   cardActions: {
      flexDirection: 'row',
      gap: 8,
   },
   iconButton: {
      padding: 4,
   },
   cardContent: {
      marginBottom: 8,
   },
   infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
   },
   infoText: {
      fontSize: 13,
      fontWeight: '600',
   },
   scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   scoreLabel: {
      fontSize: 11,
      fontWeight: '600',
      width: 80,
   },
   scoreTrack: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
   },
   scoreFill: {
      height: '100%',
      borderRadius: 3,
   },
   scoreValue: {
      fontSize: 12,
      fontWeight: '700',
      minWidth: 36,
      textAlign: 'right',
   },
   cardDate: {
      fontSize: 11,
      fontWeight: '600',
   },
   ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
   },
   ratingText: {
      fontSize: 14,
      fontWeight: '700',
   },
   reviewComment: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 8,
   },

   // Placeholder
   placeholder: {
      borderRadius: 12,
      paddingVertical: 32,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
   },
   placeholderText: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 12,
   },
   placeholderSubtext: {
      fontSize: 13,
      marginTop: 4,
   },

   // Logout Button
   logoutButton: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
   },
   logoutText: {
      fontSize: 18,
      fontWeight: '700',
   },

   // Modal
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'flex-end',
   },
   modalContent: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 20,
      paddingBottom: 40,
      paddingHorizontal: 24,
      minHeight: 400,
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
   },
   modalTitle: {
      fontSize: 24,
      fontWeight: '800',
   },
   modalBody: {
      gap: 20,
   },
   inputGroup: {
      gap: 8,
   },
   inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
   },
   input: {
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      borderWidth: 1,
   },
   saveButton: {
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 12,
   },
   saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
   },
});
