import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import PartDetailScreen from '../screens/PartDetailScreen';
import BundleSummaryScreen from '../screens/BundleSummaryScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
   return (
      <Stack.Navigator
         initialRouteName="Main"
         screenOptions={{ headerShown: false }}
      >
         <Stack.Screen name="Main" component={TabNavigator} />
         <Stack.Screen name="PartDetail" component={PartDetailScreen} />
         <Stack.Screen name="Summary" component={BundleSummaryScreen} />
         <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
   );
}
