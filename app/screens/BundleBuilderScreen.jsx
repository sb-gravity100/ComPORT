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
import { useToast } from '../context/ToastContext';
import {
   checkBundleCompatibility,
   getBundleComfortRating,
} from '../services/api';
import { checkCompatibility } from '../utils/comfortUtils';

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
   { id: 'Case', name: 'Case', icon: 'ad-units', required: false },
];

export default function BundleBuilderScreen() {
   const { theme, isDark } = useTheme();
   const { colors, gradients } = theme;
   const navigation = useNavigation();
   const { showToast } = useToast();

   const [bundleName, setBundleName] = useState('');
   const [selectedParts, setSelectedParts] = useState({});
   const [totalPrice, setTotalPrice] = useState(0);

   // Modal state
   const [modalVisible, setModalVisible] = useState(false);
   const [currentCategory, setCurrentCategory] = useState(null);
   const [availableProducts, setAvailableProducts] = useState([]);
   const [loadingProducts, setLoadingProducts] = useState(false);
   const [selectedSources, setSelectedSources] = useState({});
   const [compatibilityReport, setCompatibilityReport] = useState(null);
   const [isCompatible, setIsCompatible] = useState(false);
   const [checkingCompatibility, setCheckingCompatibility] = useState(false);
   const [compatibilityIssues, setCompatibilityIssues] = useState([]);

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
      if (!product.sources || product.sources.length === 0) {
         Alert.alert('Error', 'No sources available for this product');
         return;
      }

      // Auto-select cheapest in-stock source, or cheapest overall
      const inStockSources = product.sources.filter((s) => s.inStock);
      const sourcesToConsider =
         inStockSources.length > 0 ? inStockSources : product.sources;

      const selectedSource = sourcesToConsider.reduce((min, curr) => {
         const minTotal = min.price + (min.shipping?.cost || 0);
         const currTotal = curr.price + (curr.shipping?.cost || 0);
         return currTotal < minTotal ? curr : min;
      });

      setSelectedSources((prev) => ({
         ...prev,
         [currentCategory.id]: selectedSource,
      }));

      const previousPrice =
         selectedParts[currentCategory.id]?.selectedPrice || 0;

      setSelectedParts((prev) => ({
         ...prev,
         [currentCategory.id]: {
            ...product,
            selectedSource: {
               shopName: selectedSource.shopName,
               productUrl: selectedSource.productUrl || '',
               price: selectedSource.price,
               shipping: selectedSource.shipping,
            },
         },
      }));

      setTotalPrice((prev) => prev - previousPrice + selectedSource.price);
      setModalVisible(false);
   };

   const removePart = (categoryId) => {
      const part = selectedParts[categoryId];
      if (part) {
         setTotalPrice((prev) => prev - (part.selectedPrice || 0));
         setSelectedParts((prev) => {
            const newParts = { ...prev };
            delete newParts[categoryId];
            return newParts;
         });
         setSelectedSources((prev) => {
            const newSources = { ...prev };
            delete newSources[categoryId];
            return newSources;
         });
      }
   };

   const handleSaveBundle = () => {
      if (!bundleName.trim()) {
         showToast('Missing bundle name!', 'error');
         return;
      }
      if (missingRequired.length > 0) {
         showToast('Missing requirements!', 'error');

         return;
      }

      const bundleData = {
         name: bundleName,
         parts: selectedParts,
         sources: selectedSources,
         totalPrice,
         // comfortProfile, // Add this
      };

      navigation.navigate('Summary', { bundleData });
   };

   const handleChangeSource = (categoryId, newSource) => {
      const currentPart = selectedParts[categoryId];
      if (!currentPart) return;

      const previousPrice = currentPart.selectedPrice || 0;
      const newPrice = newSource.price || 0;

      setSelectedSources((prev) => ({
         ...prev,
         [categoryId]: newSource,
      }));

      setSelectedParts((prev) => ({
         ...prev,
         [categoryId]: {
            ...prev[categoryId],
            selectedPrice: newPrice,
            selectedShop: newSource.shopName,
            selectedSourceUrl: newSource.productUrl,
            selectedShipping: newSource.shipping,
         },
      }));

      setTotalPrice((prev) => prev - previousPrice + newPrice);
   };

   useEffect(() => {
      if (Object.keys(selectedParts).length >= 2) {
         checkBundleCompatibility();
      } else {
         setCompatibilityReport(null);
         setIsCompatible(true);
         setCompatibilityIssues([]);
      }
   }, [selectedParts]);

   const checkBundleCompatibility = async () => {
      setCheckingCompatibility(true);

      // Use frontend compatibility check
      const report = checkCompatibility(selectedParts);
      setCompatibilityReport(report);

      // Set compatibility status
      setIsCompatible(report.compatible);

      // Collect all issues from the report
      const allIssues = [];
      if (report.issues && report.issues.length > 0) {
         allIssues.push(...report.issues);
      }
      if (report.warnings && report.warnings.length > 0) {
         allIssues.push(...report.warnings);
      }

      setCompatibilityIssues(allIssues);
      setCheckingCompatibility(false);
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
                        selectedSource={selectedSources[category.id]}
                        isSelected={isSelected}
                        missingRequired={isMissing}
                        onChangeSource={handleChangeSource}
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
                        borderColor:
                           compatibilityReport?.compatible === false
                              ? colors.error
                              : compatibilityReport?.warnings?.length > 0
                              ? colors.warning
                              : colors.surfaceBorder,
                     },
                  ]}
               >
                  <View style={styles.compatibilityHeader}>
                     <MaterialIcons
                        name={
                           Object.keys(selectedParts).length === 0
                              ? 'info'
                              : checkingCompatibility
                              ? 'hourglass-empty'
                              : compatibilityReport?.compatible === false
                              ? 'error'
                              : compatibilityReport?.warnings?.length > 0
                              ? 'warning'
                              : 'check-circle'
                        }
                        size={24}
                        color={
                           Object.keys(selectedParts).length === 0
                              ? colors.textMuted
                              : checkingCompatibility
                              ? colors.primary
                              : compatibilityReport?.compatible === false
                              ? colors.error
                              : compatibilityReport?.warnings?.length > 0
                              ? colors.warning
                              : colors.success
                        }
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

                  {/* Main Status Text */}
                  {Object.keys(selectedParts).length === 0 ? (
                     <Text
                        style={[
                           styles.compatibilityText,
                           { color: colors.textSecondary },
                        ]}
                     >
                        Add parts to check compatibility
                     </Text>
                  ) : checkingCompatibility ? (
                     <Text
                        style={[
                           styles.compatibilityText,
                           { color: colors.textSecondary },
                        ]}
                     >
                        Checking compatibility...
                     </Text>
                  ) : compatibilityReport ? (
                     <>
                        <Text
                           style={[
                              styles.compatibilityText,
                              {
                                 color: compatibilityReport.compatible
                                    ? colors.success
                                    : colors.error,
                                 fontWeight: '600',
                              },
                           ]}
                        >
                           {compatibilityReport.compatible
                              ? compatibilityReport.warnings?.length > 0
                                 ? 'Compatible with warnings ⚠️'
                                 : 'All selected parts are compatible! ✓'
                              : 'Compatibility issues detected! ✗'}
                        </Text>

                        {/* Display Issues */}
                        {compatibilityReport.issues &&
                           compatibilityReport.issues.length > 0 && (
                              <View style={styles.issuesContainer}>
                                 <Text
                                    style={[
                                       styles.issuesHeader,
                                       { color: colors.error, marginTop: 12 },
                                    ]}
                                 >
                                    Issues:
                                 </Text>
                                 {compatibilityReport.issues.map(
                                    (issue, index) => (
                                       <View
                                          key={`issue-${index}`}
                                          style={styles.issueRow}
                                       >
                                          <Text
                                             style={[
                                                styles.issueBullet,
                                                { color: colors.error },
                                             ]}
                                          >
                                             •
                                          </Text>
                                          <Text
                                             style={[
                                                styles.issueText,
                                                { color: colors.textSecondary },
                                             ]}
                                          >
                                             {issue}
                                          </Text>
                                       </View>
                                    )
                                 )}
                              </View>
                           )}

                        {/* Display Warnings */}
                        {compatibilityReport.warnings &&
                           compatibilityReport.warnings.length > 0 && (
                              <View style={styles.issuesContainer}>
                                 <Text
                                    style={[
                                       styles.issuesHeader,
                                       { color: colors.warning, marginTop: 12 },
                                    ]}
                                 >
                                    Warnings:
                                 </Text>
                                 {compatibilityReport.warnings.map(
                                    (warning, index) => (
                                       <View
                                          key={`warning-${index}`}
                                          style={styles.issueRow}
                                       >
                                          <Text
                                             style={[
                                                styles.issueBullet,
                                                { color: colors.warning },
                                             ]}
                                          >
                                             •
                                          </Text>
                                          <Text
                                             style={[
                                                styles.issueText,
                                                { color: colors.textSecondary },
                                             ]}
                                          >
                                             {warning}
                                          </Text>
                                       </View>
                                    )
                                 )}
                              </View>
                           )}

                        {/* Compatibility Score */}
                        {compatibilityReport.score !== undefined && (
                           <Text
                              style={[
                                 styles.compatibilityScore,
                                 { color: colors.textMuted, marginTop: 8 },
                              ]}
                           >
                              Compatibility Score: {compatibilityReport.score}%
                           </Text>
                        )}
                     </>
                  ) : null}
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
   issuesContainer: {
      marginTop: 4,
   },
   issuesHeader: {
      fontSize: 13,
      fontWeight: '700',
      marginBottom: 6,
   },
   issueRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 6,
      paddingLeft: 4,
   },
   issueBullet: {
      fontSize: 16,
      fontWeight: '700',
      marginRight: 8,
      lineHeight: 20,
   },
   issueText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
   },
   compatibilityScore: {
      fontSize: 12,
      fontWeight: '600',
      fontStyle: 'italic',
   },
});
