import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function PartCard({ product, onPress }) {
   const { theme } = useTheme();
   const { colors } = theme;

   const getCategoryIcon = (category) => {
      const icons = {
         CPU: 'memory',
         GPU: 'videocam',
         RAM: 'storage',
         Motherboard: 'dashboard',
         Storage: 'sd-storage',
         PSU: 'power',
         Case: 'ad-units',
      };
      return icons[category] || 'devices';
   };

   return (
      <TouchableOpacity
         style={[
            styles.card,
            {
               backgroundColor: colors.surface,
               borderColor: colors.surfaceBorder,
            },
         ]}
         onPress={onPress}
         activeOpacity={0.7}
      >
         <View style={styles.header}>
            <View
               style={[
                  styles.iconContainer,
                  { backgroundColor: theme.withOpacity(colors.primary, 0.1) },
               ]}
            >
               <MaterialIcons
                  name={getCategoryIcon(product.category)}
                  size={24}
                  color={colors.primary}
               />
            </View>
            <View style={styles.badges}>
               {product.availableAt > 0 ? (
                  <View
                     style={[
                        styles.badge,
                        {
                           backgroundColor: theme.withOpacity(
                              colors.success,
                              0.1
                           ),
                        },
                     ]}
                  >
                     <Text
                        style={[styles.badgeText, { color: colors.success }]}
                     >
                        {product.availableAt} shop
                        {product.availableAt !== 1 ? 's' : ''}
                     </Text>
                  </View>
               ) : (
                  <View
                     style={[
                        styles.badge,
                        {
                           backgroundColor: theme.withOpacity(
                              colors.error,
                              0.1
                           ),
                        },
                     ]}
                  >
                     <Text style={[styles.badgeText, { color: colors.error }]}>
                        Out of Stock
                     </Text>
                  </View>
               )}
            </View>
         </View>

         <Text style={[styles.category, { color: colors.textMuted }]}>
            {product.category}
         </Text>
         <Text
            style={[styles.name, { color: colors.textPrimary }]}
            numberOfLines={2}
         >
            {product.name}
         </Text>
         <Text style={[styles.brand, { color: colors.textSecondary }]}>
            {product.brand} • {product.model}
         </Text>

         <View style={styles.footer}>
            <View style={styles.priceContainer}>
               <Text style={[styles.priceLabel, { color: colors.textMuted }]}>
                  Price Range
               </Text>
               <Text style={[styles.priceRange, { color: colors.primary }]}>
                  ₱{product.priceRange.min.toLocaleString()} - ₱
                  {product.priceRange.max.toLocaleString()}
               </Text>
               <Text style={[styles.avgPrice, { color: colors.textMuted }]}>
                  Avg: ₱
                  {Math.round(product.priceRange.average).toLocaleString()}
               </Text>
            </View>

            <View style={styles.availability}>
               <MaterialIcons name="store" size={14} color={colors.textMuted} />
               <Text
                  style={[styles.shopsText, { color: colors.textSecondary }]}
               >
                  {product.sources.length} shop
                  {product.sources.length !== 1 ? 's' : ''}
               </Text>
            </View>

            {product.ratings?.overall?.average > 0 && (
               <View style={styles.rating}>
                  <MaterialIcons name="star" size={16} color={colors.warning} />
                  <Text
                     style={[
                        styles.ratingText,
                        { color: colors.textSecondary },
                     ]}
                  >
                     {product.ratings.overall.average.toFixed(1)} (
                     {product.ratings.overall.count})
                  </Text>
               </View>
            )}
         </View>

         {product.comfortScore > 0 && (
            <View style={styles.comfortBar}>
               <Text style={[styles.comfortLabel, { color: colors.textMuted }]}>
                  Comfort Score
               </Text>
               <View
                  style={[
                     styles.comfortTrack,
                     {
                        backgroundColor: theme.withOpacity(colors.primary, 0.2),
                     },
                  ]}
               >
                  <View
                     style={[
                        styles.comfortFill,
                        {
                           backgroundColor: colors.primary,
                           width: `${product.comfortScore}%`,
                        },
                     ]}
                  />
               </View>
               <Text style={[styles.comfortValue, { color: colors.primary }]}>
                  {product.comfortScore}
               </Text>
            </View>
         )}
      </TouchableOpacity>
   );
}

const styles = StyleSheet.create({
   card: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
   },
   iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
   },
   badges: {
      flexDirection: 'row',
      gap: 8,
   },
   badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
   },
   badgeText: {
      fontSize: 11,
      fontWeight: '600',
   },
   category: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
   },
   name: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
      lineHeight: 22,
   },
   brand: {
      fontSize: 13,
      marginBottom: 12,
   },
   footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
   },
   priceContainer: {
      flex: 1,
   },
   price: {
      fontSize: 20,
      fontWeight: '800',
      letterSpacing: 0.5,
   },
   priceRange: {
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 0.5,
      marginBottom: 2,
   },
   avgPrice: {
      fontSize: 11,
      fontWeight: '600',
   },
   rating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
   },
   ratingText: {
      fontSize: 13,
      fontWeight: '600',
   },
   comfortBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   comfortLabel: {
      fontSize: 11,
      fontWeight: '600',
   },
   comfortTrack: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
   },
   comfortFill: {
      height: '100%',
      borderRadius: 3,
   },
   comfortValue: {
      fontSize: 12,
      fontWeight: '700',
      minWidth: 24,
      textAlign: 'right',
   },
   availability: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
   },
   shopsText: {
      fontSize: 12,
      fontWeight: '600',
   },
   priceLabel: {
      fontSize: 10,
      fontWeight: '600',
      marginBottom: 2,
   },
});
