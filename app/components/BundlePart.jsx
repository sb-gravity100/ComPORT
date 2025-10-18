// components/BundlePart.js
import React, { useState } from 'react';
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   Modal,
   FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BundlePart({
   category,
   part,
   selectedSource = null,
   isSelected,
   colors,
   theme,
   glowColor = null,
   onSelect,
   onRemove,
   onChangeSource,
   missingRequired,
}) {
   const [showSourceModal, setShowSourceModal] = useState(false);

   const borderColor = missingRequired
      ? colors.error
      : isSelected
      ? glowColor || colors.primary
      : colors.surfaceBorder;

   const handleChangeSource = (source) => {
      onChangeSource(category.id, source);
      setShowSourceModal(false);
   };

   return (
      <>
         <View
            style={[
               styles.card,
               { backgroundColor: colors.surface, borderColor },
            ]}
         >
            <View style={styles.header}>
               <View style={styles.titleRow}>
                  <View
                     style={[
                        styles.iconContainer,
                        {
                           backgroundColor: theme.withOpacity(
                              colors.primary,
                              0.1
                           ),
                        },
                     ]}
                  >
                     <MaterialIcons
                        name={category.icon}
                        size={24}
                        color={colors.primary}
                     />
                  </View>
                  <View style={styles.info}>
                     <View style={styles.nameRow}>
                        <Text
                           style={[styles.name, { color: colors.textPrimary }]}
                        >
                           {category.name}
                        </Text>
                        {category.required && (
                           <View
                              style={[
                                 styles.requiredBadge,
                                 {
                                    backgroundColor: theme.withOpacity(
                                       colors.error,
                                       0.1
                                    ),
                                 },
                              ]}
                           >
                              <Text
                                 style={[
                                    styles.requiredText,
                                    { color: colors.error },
                                 ]}
                              >
                                 Required
                              </Text>
                           </View>
                        )}
                     </View>
                     <Text style={[styles.id, { color: colors.textMuted }]}>
                        {category.id}
                     </Text>
                  </View>
               </View>
            </View>

            {isSelected ? (
               <View style={styles.selected}>
                  <View style={styles.partInfo}>
                     <Text
                        style={[styles.partName, { color: colors.textPrimary }]}
                        numberOfLines={2}
                     >
                        {part.name}
                     </Text>
                     <Text
                        style={[
                           styles.partBrand,
                           { color: colors.textSecondary },
                        ]}
                     >
                        {part.brand}
                     </Text>
                     {selectedSource && (
                        <TouchableOpacity
                           style={styles.sourceInfo}
                           onPress={() =>
                              part.sources?.length > 1 &&
                              setShowSourceModal(true)
                           }
                        >
                           <MaterialIcons
                              name="store"
                              size={12}
                              color={colors.textMuted}
                           />
                           <Text
                              style={[
                                 styles.partShop,
                                 { color: colors.textMuted },
                              ]}
                           >
                              {selectedSource.shopName}
                           </Text>
                           {part.sources?.length > 1 && (
                              <MaterialIcons
                                 name="arrow-drop-down"
                                 size={16}
                                 color={colors.textMuted}
                              />
                           )}
                        </TouchableOpacity>
                     )}
                     <Text
                        style={[styles.partPrice, { color: colors.primary }]}
                     >
                        ₱{(part.selectedPrice || 0).toLocaleString()}
                     </Text>
                  </View>
                  <View style={styles.actions}>
                     <TouchableOpacity
                        style={[
                           styles.change,
                           { backgroundColor: colors.bgTertiary },
                        ]}
                        onPress={() => onSelect(category)}
                     >
                        <MaterialIcons
                           name="swap-horiz"
                           size={18}
                           color={colors.primary}
                        />
                     </TouchableOpacity>
                     <TouchableOpacity
                        style={[
                           styles.remove,
                           {
                              backgroundColor: theme.withOpacity(
                                 colors.error,
                                 0.1
                              ),
                           },
                        ]}
                        onPress={() => onRemove(category.id)}
                     >
                        <MaterialIcons
                           name="close"
                           size={18}
                           color={colors.error}
                        />
                     </TouchableOpacity>
                  </View>
               </View>
            ) : (
               <TouchableOpacity
                  style={[styles.select, { borderColor: colors.primary }]}
                  onPress={() => onSelect(category)}
               >
                  <MaterialIcons name="add" size={20} color={colors.primary} />
                  <Text style={[styles.selectText, { color: colors.primary }]}>
                     Select {category.name}
                  </Text>
               </TouchableOpacity>
            )}
         </View>

         {/* Source Selection Modal */}
         <Modal
            visible={showSourceModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowSourceModal(false)}
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
                        Select Shop
                     </Text>
                     <TouchableOpacity
                        onPress={() => setShowSourceModal(false)}
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

                  <FlatList
                     data={part?.sources || []}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({ item }) => (
                        <TouchableOpacity
                           style={[
                              styles.sourceItem,
                              {
                                 backgroundColor: colors.surface,
                                 borderColor:
                                    selectedSource?.shopName === item.shopName
                                       ? colors.primary
                                       : colors.surfaceBorder,
                              },
                           ]}
                           onPress={() => handleChangeSource(item)}
                        >
                           <View style={styles.sourceDetails}>
                              <Text
                                 style={[
                                    styles.sourceName,
                                    { color: colors.textPrimary },
                                 ]}
                              >
                                 {item.shopName}
                              </Text>
                              <View style={styles.sourceRow}>
                                 <Text
                                    style={[
                                       styles.sourcePrice,
                                       { color: colors.primary },
                                    ]}
                                 >
                                    ₱{item.price.toLocaleString()}
                                 </Text>
                                 {item.inStock ? (
                                    <View
                                       style={[
                                          styles.stockBadge,
                                          {
                                             backgroundColor: theme.withOpacity(
                                                colors.success,
                                                0.1
                                             ),
                                          },
                                       ]}
                                    >
                                       <Text
                                          style={[
                                             styles.stockText,
                                             { color: colors.success },
                                          ]}
                                       >
                                          In Stock
                                       </Text>
                                    </View>
                                 ) : (
                                    <View
                                       style={[
                                          styles.stockBadge,
                                          {
                                             backgroundColor: theme.withOpacity(
                                                colors.error,
                                                0.1
                                             ),
                                          },
                                       ]}
                                    >
                                       <Text
                                          style={[
                                             styles.stockText,
                                             { color: colors.error },
                                          ]}
                                       >
                                          Out of Stock
                                       </Text>
                                    </View>
                                 )}
                              </View>
                              {item.shipping?.cost > 0 && (
                                 <Text
                                    style={[
                                       styles.shippingText,
                                       { color: colors.textMuted },
                                    ]}
                                 >
                                    +₱{item.shipping.cost} shipping
                                 </Text>
                              )}
                           </View>
                           {selectedSource?.shopName === item.shopName && (
                              <MaterialIcons
                                 name="check-circle"
                                 size={24}
                                 color={colors.primary}
                              />
                           )}
                        </TouchableOpacity>
                     )}
                  />
               </View>
            </View>
         </Modal>
      </>
   );
}

const styles = StyleSheet.create({
   card: {
      borderWidth: 2,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
   },
   header: { marginBottom: 12 },
   titleRow: { flexDirection: 'row', alignItems: 'center' },
   iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
   },
   info: { flex: 1 },
   nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   name: { fontSize: 18, fontWeight: '600' },
   id: { fontSize: 13 },
   requiredBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
   },
   requiredText: { fontSize: 12, fontWeight: '600' },
   selected: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   partInfo: { flex: 1 },
   partName: { fontSize: 16, fontWeight: '600' },
   partBrand: { fontSize: 14 },
   partShop: { fontSize: 11, fontWeight: '600' },
   partPrice: { fontSize: 14, fontWeight: '600', marginTop: 4 },
   sourceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
   },
   actions: { flexDirection: 'row', gap: 8 },
   change: {
      padding: 8,
      borderRadius: 8,
   },
   remove: {
      padding: 8,
      borderRadius: 8,
   },
   select: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1.5,
      borderRadius: 12,
      padding: 12,
      justifyContent: 'center',
   },
   selectText: { fontSize: 15, fontWeight: '600' },
   sourceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      marginVertical: 6,
      borderWidth: 1,
      borderRadius: 12,
   },

   sourceDetails: {
      flex: 1,
      marginRight: 12,
   },

   sourceName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
   },

   sourceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8, // or use marginRight on children if gap isn't supported
      marginBottom: 4,
   },

   sourcePrice: {
      fontSize: 15,
      fontWeight: '700',
   },

   stockBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
   },

   stockText: {
      fontSize: 12,
      fontWeight: '600',
   },

   shippingText: {
      fontSize: 13,
      marginTop: 2,
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: '#ccc', // or use colors.surfaceBorder if theme-aware
   },

   modalTitle: {
      fontSize: 18,
      fontWeight: '700',
   },

   closeButton: {
      padding: 8,
      borderRadius: 8,
   },
});
