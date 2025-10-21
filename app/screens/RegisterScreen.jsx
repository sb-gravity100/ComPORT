import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   TextInput,
   StatusBar,
   KeyboardAvoidingView,
   Platform,
   ScrollView,
   Alert,
   Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterScreen() {
   const navigation = useNavigation();
   const { theme, isDark, toggleTheme } = useTheme();
   const { colors, gradients, spacing } = theme;
   const { onRegister } = useAuth();
   const { showToast } = useToast();

   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);

   const [errors, setErrors] = useState({
      username: '',
      email: '',
      password: '',
   });

   const [keyboardVisible, setKeyboardVisible] = useState(false);

   useEffect(() => {
      const showSub = Keyboard.addListener('keyboardDidShow', () =>
         setKeyboardVisible(true)
      );
      const hideSub = Keyboard.addListener('keyboardDidHide', () =>
         setKeyboardVisible(false)
      );
      return () => {
         showSub.remove();
         hideSub.remove();
      };
   }, []);

   const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
   };

   const handleRegister = async () => {
      const newErrors = { username: '', email: '', password: '' };

      if (!username.trim()) {
         newErrors.username = 'Username is required';
      }

      if (!email.trim()) {
         newErrors.email = 'Email is required';
      } else if (!validateEmail(email)) {
         newErrors.email = 'Invalid email format';
      }

      if (!password.trim()) {
         newErrors.password = 'Password is required';
      }

      if (username.trim().length < 3) {
         newErrors.username = 'Username must be at least 3 characters';
      }

      if (password.trim().length < 6) {
         newErrors.password = 'Password must be at least 6 characters';
      }
      console.log(newErrors);

      setErrors(newErrors);

      const hasErrors = Object.values(newErrors).some((msg) => msg !== '');
      if (hasErrors) return;

      setLoading(true);
      const result = await onRegister(username, email, password);
      setLoading(false);

      if (result?.error) {
         // Show backend error (e.g. "Username already exists")
         if (result?.errors) {
            newErrors.email = result?.errors.email;
            newErrors.username = result?.errors.username;
         }
      } else {
         Alert.alert('Success', 'Account created successfully!');
         navigation.reset({
            index: 0,
            routes: [
               {
                  name: 'Login',
               },
            ],
         });
      }
   };

   const inputStyle = (field) => [
      styles.input,
      {
         backgroundColor: colors.surface,
         color: colors.textPrimary,
         borderColor: errors[field] ? colors.error : colors.surfaceBorder,
      },
   ];

   const errorTextStyle = {
      color: colors.error,
      fontSize: 13,
      marginTop: 2,
      marginLeft: 4,
      lineHeight: 16,
   };

   return (
      <>
         <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <TouchableOpacity
               style={[
                  styles.themeToggle,
                  {
                     backgroundColor: colors.surface,
                     display: !keyboardVisible ? undefined : 'none',
                  },
               ]}
               onPress={toggleTheme}
            >
               <MaterialIcons
                  name={isDark ? 'light-mode' : 'dark-mode'}
                  size={24}
                  color={colors.primary}
               />
            </TouchableOpacity>

            <KeyboardAvoidingView
               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
               style={styles.content}
            >
               <ScrollView contentContainerStyle={styles.scroll}>
                  <View style={styles.header}>
                     <Text style={[styles.title, { color: colors.primary }]}>
                        Create Account
                     </Text>
                     <Text
                        style={[
                           styles.subtitle,
                           { color: colors.textSecondary },
                        ]}
                     >
                        Join ComPORT and start building
                     </Text>
                  </View>

                  <View style={styles.form}>
                     <View>
                        <TextInput
                           placeholder="Username"
                           placeholderTextColor={colors.textMuted}
                           value={username}
                           onChangeText={setUsername}
                           autoCapitalize="none"
                           style={inputStyle('username')}
                        />
                        <Text style={errorTextStyle}>
                           {errors.username ? errors.username : null}
                        </Text>
                     </View>
                     <View>
                        <TextInput
                           placeholder="Email"
                           placeholderTextColor={colors.textMuted}
                           keyboardType="email-address"
                           autoCapitalize="none"
                           value={email}
                           onChangeText={setEmail}
                           style={inputStyle('email')}
                        />
                        <Text style={errorTextStyle}>
                           {errors.email ? errors.email : null}
                        </Text>
                     </View>
                     <View>
                        <TextInput
                           placeholder="Password"
                           placeholderTextColor={colors.textMuted}
                           secureTextEntry
                           value={password}
                           onChangeText={setPassword}
                           style={inputStyle('password')}
                        />
                        <Text style={errorTextStyle}>
                           {errors.password ? errors.password : null}
                        </Text>
                     </View>

                     <TouchableOpacity
                        style={[
                           styles.primaryButton,
                           { backgroundColor: colors.primary },
                        ]}
                        onPress={handleRegister}
                        activeOpacity={0.8}
                        disabled={loading}
                     >
                        <Text
                           style={[
                              styles.primaryButtonText,
                              { color: colors.textDark },
                           ]}
                        >
                           {loading ? 'Registering...' : 'Register'}
                        </Text>
                     </TouchableOpacity>

                     <TouchableOpacity
                        onPress={() => {
                           navigation.reset({
                              index: 0,
                              routes: [
                                 {
                                    name: 'Login',
                                 },
                              ],
                           });
                        }}
                        style={styles.link}
                     >
                        <Text style={{ color: colors.textMuted }}>
                           Already have an account?{' '}
                           <Text
                              style={{
                                 color: colors.primary,
                                 fontWeight: '600',
                              }}
                           >
                              Login
                           </Text>
                        </Text>
                     </TouchableOpacity>
                  </View>
               </ScrollView>
            </KeyboardAvoidingView>
         </LinearGradient>
      </>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 10,
   },
   themeToggle: {
      position: 'absolute',
      top: 20,
      right: 24,
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
   },
   content: {
      flex: 1,
   },
   scroll: {
      flexGrow: 1,
      justifyContent: 'center',
   },
   header: {
      alignItems: 'center',
      marginBottom: 48,
   },
   title: {
      fontSize: 36,
      fontWeight: '800',
      letterSpacing: 1.5,
      marginBottom: 8,
   },
   subtitle: {
      fontSize: 15,
      letterSpacing: 0.5,
   },
   form: {
      gap: 5,
   },
   input: {
      height: 56,
      borderRadius: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      fontSize: 16,
   },
   primaryButton: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 16,
   },
   primaryButtonText: {
      fontSize: 18,
      fontWeight: '700',
   },
   link: {
      marginTop: 16,
      alignItems: 'center',
   },
});
