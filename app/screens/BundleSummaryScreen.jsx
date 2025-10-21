import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   StatusBar,
   Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { createBundle } from '../services/api';
import PartRow from '../components/PartRow';

export default function BundleSummaryScreen({ route }) {
   const { bundleData } = route.params || {};
   const { theme, isDark } = useTheme();
   const { colors, gradients } = theme;
   const navigation = useNavigation();

   const [saving, setSaving] = useState(false);
   const [calculating, setCalculating] = useState(false);

   useEffect(() => {
      calculateComfortProfile();
   }, [bundleData.parts]);

   const calculateComfortProfile = async () => {
      if (!bundleData.parts || Object.keys(bundleData.parts).length === 0) {
         return;
      }

      setCalculating(true);

      try {
      } catch (error) {
         console.error('Comfort calculation error:', error);
      } finally {
         setCalculating(false);
      }
   };

   const handleSave = async () => {
      setSaving(true);

      const products = Object.entries(bundleData.parts).map(
         ([category, part]) => ({
            product: part._id,
            category,
         })
      );

      const result = await createBundle({
         name: bundleData.name,
         products,
         notes: '',
      });

      setSaving(false);

      if (result.error) {
         Alert.alert('Error', result.message);
      } else {
         Alert.alert('Success', 'Bundle saved successfully!', [
            {
               text: 'OK',
               onPress: () => {
                  navigation.reset({
                     index: 0,
                     routes: [{ name: 'Main' }],
                  });
               },
            },
         ]);
      }
   };

   if (!bundleData) {
      return (
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <Text style={[styles.error, { color: colors.error }]}>
               No bundle data
            </Text>
         </LinearGradient>
      );
   }

   const partsArray = Object.entries(bundleData.parts);

   return (
      <>
         <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <View style={styles.header}>
               <TouchableOpacity
                  style={[
                     styles.backButton,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
                  onPress={() => navigation.goBack()}
               >
                  <MaterialIcons
                     name="arrow-back"
                     size={24}
                     color={colors.textPrimary}
                  />
               </TouchableOpacity>
               <Text style={[styles.headerTitle, { color: colors.primary }]}>
                  Bundle Summary
               </Text>
               <View style={{ width: 40 }} />
            </View>

            <ScrollView
               contentContainerStyle={styles.content}
               showsVerticalScrollIndicator={false}
            >
               {/* Bundle Name */}
               <View
                  style={[
                     styles.card,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
               >
                  <View style={styles.bundleHeader}>
                     <View
                        style={[
                           styles.bundleIcon,
                           {
                              backgroundColor: theme.withOpacity(
                                 colors.primary,
                                 0.1
                              ),
                           },
                        ]}
                     >
                        <MaterialIcons
                           name="folder-special"
                           size={32}
                           color={colors.primary}
                        />
                     </View>
                     <View style={styles.bundleInfo}>
                        <Text
                           style={[
                              styles.bundleName,
                              { color: colors.textPrimary },
                           ]}
                        >
                           {bundleData.name}
                        </Text>
                        <Text
                           style={[
                              styles.partsCount,
                              { color: colors.textSecondary },
                           ]}
                        >
                           {partsArray.length} parts selected
                        </Text>
                     </View>
                  </View>
               </View>

               {/* Parts List */}
               <View
                  style={[
                     styles.card,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
               >
                  <Text
                     style={[
                        styles.sectionTitle,
                        { color: colors.textPrimary },
                     ]}
                  >
                     Selected Parts
                  </Text>

                  {partsArray.map(([category, part], index) => {
                     const source = bundleData.sources?.[category];
                     const isLast = index === partsArray.length - 1;

                     return (
                        <PartRow
                           key={category}
                           category={category}
                           part={{
                              ...part,
                              // Ensure we use the selected source price
                              selectedPrice:
                                 source?.price ||
                                 part.selectedPrice ||
                                 part.priceRange?.average ||
                                 0,
                           }}
                           source={source}
                           colors={colors}
                           theme={theme}
                           isLast={isLast}
                           styles={styles}
                        />
                     );
                  })}
               </View>

               {/* Comfort Profile Preview */}
               {/* Comfort Profile */}
               <View
                  style={[
                     styles.card,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
               >
                  <View style={styles.comfortHeader}>
                     <Text
                        style={[
                           styles.sectionTitle,
                           { color: colors.textPrimary },
                        ]}
                     >
                        Comfort Profile
                     </Text>
                     {calculating && (
                        <ActivityIndicator
                           size="small"
                           color={colors.primary}
                        />
                     )}
                  </View>

                  <View style={styles.comfortMetrics}>
                     {[].map(({ key, label, icon }) => (
                        <View key={key} style={styles.metricRow}>
                           <View style={styles.metricLabelRow}>
                              <MaterialIcons
                                 name={icon}
                                 size={16}
                                 color={colors.textMuted}
                              />
                              <Text
                                 style={[
                                    styles.metricLabel,
                                    { color: colors.textSecondary },
                                 ]}
                              >
                                 {label}
                              </Text>
                           </View>
                           <View style={styles.metricBar}>
                              <View
                                 style={[
                                    styles.metricTrack,
                                    {
                                       backgroundColor: theme.withOpacity(
                                          colors.primary,
                                          0.2
                                       ),
                                    },
                                 ]}
                              >
                                 <View
                                    style={[
                                       styles.metricFill,
                                       {
                                          backgroundColor: colors.primary,
                                          width: `50%`,
                                       },
                                    ]}
                                 />
                              </View>
                              <Text
                                 style={[
                                    styles.metricValue,
                                    { color: colors.primary },
                                 ]}
                              >
                                 {/* {comfortProfile[key]} */}
                              </Text>
                           </View>
                        </View>
                     ))}
                  </View>

                  <View style={styles.overallScore}>
                     <View style={styles.overallLeft}>
                        <MaterialIcons
                           name={'sentiment-very-satisfied'}
                           size={32}
                           color={colors.success}
                        />
                        <View>
                           <Text
                              style={[
                                 styles.overallLabel,
                                 { color: colors.textSecondary },
                              ]}
                           >
                              Overall Comfort Score
                           </Text>
                           <Text
                              style={[
                                 styles.overallSubtext,
                                 { color: colors.textMuted },
                              ]}
                           >
                              {'Excellent'}
                           </Text>
                        </View>
                     </View>
                     <Text
                        style={[styles.overallValue, { color: colors.primary }]}
                     >
                        100/100
                     </Text>
                  </View>
               </View>

               {/* Price Breakdown */}
               <View
                  style={[
                     styles.card,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
               >
                  <Text
                     style={[
                        styles.sectionTitle,
                        { color: colors.textPrimary },
                     ]}
                  >
                     Price Breakdown
                  </Text>

                  <View style={styles.priceRow}>
                     <Text
                        style={[
                           styles.priceLabel,
                           { color: colors.textSecondary },
                        ]}
                     >
                        Subtotal ({partsArray.length} items)
                     </Text>
                     <Text
                        style={[
                           styles.priceValue,
                           { color: colors.textPrimary },
                        ]}
                     >
                        ₱{bundleData.totalPrice.toLocaleString()}
                     </Text>
                  </View>

                  <View style={[styles.priceRow, styles.totalRow]}>
                     <Text
                        style={[styles.totalLabel, { color: colors.primary }]}
                     >
                        Total Price
                     </Text>
                     <Text
                        style={[styles.totalValue, { color: colors.primary }]}
                     >
                        ₱{bundleData.totalPrice.toLocaleString()}
                     </Text>
                  </View>
               </View>
            </ScrollView>

            {/* Footer Actions */}
            <View
               style={[
                  styles.footer,
                  {
                     backgroundColor: colors.bgPrimary,
                     borderTopColor: colors.surfaceBorder,
                  },
               ]}
            >
               <TouchableOpacity
                  style={[
                     styles.actionButton,
                     styles.secondaryButton,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
                  onPress={() => navigation.goBack()}
               >
                  <MaterialIcons
                     name="edit"
                     size={20}
                     color={colors.textPrimary}
                  />
                  <Text
                     style={[
                        styles.secondaryButtonText,
                        { color: colors.textPrimary },
                     ]}
                  >
                     Edit Bundle
                  </Text>
               </TouchableOpacity>

               <TouchableOpacity
                  style={[
                     styles.actionButton,
                     styles.primaryButton,
                     { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSave}
                  disabled={saving}
               >
                  <MaterialIcons
                     name="check"
                     size={20}
                     color={colors.textDark}
                  />
                  <Text
                     style={[
                        styles.primaryButtonText,
                        { color: colors.textDark },
                     ]}
                  >
                     {saving ? 'Saving...' : 'Confirm & Save'}
                  </Text>
               </TouchableOpacity>
            </View>
         </LinearGradient>
      </>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
   },
   backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: '700',
   },
   content: {
      paddingHorizontal: 16,
      paddingBottom: 120,
   },
   card: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
   },
   bundleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
   },
   bundleIcon: {
      width: 64,
      height: 64,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
   },
   bundleInfo: {
      flex: 1,
   },
   bundleName: {
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 4,
   },
   partsCount: {
      fontSize: 14,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 16,
   },
   partRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
   },
   partRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
   },
   partLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
      marginRight: 12,
   },
   partIconSmall: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
   },
   partDetails: {
      flex: 1,
   },
   partCategory: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: 2,
   },
   partNameSmall: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 2,
   },
   partBrandSmall: {
      fontSize: 12,
   },
   partPriceSmall: {
      fontSize: 14,
      fontWeight: '700',
   },
   comfortMetrics: {
      gap: 16,
      marginBottom: 16,
   },
   metricRow: {
      gap: 8,
   },
   metricLabel: {
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 4,
   },
   metricBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   metricTrack: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
   },
   metricFill: {
      height: '100%',
      borderRadius: 4,
   },
   metricValue: {
      fontSize: 13,
      fontWeight: '700',
      minWidth: 28,
      textAlign: 'right',
   },
   overallScore: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
   },
   overallLabel: {
      fontSize: 16,
      fontWeight: '700',
   },
   overallValue: {
      fontSize: 24,
      fontWeight: '800',
   },
   priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
   },
   priceLabel: {
      fontSize: 14,
   },
   priceValue: {
      fontSize: 14,
      fontWeight: '600',
   },
   totalRow: {
      paddingTop: 16,
      marginTop: 8,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
   },
   totalLabel: {
      fontSize: 18,
      fontWeight: '700',
   },
   totalValue: {
      fontSize: 24,
      fontWeight: '800',
   },
   footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderTopWidth: 1,
      flexDirection: 'row',
      gap: 12,
   },
   actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 12,
      gap: 8,
   },
   secondaryButton: {
      borderWidth: 1,
   },
   secondaryButtonText: {
      fontSize: 14,
      fontWeight: '700',
   },
   primaryButton: {},
   primaryButtonText: {
      fontSize: 14,
      fontWeight: '700',
   },
   error: {
      flex: 1,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
   },
   shopBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
   },
   shopName: {
      fontSize: 10,
      fontWeight: '600',
   },
   priceColumn: {
      alignItems: 'flex-end',
   },
   shippingNote: {
      fontSize: 10,
      marginTop: 2,
   },
   comfortHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
   },
   metricLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
   },
   overallLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
   },
   overallSubtext: {
      fontSize: 12,
      marginTop: 2,
   },
});
