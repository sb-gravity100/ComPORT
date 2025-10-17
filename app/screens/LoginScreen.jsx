import React, { useEffect, useRef, useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   TextInput,
   StatusBar,
   KeyboardAvoidingView,
   Platform,
   Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Keyboard } from 'react-native';

export default function LoginScreen() {
   const navigation = useNavigation();
   const { theme, isDark, toggleTheme } = useTheme();
   const { colors, gradients } = theme;
   const { onLogin, authState } = useAuth();

   const passwordRef = useRef(null);

   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState({
      username: '',
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

   useEffect(() => {
      if (authState.authenticated) {
         navigation.reset({
            index: 0,
            routes: [
               {
                  name: 'Main',
               },
            ],
         });
      }
   }, [authState]);

   const validate = () => {
      Keyboard.dismiss();
      const newErrors = { username: '', password: '' };
      if (!username.trim()) newErrors.username = 'Username is required';
      if (!password.trim()) newErrors.password = 'Password is required';
      setErrors(newErrors);
      return !Object.values(newErrors).some((msg) => msg !== '');
   };

   const handleLogin = async () => {
      if (!validate()) return;

      setLoading(true);
      const result = await onLogin(username, password);
      setLoading(false);

      // console.log(result);

      if (result?.error) {
         const newErrors = { username: '', password: '' };
         if (result.message?.toLowerCase().includes('user')) {
            newErrors.username = result.message;
         } else if (result.message?.toLowerCase().includes('password')) {
            newErrors.password = result.message;
         } else {
            // Alert.alert('Login Failed', result.message || 'Please try again.');
         }
         setErrors(newErrors);
      } else {
         console.log('Successful Login');
         navigation.reset({
            index: 0,
            routes: [
               {
                  name: 'Main',
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

   const hasErrors = Object.values(errors).some((msg) => msg !== '');

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
               <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.primary }]}>
                     Welcome Back
                  </Text>
                  <Text
                     style={[styles.subtitle, { color: colors.textSecondary }]}
                  >
                     Log in to continue building
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
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        style={inputStyle('username')}
                     />
                     <Text style={errorTextStyle}>
                        {errors.username ? errors.username : ''}
                     </Text>
                  </View>
                  <View>
                     <TextInput
                        ref={passwordRef}
                        placeholder="Password"
                        placeholderTextColor={colors.textMuted}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={inputStyle('password')}
                     />
                     <Text style={errorTextStyle}>
                        {errors.password ? errors.password : ''}
                     </Text>
                  </View>

                  <TouchableOpacity
                     style={[
                        styles.primaryButton,
                        { backgroundColor: colors.primary },
                     ]}
                     onPress={handleLogin}
                     activeOpacity={0.8}
                     disabled={loading}
                  >
                     <Text
                        style={[
                           styles.primaryButtonText,
                           { color: colors.textDark },
                        ]}
                     >
                        {loading ? 'Logging In...' : 'Log In'}
                     </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     onPress={() => {
                        navigation.reset({
                           index: 0,
                           routes: [
                              {
                                 name: 'Register',
                              },
                           ],
                        });
                     }}
                     style={styles.link}
                  >
                     <Text style={{ color: colors.textMuted }}>
                        Don't have an account?{' '}
                        <Text
                           style={{ color: colors.primary, fontWeight: '600' }}
                        >
                           Register
                        </Text>
                     </Text>
                  </TouchableOpacity>
               </View>
            </KeyboardAvoidingView>
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
