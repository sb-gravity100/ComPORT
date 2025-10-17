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

export default function ProfileScreen() {
   const { theme, isDark } = useTheme();
   const { colors, gradients } = theme;
   const { onLogout, getUser } = useAuth();
   const navigation = useNavigation();

   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchUser = async () => {
         const result = await getUser();
         setUser(result.data?.user);
         setLoading(false);
      };
      fetchUser();
   }, []);

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
         onPress={() => navigation.push('BundleDetails', { id: bundle._id })}
      >
         <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            {bundle.name}
         </Text>
         <Text style={{ color: colors.textSecondary }}>
            ₱{bundle.totalPrice.toLocaleString()}
         </Text>
      </TouchableOpacity>
   );

   const renderReview = (review) => (
      <View
         key={review._id}
         style={[styles.card, { backgroundColor: colors.surface }]}
      >
         <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            {review.title || 'Untitled Review'}
         </Text>
         <Text style={{ color: colors.textSecondary }}>
            Rating: {review.rating} / 5
         </Text>
      </View>
   );

   return (
      <>
         <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
               <Text style={[styles.title, { color: colors.primary }]}>
                  My Profile
               </Text>

               {loading ? (
                  <ActivityIndicator size="large" color={colors.primary} />
               ) : (
                  <View style={styles.userInfo}>
                     <Text
                        style={[styles.username, { color: colors.textPrimary }]}
                     >
                        @{user?.username}
                     </Text>
                     <Text style={{ color: colors.textSecondary }}>
                        {user?.email}
                     </Text>
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

               <View style={styles.section}>
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
               </View>

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
});
