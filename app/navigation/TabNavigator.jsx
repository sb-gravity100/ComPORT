import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import theme from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import BundleBuilderScreen from '../screens/BundleBuilderScreen';
import ProductCatalogScreen from '../screens/ProductCatalogScreen';
import ProfileScreen from '../screens/ProfileScreen';

const { colors, spacing, typography } = theme;

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
   return (
      <Tab.Navigator
         initialRouteName="Home"
         screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => {
               let iconName;
               switch (route.name) {
                  case 'Home':
                     iconName = 'home';
                     break;
                  case 'Builder':
                     iconName = 'build';
                     break;
                  case 'Catalog':
                     iconName = 'view-list';
                     break;
                  case 'Profile':
                     iconName = 'person';
                     break;
                  default:
                     iconName = 'circle';
               }
               return (
                  <MaterialIcons
                     name={iconName}
                     size={focused ? size + 2 : size}
                     color={color}
                  />
               );
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarStyle: {
               backgroundColor: colors.bgPrimary,
               borderTopColor: theme.withOpacity(colors.primary, 0.1),
               borderTopWidth: 1,
               paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.sm,
               height: Platform.OS === 'ios' ? 88 : 64,
               elevation: 0,
               shadowColor: colors.primary,
               shadowOffset: { width: 0, height: -4 },
               shadowOpacity: 0.1,
               shadowRadius: 12,
            },
            tabBarLabelStyle: {
               fontSize: typography.xs,
               fontWeight: typography.semiBold,
               letterSpacing: typography.wide,
               marginTop: spacing.xs,
            },
            tabBarItemStyle: {
               paddingVertical: spacing.xs,
            },
         })}
      >
         <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
               tabBarLabel: 'Home',
            }}
         />
         <Tab.Screen
            name="Builder"
            component={BundleBuilderScreen}
            options={{
               tabBarLabel: 'Builder',
            }}
         />
         <Tab.Screen
            name="Catalog"
            component={ProductCatalogScreen}
            options={{
               tabBarLabel: 'Catalog',
            }}
         />
         <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
               tabBarLabel: 'Profile',
            }}
         />
      </Tab.Navigator>
   );
}
