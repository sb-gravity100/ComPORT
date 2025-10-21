import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import PartDetailScreen from '../screens/PartDetailScreen';
import BundleSummaryScreen from '../screens/BundleSummaryScreen';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../context/AuthContext';
import RegisterScreen from '../screens/RegisterScreen';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SavedBundleScreen from '../screens/SavedBundleScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
   const { authState, onLogout } = useAuth();
   const { navigate } = useNavigation();
   const insets = useSafeAreaInsets();

   useEffect(() => {
      if (authState.authenticated) {
         navigate('Main');
      }
   }, []);
   console.log(authState);
   return (
      <Stack.Navigator
         initialRouteName="Login"
         screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 1000,
            contentStyle: {
               paddingTop: insets.top,
               paddingBottom: insets.bottom,
            },
         }}
      >
         <Stack.Screen name="Main" component={TabNavigator} />
         <Stack.Screen name="PartDetail" component={PartDetailScreen} />
         <Stack.Screen name="Summary" component={BundleSummaryScreen} />
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="Register" component={RegisterScreen} />
         <Stack.Screen name="SavedBundle" component={SavedBundleScreen} />
         <Stack.Screen name="AddProduct" component={AddProductScreen} />
         <Stack.Screen name="EditProduct" component={EditProductScreen} />
      </Stack.Navigator>
   );
}
