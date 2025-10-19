import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   ActivityIndicator,
   StatusBar,
   Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getProduct, getReviews } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import ReviewSubmission from '../components/ReviewSubmission';

export default function PartDetailScreen({ route }) {
   const { partId } = route.params;
   const { theme, isDark } = useTheme();
   const { colors, gradients } = theme;
   const navigation = useNavigation();

   const [product, setProduct] = useState(null);
   const [reviews, setReviews] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedSource, setSelectedSource] = useState(null);
   const [showReviewModal, setShowReviewModal] = useState(false);

   useEffect(() => {
      fetchData();
   }, [partId]);

   const fetchData = async () => {
      setLoading(true);
      const [productResult, reviewsResult] = await Promise.all([
         getProduct(partId),
         getReviews(partId),
      ]);

      if (!productResult.error) {
         setProduct(productResult.product);
         // Auto-select cheapest in-stock source
         const inStockSources = productResult.product.sources.filter(
            (s) => s.inStock
         );
         if (inStockSources.length > 0) {
            setSelectedSource(inStockSources[0]);
         }
      }
      if (!reviewsResult.error) setReviews(reviewsResult.reviews);
      setLoading(false);
   };

   const getBestDeal = () => {
      if (!product) return null;
      const inStockSources = product.sources.filter((s) => s.inStock);
      if (inStockSources.length === 0) return null;

      return inStockSources.reduce((best, current) => {
         const bestTotal = best.price + (best.shipping?.cost || 0);
         const currentTotal = current.price + (current.shipping?.cost || 0);
         return currentTotal < bestTotal ? current : best;
      });
   };

   if (loading) {
      return (
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <ActivityIndicator
               size="large"
               color={colors.primary}
               style={styles.loader}
            />
         </LinearGradient>
      );
   }

   if (!product) {
      return (
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <Text style={[styles.error, { color: colors.error }]}>
               Product not found
            </Text>
         </LinearGradient>
      );
   }

   const handleReviewSuccess = () => {
      fetchData(); // Refresh reviews after submission
   };

   const bestDeal = getBestDeal();

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
                  Part Details
               </Text>
               <View style={{ width: 40 }} />
            </View>

            <ScrollView
               contentContainerStyle={styles.content}
               showsVerticalScrollIndicator={false}
            >
               {/* Product Info Card */}
               <View
                  style={[
                     styles.card,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
               >
                  <View style={styles.categoryBadge}>
                     <Text
                        style={[
                           styles.categoryText,
                           { color: colors.textMuted },
                        ]}
                     >
                        {product.category}
                     </Text>
                  </View>

                  <Text
                     style={[styles.productName, { color: colors.textPrimary }]}
                  >
                     {product.name}
                  </Text>
                  <Text
                     style={[
                        styles.brandModel,
                        { color: colors.textSecondary },
                     ]}
                  >
                     {product.brand} • {product.model}
                  </Text>

                  <View style={styles.priceRow}>
                     <View>
                        <Text
                           style={[
                              styles.priceLabel,
                              { color: colors.textMuted },
                           ]}
                        >
                           Price Range
                        </Text>
                        <Text style={[styles.price, { color: colors.primary }]}>
                           ₱{product.priceRange.min.toLocaleString()} - ₱
                           {product.priceRange.max.toLocaleString()}
                        </Text>
                     </View>
                     <View
                        style={[
                           styles.stockBadge,
                           {
                              backgroundColor: theme.withOpacity(
                                 product.availableAt > 0
                                    ? colors.success
                                    : colors.error,
                                 0.1
                              ),
                           },
                        ]}
                     >
                        <MaterialIcons
                           name={
                              product.availableAt > 0
                                 ? 'check-circle'
                                 : 'cancel'
                           }
                           size={16}
                           color={
                              product.availableAt > 0
                                 ? colors.success
                                 : colors.error
                           }
                        />
                        <Text
                           style={[
                              styles.stockText,
                              {
                                 color:
                                    product.availableAt > 0
                                       ? colors.success
                                       : colors.error,
                              },
                           ]}
                        >
                           {product.availableAt > 0
                              ? `${product.availableAt} shop${
                                   product.availableAt !== 1 ? 's' : ''
                                }`
                              : 'Out of Stock'}
                        </Text>
                     </View>
                  </View>

                  {product.ratings?.overall?.average > 0 && (
                     <View style={styles.ratingRow}>
                        <MaterialIcons
                           name="star"
                           size={20}
                           color={colors.warning}
                        />
                        <Text
                           style={[
                              styles.ratingText,
                              { color: colors.textPrimary },
                           ]}
                        >
                           {product.ratings.overall.average.toFixed(1)}
                        </Text>
                        <Text
                           style={[
                              styles.reviewCount,
                              { color: colors.textMuted },
                           ]}
                        >
                           ({product.ratings.overall.count} ratings across{' '}
                           {product.totalSources} shops)
                        </Text>
                     </View>
                  )}
               </View>

               {/* Best Deal Highlight */}
               {bestDeal && (
                  <View
                     style={[
                        styles.card,
                        styles.bestDealCard,
                        {
                           backgroundColor: theme.withOpacity(
                              colors.success,
                              0.1
                           ),
                           borderColor: colors.success,
                        },
                     ]}
                  >
                     <View style={styles.bestDealHeader}>
                        <MaterialIcons
                           name="local-offer"
                           size={24}
                           color={colors.success}
                        />
                        <Text
                           style={[
                              styles.bestDealTitle,
                              { color: colors.success },
                           ]}
                        >
                           Best Deal
                        </Text>
                     </View>
                     <Text
                        style={[styles.shopName, { color: colors.textPrimary }]}
                     >
                        {bestDeal.shopName}
                     </Text>
                     <View style={styles.dealPriceRow}>
                        <Text
                           style={[styles.dealPrice, { color: colors.success }]}
                        >
                           ₱{bestDeal.price.toLocaleString()}
                        </Text>
                        {bestDeal.shipping?.cost > 0 && (
                           <Text
                              style={[
                                 styles.shippingCost,
                                 { color: colors.textMuted },
                              ]}
                           >
                              + ₱{bestDeal.shipping.cost} shipping
                           </Text>
                        )}
                     </View>
                     <TouchableOpacity
                        style={[
                           styles.viewButton,
                           { backgroundColor: colors.success },
                        ]}
                        onPress={() => Linking.openURL(bestDeal.productUrl)}
                     >
                        <Text
                           style={[
                              styles.viewButtonText,
                              { color: colors.textDark },
                           ]}
                        >
                           View on {bestDeal.shopName}
                        </Text>
                        <MaterialIcons
                           name="open-in-new"
                           size={16}
                           color={colors.textDark}
                        />
                     </TouchableOpacity>
                  </View>
               )}

               {/* Shop Sources */}
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
                     Available at {product.sources.length} Shops
                  </Text>

                  {product.sources.map((source, index) => {
                     const sourceRating = product.ratings?.bySource?.find(
                        (r) => r.shopName === source.shopName
                     );
                     const totalCost =
                        source.price + (source.shipping?.cost || 0);
                     const isBestDeal =
                        bestDeal && source.shopName === bestDeal.shopName;

                     return (
                        <TouchableOpacity
                           key={index}
                           style={[
                              styles.sourceCard,
                              {
                                 backgroundColor: theme.withOpacity(
                                    colors.bgTertiary,
                                    0.5
                                 ),
                                 borderColor: isBestDeal
                                    ? colors.success
                                    : 'transparent',
                                 borderWidth: isBestDeal ? 2 : 0,
                              },
                           ]}
                           onPress={() => Linking.openURL(source.productUrl)}
                        >
                           <View style={styles.sourceHeader}>
                              <View style={styles.sourceInfo}>
                                 <Text
                                    style={[
                                       styles.sourceName,
                                       { color: colors.textPrimary },
                                    ]}
                                 >
                                    {source.shopName}
                                 </Text>
                                 {sourceRating && (
                                    <View style={styles.sourceRating}>
                                       <MaterialIcons
                                          name="star"
                                          size={14}
                                          color={colors.warning}
                                       />
                                       <Text
                                          style={[
                                             styles.sourceRatingText,
                                             { color: colors.textSecondary },
                                          ]}
                                       >
                                          {sourceRating.average.toFixed(1)} (
                                          {sourceRating.count})
                                       </Text>
                                    </View>
                                 )}
                              </View>
                              <View style={styles.sourceStatus}>
                                 {source.inStock ? (
                                    <View
                                       style={[
                                          styles.inStockBadge,
                                          {
                                             backgroundColor: theme.withOpacity(
                                                colors.success,
                                                0.15
                                             ),
                                          },
                                       ]}
                                    >
                                       <Text
                                          style={[
                                             styles.inStockText,
                                             { color: colors.success },
                                          ]}
                                       >
                                          In Stock
                                       </Text>
                                    </View>
                                 ) : (
                                    <View
                                       style={[
                                          styles.inStockBadge,
                                          {
                                             backgroundColor: theme.withOpacity(
                                                colors.error,
                                                0.15
                                             ),
                                          },
                                       ]}
                                    >
                                       <Text
                                          style={[
                                             styles.inStockText,
                                             { color: colors.error },
                                          ]}
                                       >
                                          Out of Stock
                                       </Text>
                                    </View>
                                 )}
                              </View>
                           </View>

                           <View style={styles.sourcePricing}>
                              <View>
                                 <Text
                                    style={[
                                       styles.sourcePrice,
                                       { color: colors.primary },
                                    ]}
                                 >
                                    ₱{source.price.toLocaleString()}
                                 </Text>
                                 {source.shipping?.cost > 0 && (
                                    <Text
                                       style={[
                                          styles.sourceShipping,
                                          { color: colors.textMuted },
                                       ]}
                                    >
                                       + ₱{source.shipping.cost} shipping
                                    </Text>
                                 )}
                                 {source.shipping?.cost === 0 && (
                                    <Text
                                       style={[
                                          styles.sourceShipping,
                                          { color: colors.success },
                                       ]}
                                    >
                                       Free shipping
                                    </Text>
                                 )}
                              </View>
                              <View style={styles.sourceTotalContainer}>
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
                                       styles.sourceTotal,
                                       { color: colors.textPrimary },
                                    ]}
                                 >
                                    ₱{totalCost.toLocaleString()}
                                 </Text>
                              </View>
                           </View>

                           {source.shipping?.estimatedDays && (
                              <Text
                                 style={[
                                    styles.deliveryTime,
                                    { color: colors.textMuted },
                                 ]}
                              >
                                 <MaterialIcons
                                    name="local-shipping"
                                    size={12}
                                 />{' '}
                                 {source.shipping.estimatedDays}
                              </Text>
                           )}

                           {isBestDeal && (
                              <View
                                 style={[
                                    styles.bestDealTag,
                                    { backgroundColor: colors.success },
                                 ]}
                              >
                                 <MaterialIcons
                                    name="check"
                                    size={12}
                                    color={colors.textDark}
                                 />
                                 <Text
                                    style={[
                                       styles.bestDealTagText,
                                       { color: colors.textDark },
                                    ]}
                                 >
                                    Best Deal
                                 </Text>
                              </View>
                           )}
                        </TouchableOpacity>
                     );
                  })}
               </View>

               {/* Specifications */}
               {product.specifications && (
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
                        Specifications
                     </Text>
                     {Object.entries(product.specifications).map(
                        ([key, value]) => (
                           <View key={key} style={styles.specRow}>
                              <Text
                                 style={[
                                    styles.specKey,
                                    { color: colors.textSecondary },
                                 ]}
                              >
                                 {key}
                              </Text>
                              <Text
                                 style={[
                                    styles.specValue,
                                    { color: colors.textPrimary },
                                 ]}
                              >
                                 {value}
                              </Text>
                           </View>
                        )
                     )}
                  </View>
               )}

               {/* Platform Reviews */}
               <View
                  style={[
                     styles.card,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
               >
                  <View style={styles.reviewsHeader}>
                     <Text
                        style={[
                           styles.sectionTitle,
                           { color: colors.textPrimary },
                        ]}
                     >
                        Reviews ({reviews.length})
                     </Text>
                     <TouchableOpacity
                        style={[
                           styles.addReviewButton,
                           { backgroundColor: colors.primary },
                        ]}
                        onPress={() => setShowReviewModal(true)} // Add this
                     >
                        <MaterialIcons
                           name="add"
                           size={20}
                           color={colors.textDark}
                        />
                        <Text
                           style={[
                              styles.addReviewText,
                              { color: colors.textDark },
                           ]}
                        >
                           Write Review
                        </Text>
                     </TouchableOpacity>
                  </View>

                  {reviews.length === 0 ? (
                     <Text
                        style={[styles.noReviews, { color: colors.textMuted }]}
                     >
                        No community reviews yet. Be the first to review!
                     </Text>
                  ) : (
                     reviews.map((review) => (
                        <View
                           key={review._id}
                           style={[
                              styles.reviewCard,
                              {
                                 backgroundColor: theme.withOpacity(
                                    colors.bgTertiary,
                                    0.5
                                 ),
                              },
                           ]}
                        >
                           <View style={styles.reviewHeader}>
                              <Text
                                 style={[
                                    styles.reviewUser,
                                    { color: colors.textPrimary },
                                 ]}
                              >
                                 @{review.user.username}
                              </Text>
                              <View style={styles.reviewRating}>
                                 <MaterialIcons
                                    name="star"
                                    size={16}
                                    color={colors.warning}
                                 />
                                 <Text
                                    style={[
                                       styles.reviewRatingText,
                                       { color: colors.textSecondary },
                                    ]}
                                 >
                                    {review.rating}
                                 </Text>
                              </View>
                           </View>
                           <Text
                              style={[
                                 styles.reviewComment,
                                 { color: colors.textSecondary },
                              ]}
                           >
                              {review.comment}
                           </Text>
                           <Text
                              style={[
                                 styles.reviewDate,
                                 { color: colors.textMuted },
                              ]}
                           >
                              {new Date(review.createdAt).toLocaleDateString()}
                           </Text>
                        </View>
                     ))
                  )}
               </View>
            </ScrollView>
         </LinearGradient>
         <ReviewSubmission
            visible={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            productId={partId}
            onSubmitSuccess={handleReviewSuccess}
         />
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
      paddingBottom: 40,
   },
   card: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
   },
   categoryBadge: {
      alignSelf: 'flex-start',
      marginBottom: 8,
   },
   categoryText: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1,
   },
   productName: {
      fontSize: 22,
      fontWeight: '800',
      marginBottom: 4,
      lineHeight: 28,
   },
   brandModel: {
      fontSize: 14,
      marginBottom: 16,
   },
   priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
   },
   priceLabel: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 4,
   },
   price: {
      fontSize: 18,
      fontWeight: '800',
   },
   stockBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      gap: 6,
   },
   stockText: {
      fontSize: 12,
      fontWeight: '700',
   },
   ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
   },
   ratingText: {
      fontSize: 16,
      fontWeight: '700',
   },
   reviewCount: {
      fontSize: 12,
   },
   bestDealCard: {
      borderWidth: 2,
   },
   bestDealHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
   },
   bestDealTitle: {
      fontSize: 18,
      fontWeight: '800',
   },
   shopName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
   },
   dealPriceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
      marginBottom: 12,
   },
   dealPrice: {
      fontSize: 24,
      fontWeight: '800',
   },
   shippingCost: {
      fontSize: 12,
   },
   viewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      gap: 6,
   },
   viewButtonText: {
      fontSize: 14,
      fontWeight: '700',
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
   },
   sourceCard: {
      padding: 12,
      borderRadius: 12,
      marginBottom: 12,
      position: 'relative',
   },
   sourceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
   },
   sourceInfo: {
      flex: 1,
   },
   sourceName: {
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 4,
   },
   sourceRating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
   },
   sourceRatingText: {
      fontSize: 12,
      fontWeight: '600',
   },
   sourceStatus: {
      marginLeft: 8,
   },
   inStockBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
   },
   inStockText: {
      fontSize: 11,
      fontWeight: '700',
   },
   sourcePricing: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 8,
   },
   sourcePrice: {
      fontSize: 18,
      fontWeight: '800',
   },
   sourceShipping: {
      fontSize: 11,
      marginTop: 2,
   },
   sourceTotalContainer: {
      alignItems: 'flex-end',
   },
   totalLabel: {
      fontSize: 10,
      fontWeight: '600',
   },
   sourceTotal: {
      fontSize: 16,
      fontWeight: '700',
   },
   deliveryTime: {
      fontSize: 11,
   },
   bestDealTag: {
      position: 'absolute',
      top: 8,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
   },
   bestDealTagText: {
      fontSize: 10,
      fontWeight: '700',
   },
   specRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
   },
   specKey: {
      fontSize: 14,
      fontWeight: '600',
      flex: 1,
   },
   specValue: {
      fontSize: 14,
      flex: 1,
      textAlign: 'right',
   },
   reviewsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
   },
   addReviewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      gap: 4,
   },
   addReviewText: {
      fontSize: 13,
      fontWeight: '700',
   },
   noReviews: {
      fontSize: 14,
      textAlign: 'center',
      paddingVertical: 24,
   },
   reviewCard: {
      padding: 12,
      borderRadius: 12,
      marginBottom: 12,
   },
   reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
   },
   reviewUser: {
      fontSize: 14,
      fontWeight: '700',
   },
   reviewRating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
   },
   reviewRatingText: {
      fontSize: 14,
      fontWeight: '600',
   },
   reviewComment: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 6,
   },
   reviewDate: {
      fontSize: 11,
   },
   loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   error: {
      flex: 1,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
   },
});
