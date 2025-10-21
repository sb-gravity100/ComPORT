import React, { useEffect, useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   StatusBar,
   ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, Modal } from 'react-native';
import { updateUser } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function ProfileScreen() {
   const { theme, isDark } = useTheme();
   const { colors, gradients } = theme;
   const { onLogout, getUser } = useAuth();
   const navigation = useNavigation();
   const { showToast } = useToast();

   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [editMode, setEditMode] = useState(false);
   const [newUsername, setNewUsername] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [updating, setUpdating] = useState(false);

   useEffect(() => {
      const fetchUser = async () => {
         const result = await getUser();
         setUser(result.data?.user);
         setNewUsername(result.data?.user?.username || '');
         setLoading(false);
      };
      fetchUser();
   }, []);

   const handleUpdateUser = async () => {
      if (newPassword && newPassword !== confirmPassword) {
         showToast('Passwords do not match', 'error');
         return;
      }

      setUpdating(true);
      const updates = {};
      if (newUsername !== user.username) updates.username = newUsername;
      if (newPassword) updates.password = newPassword;
      if (confirmPassword) updates.oldPassword = confirmPassword;

      const result = await updateUser(updates);
      setUpdating(false);

      if (!result.error) {
         showToast('Profile updated successfully', 'success');
         setEditMode(false);
         setNewPassword('');
         setConfirmPassword('');
         // Refresh user data
         const refreshResult = await getUser();
         setUser(refreshResult.data?.user);
      } else {
         showToast(result.message || 'Update failed', 'error');
      }
   };

   const handleLogout = async () => {
      await onLogout();
      navigation.reset({
         index: 0,
         routes: [{ name: 'Login' }],
      });
   };

   const renderBundle = (bundle) => (
      <TouchableOpacity
         key={bundle._id}
         style={[styles.card, { backgroundColor: colors.surface }]}
         onPress={() =>
            navigation.push('SavedBundle', { bundleId: bundle._id })
         }
      >
         <View style={styles.bundleCardHeader}>
            <View style={{ flex: 1 }}>
               <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  {bundle.name}
               </Text>
               <Text
                  style={{
                     color: colors.textSecondary,
                     fontSize: 12,
                     marginTop: 4,
                  }}
               >
                  {bundle.products?.length || 0} parts
               </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
               <Text
                  style={{
                     color: colors.primary,
                     fontSize: 18,
                     fontWeight: '700',
                  }}
               >
                  ₱{bundle.totalPrice?.toLocaleString()}
               </Text>
               {bundle.comfortProfile?.overall && (
                  <Text
                     style={{
                        color: colors.textMuted,
                        fontSize: 11,
                        marginTop: 4,
                     }}
                  >
                     Comfort: {bundle.comfortProfile.overall}
                  </Text>
               )}
            </View>
         </View>
         <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.textMuted}
            style={{
               position: 'absolute',
               right: 16,
               top: '50%',
               marginTop: -12,
            }}
         />
      </TouchableOpacity>
   );

   return (
      <>
         <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
               <Text style={[styles.title, { color: colors.primary }]}>
                  My Profile
               </Text>

               {!loading && (
                  <View style={styles.userInfo}>
                     <View style={styles.userHeader}>
                        <View style={{ flex: 1 }}>
                           <Text
                              style={[
                                 styles.username,
                                 { color: colors.textPrimary },
                              ]}
                           >
                              @{user?.username}
                           </Text>
                           <Text style={{ color: colors.textSecondary }}>
                              {user?.email}
                           </Text>
                        </View>
                        <TouchableOpacity
                           style={[
                              styles.editButton,
                              { backgroundColor: colors.primary },
                           ]}
                           onPress={() => setEditMode(true)}
                        >
                           <MaterialIcons
                              name="edit"
                              size={20}
                              color={colors.textDark}
                           />
                        </TouchableOpacity>
                     </View>
                  </View>
               )}

               {user?.admin && (
                  <View style={styles.section}>
                     <Text
                        style={[styles.sectionTitle, { color: colors.warning }]}
                     >
                        Admin Tools
                     </Text>
                     <TouchableOpacity
                        style={[
                           styles.card,
                           {
                              backgroundColor: colors.surface,
                              borderWidth: 1,
                              borderColor: colors.primary,
                           },
                        ]}
                        onPress={() => navigation.navigate('AddProduct')}
                     >
                        <View
                           style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 12,
                           }}
                        >
                           <MaterialIcons
                              name="add-box"
                              size={24}
                              color={colors.primary}
                           />
                           <Text
                              style={[
                                 styles.cardTitle,
                                 { color: colors.primary },
                              ]}
                           >
                              Add New Product
                           </Text>
                        </View>
                     </TouchableOpacity>
                  </View>
               )}

               <View style={styles.section}>
                  <Text
                     style={[styles.sectionTitle, { color: colors.textMuted }]}
                  >
                     Saved Bundles
                  </Text>
                  {user?.savedBundles?.length ? (
                     user.savedBundles.map(renderBundle)
                  ) : (
                     <View
                        style={[
                           styles.placeholder,
                           { backgroundColor: colors.surfaceBorder },
                        ]}
                     >
                        <Text style={{ color: colors.textMuted }}>
                           No bundles yet
                        </Text>
                     </View>
                  )}
               </View>

               {/* <View style={styles.section}>
                  <Text
                     style={[styles.sectionTitle, { color: colors.textMuted }]}
                  >
                     Review History
                  </Text>
                  {user?.reviews?.length ? (
                     user.reviews.map(renderReview)
                  ) : (
                     <View
                        style={[
                           styles.placeholder,
                           { backgroundColor: colors.surfaceBorder },
                        ]}
                     >
                        <Text style={{ color: colors.textMuted }}>
                           No reviews yet
                        </Text>
                     </View>
                  )}
               </View> */}

               <TouchableOpacity
                  style={[
                     styles.logoutButton,
                     { backgroundColor: colors.error },
                  ]}
                  onPress={handleLogout}
               >
                  <Text style={[styles.logoutText, { color: colors.textDark }]}>
                     Log Out
                  </Text>
               </TouchableOpacity>
            </ScrollView>
            <Modal
               visible={editMode}
               animationType="slide"
               transparent={true}
               onRequestClose={() => setEditMode(false)}
            >
               <View style={styles.modalOverlay}>
                  <View
                     style={[
                        styles.modalContent,
                        { backgroundColor: colors.bgPrimary },
                     ]}
                  >
                     <View style={styles.modalHeader}>
                        <Text
                           style={[
                              styles.modalTitle,
                              { color: colors.textPrimary },
                           ]}
                        >
                           Edit Profile
                        </Text>
                        <TouchableOpacity
                           onPress={() => setEditMode(false)}
                           style={[
                              styles.closeButton,
                              { backgroundColor: colors.surface },
                           ]}
                        >
                           <MaterialIcons
                              name="close"
                              size={24}
                              color={colors.textPrimary}
                           />
                        </TouchableOpacity>
                     </View>

                     <View style={styles.modalBody}>
                        <View style={styles.inputGroup}>
                           <Text
                              style={[
                                 styles.inputLabel,
                                 { color: colors.textSecondary },
                              ]}
                           >
                              Username
                           </Text>
                           <TextInput
                              style={[
                                 styles.input,
                                 {
                                    backgroundColor: colors.surface,
                                    color: colors.textPrimary,
                                    borderColor: colors.surfaceBorder,
                                 },
                              ]}
                              value={newUsername}
                              onChangeText={setNewUsername}
                              placeholder="Enter username"
                              placeholderTextColor={colors.textMuted}
                           />
                        </View>

                        <View style={styles.inputGroup}>
                           <Text
                              style={[
                                 styles.inputLabel,
                                 { color: colors.textSecondary },
                              ]}
                           >
                              New Password (optional)
                           </Text>
                           <TextInput
                              style={[
                                 styles.input,
                                 {
                                    backgroundColor: colors.surface,
                                    color: colors.textPrimary,
                                    borderColor: colors.surfaceBorder,
                                 },
                              ]}
                              value={newPassword}
                              onChangeText={setNewPassword}
                              placeholder="Leave blank to keep current"
                              placeholderTextColor={colors.textMuted}
                              secureTextEntry
                           />
                        </View>

                        {newPassword && (
                           <View style={styles.inputGroup}>
                              <Text
                                 style={[
                                    styles.inputLabel,
                                    { color: colors.textSecondary },
                                 ]}
                              >
                                 Confirm Password
                              </Text>
                              <TextInput
                                 style={[
                                    styles.input,
                                    {
                                       backgroundColor: colors.surface,
                                       color: colors.textPrimary,
                                       borderColor: colors.surfaceBorder,
                                    },
                                 ]}
                                 value={confirmPassword}
                                 onChangeText={setConfirmPassword}
                                 placeholder="Confirm new password"
                                 placeholderTextColor={colors.textMuted}
                                 secureTextEntry
                              />
                           </View>
                        )}

                        <TouchableOpacity
                           style={[
                              styles.updateButton,
                              { backgroundColor: colors.primary },
                           ]}
                           onPress={handleUpdateUser}
                           disabled={updating}
                        >
                           <Text
                              style={[
                                 styles.updateButtonText,
                                 { color: colors.textDark },
                              ]}
                           >
                              {updating ? 'Updating...' : 'Update Profile'}
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
            </Modal>
         </LinearGradient>
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
   userInfo: {
      marginBottom: 32,
   },
   username: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 4,
   },
   section: {
      marginBottom: 32,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
   },
   placeholder: {
      borderRadius: 12,
      paddingVertical: 24,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
   },
   card: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
   },
   cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
   },
   logoutButton: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 16,
   },
   logoutText: {
      fontSize: 18,
      fontWeight: '700',
   },
   // Add these to the existing StyleSheet.create
   userHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   editButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
   },
   bundleCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 30,
   },
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
   },
   modalContent: {
      height: '70%',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
   },
   modalTitle: {
      fontSize: 22,
      fontWeight: '800',
   },
   closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
   },
   modalBody: {
      padding: 16,
   },
   inputGroup: {
      marginBottom: 16,
   },
   inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
   },
   input: {
      height: 48,
      borderRadius: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      fontSize: 15,
   },
   updateButton: {
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 24,
   },
   updateButtonText: {
      fontSize: 16,
      fontWeight: '700',
   },
});
