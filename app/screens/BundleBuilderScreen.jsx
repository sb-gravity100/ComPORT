import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   TextInput,
   StatusBar,
   Alert,
   Modal,
   FlatList,
   ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { getProducts } from '../services/api';
import PartCard from '../components/PartCard';
import BundlePart from '../components/BundlePart';

const CATEGORIES = [
   { id: 'CPU', name: 'Processor', icon: 'memory', required: true },
   { id: 'GPU', name: 'Graphics Card', icon: 'videocam', required: false },
   { id: 'RAM', name: 'Memory', icon: 'storage', required: true },
   {
      id: 'Motherboard',
      name: 'Motherboard',
      icon: 'dashboard',
      required: true,
   },
   { id: 'Storage', name: 'Storage', icon: 'sd-storage', required: true },
   { id: 'PSU', name: 'Power Supply', icon: 'power', required: true },
   { id: 'Case', name: 'Case', icon: 'computer', required: false },
];

export default function BundleBuilderScreen() {
   const { theme, isDark } = useTheme();
   const { colors, gradients } = theme;
   const navigation = useNavigation();

   const [bundleName, setBundleName] = useState('');
   const [selectedParts, setSelectedParts] = useState({});
   const [totalPrice, setTotalPrice] = useState(0);

   // Modal state
   const [modalVisible, setModalVisible] = useState(false);
   const [currentCategory, setCurrentCategory] = useState(null);
   const [availableProducts, setAvailableProducts] = useState([]);
   const [loadingProducts, setLoadingProducts] = useState(false);

   const requiredCategories = CATEGORIES.filter((c) => c.required);
   const missingRequired = requiredCategories
      .filter((c) => !selectedParts[c.id])
      .map((c) => c.id);

   const openPartSelector = async (category) => {
      setCurrentCategory(category);
      setModalVisible(true);
      setLoadingProducts(true);

      const result = await getProducts({ category: category.id });

      if (!result.error) {
         setAvailableProducts(result.products || []);
      }
      setLoadingProducts(false);
   };

   const selectPart = (product) => {
      const previousPrice = selectedParts[currentCategory.id]?.price || 0;

      setSelectedParts((prev) => ({
         ...prev,
         [currentCategory.id]: product,
      }));

      setTotalPrice((prev) => prev - previousPrice + product.price);
      setModalVisible(false);
   };

   const removePart = (categoryId) => {
      const part = selectedParts[categoryId];
      if (part) {
         setTotalPrice((prev) => prev - part.price);
         setSelectedParts((prev) => {
            const newParts = { ...prev };
            delete newParts[categoryId];
            return newParts;
         });
      }
   };

   const handleSaveBundle = () => {
      if (!bundleName.trim()) return;

      if (missingRequired.length > 0) return;

      navigation.navigate('Summary', {
         bundleData: {
            name: bundleName,
            parts: selectedParts,
            totalPrice,
         },
      });
   };

   return (
      <>
         <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <View style={styles.header}>
               <Text style={[styles.title, { color: colors.primary }]}>
                  Build Your Bundle
               </Text>

               <View
                  style={[
                     styles.nameInputContainer,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
               >
                  <MaterialIcons
                     name="label"
                     size={20}
                     color={colors.textMuted}
                  />
                  <TextInput
                     style={[styles.nameInput, { color: colors.textPrimary }]}
                     placeholder="Bundle Name (e.g., Gaming PC 2024)"
                     placeholderTextColor={colors.textMuted}
                     value={bundleName}
                     onChangeText={setBundleName}
                  />
               </View>
            </View>

            <ScrollView
               contentContainerStyle={{
                  ...styles.content,
               }}
               showsVerticalScrollIndicator={false}
            >
               {CATEGORIES.map((category) => {
                  const part = selectedParts[category.id];
                  const isSelected = !!part;
                  const isMissing = missingRequired.includes(category.id);

                  return (
                     <BundlePart
                        key={category.id}
                        category={category}
                        part={part}
                        isSelected={isSelected}
                        missingRequired={isMissing}
                        colors={colors}
                        theme={theme}
                        onSelect={openPartSelector}
                        onRemove={removePart}
                     />
                  );
               })}

               {/* Compatibility Status */}
               <View
                  style={[
                     styles.compatibilityCard,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
               >
                  <View style={styles.compatibilityHeader}>
                     <MaterialIcons
                        name="check-circle"
                        size={24}
                        color={colors.success}
                     />
                     <Text
                        style={[
                           styles.compatibilityTitle,
                           { color: colors.textPrimary },
                        ]}
                     >
                        Compatibility Check
                     </Text>
                  </View>
                  <Text
                     style={[
                        styles.compatibilityText,
                        { color: colors.textSecondary },
                     ]}
                  >
                     {Object.keys(selectedParts).length === 0
                        ? 'Add parts to check compatibility'
                        : 'All selected parts are compatible! ✓'}
                  </Text>
               </View>
               <View
                  style={{
                     height: 30,
                  }}
               ></View>
            </ScrollView>

            {/* Footer */}
            <View
               style={[
                  styles.footer,
                  {
                     backgroundColor: colors.bgPrimary,
                     borderTopColor: colors.surfaceBorder,
                  },
               ]}
            >
               <View style={styles.totalContainer}>
                  <Text
                     style={[styles.totalLabel, { color: colors.textMuted }]}
                  >
                     Total Price
                  </Text>
                  <Text style={[styles.totalPrice, { color: colors.primary }]}>
                     ₱{totalPrice.toLocaleString()}
                  </Text>
               </View>

               <TouchableOpacity
                  style={[
                     styles.saveButton,
                     {
                        backgroundColor:
                           Object.keys(selectedParts).length > 0
                              ? colors.primary
                              : colors.surface,
                     },
                  ]}
                  onPress={handleSaveBundle}
                  disabled={Object.keys(selectedParts).length === 0}
               >
                  <MaterialIcons
                     name="save"
                     size={24}
                     color={
                        Object.keys(selectedParts).length > 0
                           ? colors.textDark
                           : colors.textMuted
                     }
                  />
                  <Text
                     style={[
                        styles.saveButtonText,
                        {
                           color:
                              Object.keys(selectedParts).length > 0
                                 ? colors.textDark
                                 : colors.textMuted,
                        },
                     ]}
                  >
                     Save Bundle
                  </Text>
               </TouchableOpacity>
            </View>

            {/* Part Selection Modal */}
            <Modal
               visible={modalVisible}
               animationType="slide"
               transparent={true}
               onRequestClose={() => setModalVisible(false)}
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
                           Select {currentCategory?.name}
                        </Text>
                        <TouchableOpacity
                           onPress={() => setModalVisible(false)}
                           style={[
                              styles.closeButton,
                              {
                                 backgroundColor: colors.surface,
                                 borderColor: colors.surfaceBorder,
                              },
                           ]}
                        >
                           <MaterialIcons
                              name="close"
                              size={24}
                              color={colors.textPrimary}
                           />
                        </TouchableOpacity>
                     </View>

                     {loadingProducts ? (
                        <View style={styles.modalLoading}>
                           <ActivityIndicator
                              size="large"
                              color={colors.primary}
                           />
                        </View>
                     ) : (
                        <FlatList
                           data={availableProducts}
                           keyExtractor={(item) => item._id}
                           renderItem={({ item }) => (
                              <PartCard
                                 product={item}
                                 onPress={() => selectPart(item)}
                              />
                           )}
                           contentContainerStyle={styles.modalList}
                           ListEmptyComponent={
                              <View style={styles.emptyContainer}>
                                 <MaterialIcons
                                    name="inventory-2"
                                    size={48}
                                    color={colors.textMuted}
                                 />
                                 <Text
                                    style={[
                                       styles.emptyText,
                                       { color: colors.textMuted },
                                    ]}
                                 >
                                    No products available
                                 </Text>
                              </View>
                           }
                        />
                     )}
                  </View>
               </View>
            </Modal>
         </LinearGradient>
      </>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
   },
   title: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: 1,
      marginBottom: 16,
   },
   nameInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 48,
      borderWidth: 1,
      gap: 8,
   },
   nameInput: {
      flex: 1,
      fontSize: 15,
   },
   content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 120,
   },
   categoryCard: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 2,
   },
   categoryHeader: {
      marginBottom: 12,
   },
   categoryTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
   },
   iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
   },
   categoryInfo: {
      flex: 1,
   },
   categoryNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
   },
   categoryName: {
      fontSize: 16,
      fontWeight: '700',
   },
   requiredBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
   },
   requiredText: {
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
   },
   categoryId: {
      fontSize: 12,
      fontWeight: '600',
   },
   selectedPart: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
   },
   partInfo: {
      flex: 1,
      marginRight: 12,
   },
   partName: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
   },
   partBrand: {
      fontSize: 12,
      marginBottom: 4,
   },
   partPrice: {
      fontSize: 16,
      fontWeight: '700',
   },
   partActions: {
      flexDirection: 'row',
      gap: 8,
   },
   changeButton: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
   },
   removeButton: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
   },
   selectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: 'dashed',
      gap: 8,
   },
   selectButtonText: {
      fontSize: 14,
      fontWeight: '600',
   },
   compatibilityCard: {
      borderRadius: 16,
      padding: 16,
      marginTop: 8,
      borderWidth: 1,
   },
   compatibilityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
   },
   compatibilityTitle: {
      fontSize: 16,
      fontWeight: '700',
   },
   compatibilityText: {
      fontSize: 14,
      lineHeight: 20,
   },
   footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderTopWidth: 1,
      gap: 12,
   },
   totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   totalLabel: {
      fontSize: 14,
      fontWeight: '600',
   },
   totalPrice: {
      fontSize: 24,
      fontWeight: '800',
   },
   saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 16,
      gap: 8,
   },
   saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
   },
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
   },
   modalContent: {
      height: '85%',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 16,
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
   },
   modalTitle: {
      fontSize: 22,
      fontWeight: '800',
   },
   closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
   },
   modalList: {
      paddingHorizontal: 16,
      paddingBottom: 16,
   },
   modalLoading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 64,
   },
   emptyText: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 16,
   },
});
