import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const categoryIcons = {
   CPU: 'memory',
   GPU: 'videocam',
   RAM: 'storage',
   Motherboard: 'dashboard',
   Storage: 'sd-storage',
   PSU: 'power',
   Case: 'ad-units',
};

export default function PartRow({
   category,
   part,
   source,
   colors,
   theme,
   isLast,
   styles,
}) {
   const iconName = categoryIcons[category] || 'device-hub';

   return (
      <View style={[styles.partRow, !isLast && styles.partRowBorder]}>
         <View style={styles.partLeft}>
            <View
               style={[
                  styles.partIconSmall,
                  {
                     backgroundColor: theme.withOpacity(colors.primary, 0.1),
                  },
               ]}
            >
               <MaterialIcons
                  name={iconName}
                  size={20}
                  color={colors.primary}
               />
            </View>
            <View style={styles.partDetails}>
               <Text style={[styles.partCategory, { color: colors.textMuted }]}>
                  {category}
               </Text>
               <Text
                  style={[styles.partNameSmall, { color: colors.textPrimary }]}
                  numberOfLines={1}
               >
                  {part.name}
               </Text>
               <Text
                  style={[
                     styles.partBrandSmall,
                     { color: colors.textSecondary },
                  ]}
               >
                  {part.brand}
               </Text>
               {source && (
                  <View style={styles.shopBadge}>
                     <MaterialIcons
                        name="store"
                        size={10}
                        color={colors.textMuted}
                     />
                     <Text
                        style={[styles.shopName, { color: colors.textMuted }]}
                     >
                        {source.shopName}
                     </Text>
                  </View>
               )}
            </View>
         </View>
         <View style={styles.priceColumn}>
            <Text style={[styles.partPriceSmall, { color: colors.primary }]}>
               ₱
               {(
                  part.selectedPrice ||
                  part.priceRange?.average ||
                  part.price ||
                  0
               ).toLocaleString()}
            </Text>
            {source?.shipping?.cost > 0 && (
               <Text style={[styles.shippingNote, { color: colors.textMuted }]}>
                  +₱{source.shipping.cost} shipping
               </Text>
            )}
         </View>
      </View>
   );
}
