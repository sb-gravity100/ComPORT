import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   StatusBar,
   Modal,
   ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { getBundle } from '../services/api';
import PartRow from '../components/PartRow';
import { camelToTitle } from '../utils/common';

export default function SavedBundleScreen({ route }) {
   const { bundleId } = route.params;
   const { theme, isDark } = useTheme();
   const { colors, gradients } = theme;
   const navigation = useNavigation();

   const [bundle, setBundle] = useState(null);
   const [loading, setLoading] = useState(true);
   const [selectedPart, setSelectedPart] = useState(null);
   const [modalVisible, setModalVisible] = useState(false);

   useEffect(() => {
      fetchBundle();
   }, [bundleId]);

   const fetchBundle = async () => {
      setLoading(true);
      const result = await getBundle(bundleId);
      if (!result.error) {
         setBundle(result.bundle);
      }
      setLoading(false);
   };

   const openPartDetails = (part, source) => {
      setSelectedPart({ ...part, selectedSource: source });
      setModalVisible(true);
   };

   if (loading) {
      return (
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
         </LinearGradient>
      );
   }

   if (!bundle) {
      return (
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <Text style={[styles.error, { color: colors.error }]}>
               Bundle not found
            </Text>
         </LinearGradient>
      );
   }

   return (
      <>
         <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <View style={styles.header}>
               <TouchableOpacity
                  style={[
                     styles.backButton,
                     { backgroundColor: colors.surface },
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
                  {bundle.name}
               </Text>
               <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
               {/* Parts List */}
               <View style={[styles.card, { backgroundColor: colors.surface }]}>
                  <Text
                     style={[
                        styles.sectionTitle,
                        { color: colors.textPrimary },
                     ]}
                  >
                     Parts ({bundle.products.length})
                  </Text>
                  {bundle.products.map((item, index) => (
                     <TouchableOpacity
                        key={index}
                        onPress={() =>
                           openPartDetails(item.product, item.selectedSource)
                        }
                     >
                        <PartRow
                           category={item.category}
                           part={item.product}
                           source={item.selectedSource}
                           colors={colors}
                           theme={theme}
                           isLast={index === bundle.products.length - 1}
                           styles={styles}
                        />
                     </TouchableOpacity>
                  ))}
               </View>

               {/* Comfort Profile */}
               {bundle.comfortProfile && (
                  <View
                     style={[styles.card, { backgroundColor: colors.surface }]}
                  >
                     <Text
                        style={[
                           styles.sectionTitle,
                           { color: colors.textPrimary },
                        ]}
                     >
                        Comfort Profile
                     </Text>
                     <View style={styles.comfortMetrics}>
                        {[
                           { key: 'ease', label: 'Ease of Use', icon: 'grade' },
                           {
                              key: 'performance',
                              label: 'Performance',
                              icon: 'speed',
                           },
                        ].map(({ key, label, icon }) => (
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
                                             width: `${bundle.comfortProfile[key]}%`,
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
                                    {bundle.comfortProfile[key]}
                                 </Text>
                              </View>
                           </View>
                        ))}
                     </View>
                  </View>
               )}

               {/* Price Summary */}
               <View style={[styles.card, { backgroundColor: colors.surface }]}>
                  <Text
                     style={[
                        styles.sectionTitle,
                        { color: colors.textPrimary },
                     ]}
                  >
                     Price Summary
                  </Text>
                  <View style={styles.totalRow}>
                     <Text
                        style={[styles.totalLabel, { color: colors.primary }]}
                     >
                        Total Price
                     </Text>
                     <Text
                        style={[styles.totalValue, { color: colors.primary }]}
                     >
                        ₱{bundle.totalPrice.toLocaleString()}
                     </Text>
                  </View>
               </View>
            </ScrollView>

            {/* Part Details Modal */}
            <Modal
               visible={modalVisible}
               transparent
               animationType="slide"
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
                           {selectedPart?.name}
                        </Text>
                        <TouchableOpacity
                           onPress={() => setModalVisible(false)}
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

                     <ScrollView contentContainerStyle={styles.modalScroll}>
                        {selectedPart && (
                           <>
                              <Text
                                 style={[
                                    styles.modalSection,
                                    { color: colors.textSecondary },
                                 ]}
                              >
                                 {selectedPart.brand} • {selectedPart.category}
                              </Text>

                              {/* Selected Source */}
                              <View
                                 style={[
                                    styles.sourceCard,
                                    { backgroundColor: colors.surface },
                                 ]}
                              >
                                 <Text
                                    style={[
                                       styles.sourceTitle,
                                       { color: colors.textPrimary },
                                    ]}
                                 >
                                    Selected Shop
                                 </Text>
                                 <Text
                                    style={[
                                       styles.sourceName,
                                       { color: colors.primary },
                                    ]}
                                 >
                                    {selectedPart.selectedSource?.shopName}
                                 </Text>
                                 <Text
                                    style={[
                                       styles.sourcePrice,
                                       { color: colors.textPrimary },
                                    ]}
                                 >
                                    ₱
                                    {selectedPart.selectedSource?.price.toLocaleString()}
                                 </Text>
                                 {selectedPart.selectedSource?.shipping
                                    ?.estimatedDays && (
                                    <Text
                                       style={[
                                          styles.sourceShipping,
                                          { color: colors.textMuted },
                                       ]}
                                    >
                                       Delivery:{' '}
                                       {
                                          selectedPart.selectedSource.shipping
                                             .estimatedDays
                                       }
                                    </Text>
                                 )}
                              </View>

                              {/* Specifications */}
                              {selectedPart.specifications && (
                                 <View
                                    style={[
                                       styles.specsCard,
                                       { backgroundColor: colors.surface },
                                    ]}
                                 >
                                    <Text
                                       style={[
                                          styles.specsTitle,
                                          { color: colors.textPrimary },
                                       ]}
                                    >
                                       Specifications
                                    </Text>
                                    {Object.entries(selectedPart.specifications)
                                       .slice(0, 5)
                                       .map(([key, value]) => (
                                          <View
                                             key={key}
                                             style={styles.specRow}
                                          >
                                             <Text
                                                style={[
                                                   styles.specKey,
                                                   {
                                                      color: colors.textSecondary,
                                                   },
                                                ]}
                                             >
                                                {camelToTitle(key)}
                                             </Text>
                                             <Text
                                                style={[
                                                   styles.specValue,
                                                   {
                                                      color: colors.textPrimary,
                                                   },
                                                ]}
                                             >
                                                {value}
                                             </Text>
                                          </View>
                                       ))}
                                 </View>
                              )}
                           </>
                        )}
                     </ScrollView>
                  </View>
               </View>
            </Modal>
         </LinearGradient>
      </>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1 },
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
   },
   headerTitle: { fontSize: 18, fontWeight: '700' },
   content: { paddingHorizontal: 16, paddingBottom: 40 },
   card: { borderRadius: 16, padding: 16, marginBottom: 16 },
   sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
   partRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
   },
   partRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
   },
   partLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
   partIconSmall: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
   },
   partDetails: { flex: 1 },
   partCategory: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
   },
   partNameSmall: { fontSize: 14, fontWeight: '600' },
   partBrandSmall: { fontSize: 12 },
   partPriceSmall: { fontSize: 14, fontWeight: '700' },
   comfortMetrics: { gap: 16 },
   metricRow: { gap: 8 },
   metricLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
   metricLabel: { fontSize: 13, fontWeight: '600' },
   metricBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
   metricTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
   metricFill: { height: '100%', borderRadius: 4 },
   metricValue: {
      fontSize: 13,
      fontWeight: '700',
      minWidth: 28,
      textAlign: 'right',
   },
   totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
   },
   totalLabel: { fontSize: 18, fontWeight: '700' },
   totalValue: { fontSize: 24, fontWeight: '800' },
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
   },
   modalContent: {
      height: '70%',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
   },
   modalTitle: { fontSize: 20, fontWeight: '800', flex: 1 },
   closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
   },
   modalScroll: { padding: 16 },
   modalSection: { fontSize: 14, marginBottom: 16 },
   sourceCard: { borderRadius: 12, padding: 16, marginBottom: 16 },
   sourceTitle: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 8,
      textTransform: 'uppercase',
   },
   sourceName: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
   sourcePrice: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
   sourceShipping: { fontSize: 12 },
   specsCard: { borderRadius: 12, padding: 16 },
   specsTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
   specRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
   },
   specKey: { fontSize: 13, fontWeight: '600', flex: 1 },
   specValue: { fontSize: 13, flex: 1, textAlign: 'right' },
   error: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600' },
   priceColumn: { alignItems: 'flex-end' },
   shippingNote: { fontSize: 10, marginTop: 2 },
   shopBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
   },
   shopName: { fontSize: 10, fontWeight: '600' },
});
