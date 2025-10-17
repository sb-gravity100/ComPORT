import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { getAndroidId } from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import api from '../services/api';

const AuthContext = createContext({});

let API_URL;

export function useAuth() {
   return useContext(AuthContext);
}
export function AuthProvider({ children }) {
   const [authState, setAuthState] = useState({
      token: null,
      authenticated: false,
   });

   useEffect(() => {
      const DEV_URL = Constants.expoGoConfig?.debuggerHost
         ?.split(':')
         .shift()
         ?.concat(':6600/api');
      API_URL =
         process.env.NODE_ENV !== 'production'
            ? DEV_URL
            : process.env.EXPO_PUBLIC_DEV_API_URL;
      API_URL = 'http://' + API_URL;
      // console.log(Constants.expoGoConfig);
      console.log(API_URL);
      const loadToken = async () => {
         const token = await SecureStore.getItemAsync(
            process.env.EXPO_PUBLIC_TOKEN_KEY
         );
         if (!token) console.log('User not logged in');
         if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setAuthState((state) => ({
               token: token,
               authenticated: true,
            }));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
         }
      };
      loadToken();
   }, []);

   const register = async (username, email, password) => {
      try {
         return await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password,
         });
      } catch (e) {
         return {
            error: true,
            message: e.response?.data?.message,
            errors: e.response?.data?.errors,
         };
      }
   };

   const login = async (username, password) => {
      try {
         const result = await axios.post(`${API_URL}/auth/login`, {
            username,
            password,
         });
         // console.log(result.data);
         console.log(
            `User '${
               result.data.username
            }' logged in at device ${getAndroidId()}`
         );

         axios.defaults.headers.common[
            'Authorization'
         ] = `Bearer ${result?.data?.token}`;
         api.defaults.headers.common[
            'Authorization'
         ] = `Bearer ${result?.data?.token}`;

         setAuthState((state) => ({
            token: result?.data?.token,
            authenticated: true,
         }));

         await SecureStore.setItemAsync(
            process.env.EXPO_PUBLIC_TOKEN_KEY,
            result?.data?.token
         );

         return result;
      } catch (e) {
         // console.log(e.response.data);
         return {
            error: true,
            message: e.response?.data?.message || e.message,
         };
      }
   };

   const user = async () => {
      try {
         return await axios.get(`${API_URL}/auth/me`);
      } catch (e) {
         return {
            error: true,
            message: e.response?.data?.message || e.message,
         };
      }
   };

   const logout = async () => {
      await SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_TOKEN_KEY);
      axios.defaults.headers.common['Authorization'] = '';
      api.defaults.headers.common['Authorization'] = '';

      setAuthState(() => ({
         token: null,
         authenticated: false,
      }));
   };
   const value = {
      onRegister: register,
      onLogin: login,
      onLogout: logout,
      getUser: user,
      authState,
   };
   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
