import React, { useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   Modal,
   ScrollView,
   Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { createReview } from '../services/api';

export default function ReviewSubmission({
   visible,
   onClose,
   productId,
   onSubmitSuccess,
}) {
   const { theme } = useTheme();
   const { colors } = theme;

   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState('');
   const [comfortRatings, setComfortRatings] = useState({
      ease: 0,
      performance: 0,
      noise: 0,
      temperature: 0,
   });
   const [submitting, setSubmitting] = useState(false);

   const handleSubmit = async () => {
      if (rating === 0) {
         Alert.alert('Error', 'Please provide a rating');
         return;
      }

      if (!comment.trim()) {
         Alert.alert('Error', 'Please write a comment');
         return;
      }

      setSubmitting(true);

      const reviewData = {
         rating,
         comment: comment.trim(),
         comfortRatings: {
            ease: comfortRatings.ease,
            performance: comfortRatings.performance,
            noise: comfortRatings.noise,
            temperature: comfortRatings.temperature,
         },
      };

      const result = await createReview(productId, reviewData);

      setSubmitting(false);

      if (result.error) {
         Alert.alert('Error', result.message || 'Failed to submit review');
      } else {
         Alert.alert('Success', 'Review submitted successfully!');
         resetForm();
         onSubmitSuccess?.();
         onClose();
      }
   };

   const resetForm = () => {
      setRating(0);
      setComment('');
      setComfortRatings({ ease: 0, performance: 0, noise: 0, temperature: 0 });
   };

   const renderStars = (currentRating, onPress) => {
      return (
         <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
               <TouchableOpacity key={star} onPress={() => onPress(star)}>
                  <MaterialIcons
                     name={star <= currentRating ? 'star' : 'star-border'}
                     size={32}
                     color={
                        star <= currentRating
                           ? colors.warning
                           : colors.textMuted
                     }
                  />
               </TouchableOpacity>
            ))}
         </View>
      );
   };

   const renderComfortRating = (label, key) => {
      const value = comfortRatings[key];
      return (
         <View style={styles.comfortItem}>
            <Text
               style={[styles.comfortLabel, { color: colors.textSecondary }]}
            >
               {label}
            </Text>
            <View style={styles.comfortStars}>
               {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                     key={star}
                     onPress={() =>
                        setComfortRatings((prev) => ({ ...prev, [key]: star }))
                     }
                  >
                     <MaterialIcons
                        name={star <= value ? 'star' : 'star-border'}
                        size={24}
                        color={
                           star <= value ? colors.primary : colors.textMuted
                        }
                     />
                  </TouchableOpacity>
               ))}
            </View>
         </View>
      );
   };

   return (
      <Modal
         visible={visible}
         animationType="slide"
         transparent={true}
         onRequestClose={onClose}
      >
         <View style={styles.overlay}>
            <View
               style={[styles.container, { backgroundColor: colors.bgPrimary }]}
            >
               <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                     Write a Review
                  </Text>
                  <TouchableOpacity
                     onPress={onClose}
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
                  contentContainerStyle={styles.content}
                  showsVerticalScrollIndicator={false}
               >
                  {/* Overall Rating */}
                  <View style={styles.section}>
                     <Text
                        style={[
                           styles.sectionTitle,
                           { color: colors.textPrimary },
                        ]}
                     >
                        Overall Rating *
                     </Text>
                     {renderStars(rating, setRating)}
                  </View>

                  {/* Comment */}
                  <View style={styles.section}>
                     <Text
                        style={[
                           styles.sectionTitle,
                           { color: colors.textPrimary },
                        ]}
                     >
                        Your Experience *
                     </Text>
                     <TextInput
                        style={[
                           styles.textInput,
                           {
                              backgroundColor: colors.surface,
                              color: colors.textPrimary,
                              borderColor: colors.surfaceBorder,
                           },
                        ]}
                        placeholder="Share your experience with this product..."
                        placeholderTextColor={colors.textMuted}
                        multiline
                        numberOfLines={6}
                        value={comment}
                        onChangeText={setComment}
                        maxLength={500}
                     />
                     <Text
                        style={[styles.charCount, { color: colors.textMuted }]}
                     >
                        {comment.length}/500
                     </Text>
                  </View>

                  {/* Comfort Ratings */}
                  <View style={styles.section}>
                     <Text
                        style={[
                           styles.sectionTitle,
                           { color: colors.textPrimary },
                        ]}
                     >
                        Comfort Ratings (Optional)
                     </Text>
                     {renderComfortRating('Ease of Use', 'ease')}
                     {renderComfortRating('Performance', 'performance')}
                     {renderComfortRating('Noise Level', 'noise')}
                     {renderComfortRating('Temperature', 'temperature')}
                  </View>
               </ScrollView>

               {/* Submit Button */}
               <View
                  style={[styles.footer, { backgroundColor: colors.bgPrimary }]}
               >
                  <TouchableOpacity
                     style={[
                        styles.submitButton,
                        {
                           backgroundColor:
                              rating > 0 && comment.trim()
                                 ? colors.primary
                                 : colors.surface,
                        },
                     ]}
                     onPress={handleSubmit}
                     disabled={submitting || rating === 0 || !comment.trim()}
                  >
                     <Text
                        style={[
                           styles.submitText,
                           {
                              color:
                                 rating > 0 && comment.trim()
                                    ? colors.textDark
                                    : colors.textMuted,
                           },
                        ]}
                     >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>
   );
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
   },
   container: {
      height: '90%',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
   },
   title: {
      fontSize: 22,
      fontWeight: '800',
   },
   closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
   },
   content: {
      padding: 16,
      paddingBottom: 100,
   },
   section: {
      marginBottom: 24,
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 12,
   },
   stars: {
      flexDirection: 'row',
      gap: 8,
   },
   textInput: {
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      fontSize: 15,
      textAlignVertical: 'top',
      minHeight: 120,
   },
   charCount: {
      fontSize: 12,
      textAlign: 'right',
      marginTop: 4,
   },
   comfortItem: {
      marginBottom: 16,
   },
   comfortLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
   },
   comfortStars: {
      flexDirection: 'row',
      gap: 4,
   },
   footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
   },
   submitButton: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
   },
   submitText: {
      fontSize: 16,
      fontWeight: '700',
   },
});
