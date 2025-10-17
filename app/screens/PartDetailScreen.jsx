import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   ActivityIndicator,
   StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getProduct, getReviews } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function PartDetailScreen({ route }) {
   const { partId } = route.params;
   const { theme, isDark } = useTheme();
   const { colors, gradients, spacing } = theme;
   const navigation = useNavigation();

   const [product, setProduct] = useState(null);
   const [reviews, setReviews] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchData();
   }, [partId]);

   const fetchData = async () => {
      setLoading(true);
      const [productResult, reviewsResult] = await Promise.all([
         getProduct(partId),
         getReviews(partId),
      ]);

      if (!productResult.error) setProduct(productResult.product);
      if (!reviewsResult.error) setReviews(reviewsResult.reviews);
      setLoading(false);
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
                     <Text style={[styles.price, { color: colors.primary }]}>
                        ₱{product.price.toLocaleString()}
                     </Text>
                     {product.inStock ? (
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
                           <MaterialIcons
                              name="check-circle"
                              size={16}
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
                                 backgroundColor: theme.withOpacity(
                                    colors.error,
                                    0.1
                                 ),
                              },
                           ]}
                        >
                           <MaterialIcons
                              name="cancel"
                              size={16}
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
                  </View>

                  {product.averageRating > 0 && (
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
                           {product.averageRating.toFixed(1)}
                        </Text>
                        <Text
                           style={[
                              styles.reviewCount,
                              { color: colors.textMuted },
                           ]}
                        >
                           ({product.totalReviews} reviews)
                        </Text>
                     </View>
                  )}
               </View>

               {/* Comfort Score */}
               {product.comfortScore > 0 && (
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
                        Comfort Score
                     </Text>
                     <View style={styles.comfortScoreContainer}>
                        <View style={styles.scoreCircle}>
                           <Text
                              style={[
                                 styles.scoreValue,
                                 { color: colors.primary },
                              ]}
                           >
                              {product.comfortScore}
                           </Text>
                           <Text
                              style={[
                                 styles.scoreLabel,
                                 { color: colors.textMuted },
                              ]}
                           >
                              /100
                           </Text>
                        </View>
                        <View
                           style={[
                              styles.comfortBar,
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
                                 styles.comfortFill,
                                 {
                                    backgroundColor: colors.primary,
                                    width: `${product.comfortScore}%`,
                                 },
                              ]}
                           />
                        </View>
                     </View>
                  </View>
               )}

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

               {/* Reviews */}
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
                        No reviews yet. Be the first to review!
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

            {/* Add to Bundle Button */}
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
                     styles.addButton,
                     { backgroundColor: colors.primary },
                  ]}
               >
                  <MaterialIcons
                     name="add-shopping-cart"
                     size={24}
                     color={colors.textDark}
                  />
                  <Text
                     style={[styles.addButtonText, { color: colors.textDark }]}
                  >
                     Add to Bundle
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
      paddingBottom: 100,
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
   price: {
      fontSize: 28,
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
      fontSize: 14,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
   },
   comfortScoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
   },
   scoreCircle: {
      alignItems: 'center',
   },
   scoreValue: {
      fontSize: 32,
      fontWeight: '800',
   },
   scoreLabel: {
      fontSize: 12,
      fontWeight: '600',
   },
   comfortBar: {
      flex: 1,
      height: 12,
      borderRadius: 6,
      overflow: 'hidden',
   },
   comfortFill: {
      height: '100%',
      borderRadius: 6,
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
   footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
   },
   addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 16,
      gap: 8,
   },
   addButtonText: {
      fontSize: 16,
      fontWeight: '700',
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
