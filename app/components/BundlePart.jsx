// components/BundlePart.js
import React, { useState } from 'react';
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   Modal,
   FlatList,
   ScrollView,
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
                        ₱
                        {(
                           selectedSource?.price ||
                           part.priceRange?.average ||
                           0
                        ).toLocaleString()}
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
                     <View style={styles.modalTitleContainer}>
                        <MaterialIcons
                           name="store"
                           size={24}
                           color={colors.primary}
                        />
                        <View>
                           <Text
                              style={[
                                 styles.modalTitle,
                                 { color: colors.textPrimary },
                              ]}
                           >
                              Select Shop
                           </Text>
                           <Text
                              style={[
                                 styles.modalSubtitle,
                                 { color: colors.textMuted },
                              ]}
                           >
                              {part?.sources?.length || 0} available
                           </Text>
                        </View>
                     </View>
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

                  <ScrollView
                     style={styles.modalScroll}
                     contentContainerStyle={styles.modalScrollContent}
                     showsVerticalScrollIndicator={false}
                  >
                     {(part?.sources || []).map((item, index) => {
                        const isSelected =
                           selectedSource?.shopName === item.shopName;
                        const totalCost =
                           item.price + (item.shipping?.cost || 0);

                        return (
                           <TouchableOpacity
                              key={index}
                              style={[
                                 styles.sourceItem,
                                 {
                                    backgroundColor: isSelected
                                       ? theme.withOpacity(colors.primary, 0.1)
                                       : colors.surface,
                                    borderColor: isSelected
                                       ? colors.primary
                                       : colors.surfaceBorder,
                                 },
                              ]}
                              onPress={() => handleChangeSource(item)}
                              activeOpacity={0.7}
                           >
                              <View style={styles.sourceContent}>
                                 <View style={styles.sourceHeader}>
                                    <View style={styles.sourceShopRow}>
                                       <MaterialIcons
                                          name="store"
                                          size={18}
                                          color={colors.primary}
                                       />
                                       <Text
                                          style={[
                                             styles.sourceName,
                                             { color: colors.textPrimary },
                                          ]}
                                       >
                                          {item.shopName}
                                       </Text>
                                    </View>
                                    {isSelected && (
                                       <View
                                          style={[
                                             styles.selectedBadge,
                                             {
                                                backgroundColor: colors.primary,
                                             },
                                          ]}
                                       >
                                          <MaterialIcons
                                             name="check"
                                             size={14}
                                             color={colors.textDark}
                                          />
                                          <Text
                                             style={[
                                                styles.selectedText,
                                                { color: colors.textDark },
                                             ]}
                                          >
                                             Selected
                                          </Text>
                                       </View>
                                    )}
                                 </View>

                                 <View style={styles.sourcePricing}>
                                    <View style={styles.priceBreakdown}>
                                       <Text
                                          style={[
                                             styles.sourcePrice,
                                             { color: colors.primary },
                                          ]}
                                       >
                                          ₱{item.price.toLocaleString()}
                                       </Text>
                                       {item.shipping?.cost > 0 && (
                                          <Text
                                             style={[
                                                styles.shippingText,
                                                { color: colors.textMuted },
                                             ]}
                                          >
                                             + ₱{item.shipping.cost} shipping
                                          </Text>
                                       )}
                                       {item.shipping?.cost === 0 &&
                                          item.shipping?.available && (
                                             <Text
                                                style={[
                                                   styles.shippingText,
                                                   { color: colors.success },
                                                ]}
                                             >
                                                Free shipping
                                             </Text>
                                          )}
                                    </View>
                                    <View style={styles.totalContainer}>
                                       <Text
                                          style={[
                                             styles.totalLabel,
                                             { color: colors.textMuted },
                                          ]}
                                       >
                                          Total
                                       </Text>
                                       <Text
                                          style={[
                                             styles.totalPrice,
                                             { color: colors.textPrimary },
                                          ]}
                                       >
                                          ₱{totalCost.toLocaleString()}
                                       </Text>
                                    </View>
                                 </View>

                                 <View style={styles.sourceFooter}>
                                    {item.inStock ? (
                                       <View
                                          style={[
                                             styles.stockBadge,
                                             {
                                                backgroundColor:
                                                   theme.withOpacity(
                                                      colors.success,
                                                      0.1
                                                   ),
                                             },
                                          ]}
                                       >
                                          <MaterialIcons
                                             name="check-circle"
                                             size={14}
                                             color={colors.success}
                                          />
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
                                                backgroundColor:
                                                   theme.withOpacity(
                                                      colors.error,
                                                      0.1
                                                   ),
                                             },
                                          ]}
                                       >
                                          <MaterialIcons
                                             name="cancel"
                                             size={14}
                                             color={colors.error}
                                          />
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
                                    {item.shipping?.estimatedDays && (
                                       <View style={styles.deliveryBadge}>
                                          <MaterialIcons
                                             name="local-shipping"
                                             size={14}
                                             color={colors.textMuted}
                                          />
                                          <Text
                                             style={[
                                                styles.deliveryText,
                                                { color: colors.textMuted },
                                             ]}
                                          >
                                             {item.shipping.estimatedDays}
                                          </Text>
                                       </View>
                                    )}
                                 </View>
                              </View>
                           </TouchableOpacity>
                        );
                     })}
                  </ScrollView>
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
   sourceDetails: {
      flex: 1,
      marginRight: 12,
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

   shippingBadge: {
      fontSize: 11,
      fontWeight: '600',
   },
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'flex-end',
   },
   modalContent: {
      height: 500,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingBottom: 20,
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
   },
   modalTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: '700',
   },
   modalSubtitle: {
      fontSize: 13,
      fontWeight: '600',
      marginTop: 2,
   },
   closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
   },
   modalScroll: {
      flex: 1,
   },
   modalScrollContent: {
      padding: 16,
      paddingBottom: 24,
   },
   sourceItem: {
      borderRadius: 16,
      borderWidth: 2,
      marginBottom: 12,
      overflow: 'hidden',
   },
   sourceContent: {
      padding: 16,
   },
   sourceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
   },
   sourceShopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   sourceName: {
      fontSize: 16,
      fontWeight: '700',
   },
   selectedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
   },
   selectedText: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
   },
   sourcePricing: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
   },
   priceBreakdown: {
      flex: 1,
   },
   sourcePrice: {
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 4,
   },
   shippingText: {
      fontSize: 12,
      fontWeight: '600',
   },
   totalContainer: {
      alignItems: 'flex-end',
   },
   totalLabel: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 4,
   },
   totalPrice: {
      fontSize: 18,
      fontWeight: '700',
   },
   sourceFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
   },
   stockBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
   },
   stockText: {
      fontSize: 12,
      fontWeight: '700',
   },
   deliveryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
   },
   deliveryText: {
      fontSize: 12,
      fontWeight: '600',
   },
});
