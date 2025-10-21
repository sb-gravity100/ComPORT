import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TextInput,
   TouchableOpacity,
   StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToast } from '../context/ToastContext';
import { updateProduct } from '../services/api';
import ProductDetailsModal from '../components/ProductDetailsModal';

const CATEGORIES = [
   'CPU',
   'GPU',
   'RAM',
   'Motherboard',
   'Storage',
   'PSU',
   'Case',
];

export default function EditProductScreen() {
   const { theme, isDark } = useTheme();
   const { colors, gradients } = theme;
   const navigation = useNavigation();
   const route = useRoute();
   const { showToast } = useToast();

   const { product, refreshData } = route.params;

   const [formData, setFormData] = useState({
      name: product.name || '',
      category: product.category || CATEGORIES[0],
      brand: product.brand || '',
      model: product.model || '',
      shopName: '',
      price: '',
      productUrl: '',
      inStock: true,
      rating: '',
      ratingCount: '',
   });

   const [specifications, setSpecifications] = useState(
      product.specifications || {}
   );
   const [descriptions, setDescriptions] = useState(product.descriptions || []);
   const [modalVisible, setModalVisible] = useState(false);
   const [loading, setLoading] = useState(false);

   const handleUpdate = async () => {
      if (
         !formData.name ||
         !formData.brand ||
         !formData.model ||
         !formData.shopName ||
         !formData.price
      ) {
         showToast('Please fill all required fields', 'error');
         return;
      }

      setLoading(true);

      const updatedProduct = {
         ...product,
         name: formData.name,
         category: formData.category,
         brand: formData.brand,
         model: formData.model,
         sources: [
            {
               shopName: formData.shopName,
               shopUrl: `https://${formData.shopName.toLowerCase()}.com`,
               productUrl: formData.productUrl || '',
               price: parseFloat(formData.price),
               inStock: formData.inStock,
               shipping: {
                  available: true,
                  cost: 0,
               },
            },
         ],
         ratings: {
            bySource: [
               {
                  shopName: formData.shopName,
                  average: parseFloat(formData.rating) || null,
                  count: parseInt(formData.ratingCount) || 0,
               },
            ],
         },
         specifications,
         descriptions,
      };

      const result = await updateProduct(updatedProduct);
      setLoading(false);

      if (result.error) {
         showToast(result.message, 'error');
      } else {
         showToast('Product updated successfully!', 'success');
         if (refreshData) refreshData(result.product);
         navigation.goBack();
      }
   };

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
               <Text style={[styles.title, { color: colors.primary }]}>
                  Edit Product
               </Text>
               <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
               <View style={[styles.card, { backgroundColor: colors.surface }]}>
                  {/* Same input fields as AddProductScreen */}
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                     Product Name *
                  </Text>
                  <TextInput
                     style={[
                        styles.input,
                        {
                           backgroundColor: colors.bgTertiary,
                           color: colors.textPrimary,
                        },
                     ]}
                     value={formData.name}
                     onChangeText={(text) =>
                        setFormData({ ...formData, name: text })
                     }
                     placeholder="e.g., Intel Core i7-13700K"
                     placeholderTextColor={colors.textMuted}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                     Category *
                  </Text>
                  <View style={styles.categoryGrid}>
                     <TouchableOpacity
                        key={product.category}
                        disabled
                        style={[
                           styles.categoryChip,
                           {
                              backgroundColor: colors.bgTertiary,
                              borderColor: colors.surfaceBorder,
                           },
                        ]}
                        onPress={() =>
                           setFormData({
                              ...formData,
                              category: product.category,
                           })
                        }
                     >
                        <Text
                           style={{
                              color: colors.textSecondary,
                              fontWeight: '600',
                           }}
                        >
                           {product.category}
                        </Text>
                     </TouchableOpacity>
                  </View>

                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                     Brand *
                  </Text>
                  <TextInput
                     style={[
                        styles.input,
                        {
                           backgroundColor: colors.bgTertiary,
                           color: colors.textPrimary,
                        },
                     ]}
                     value={formData.brand}
                     onChangeText={(text) =>
                        setFormData({ ...formData, brand: text })
                     }
                     placeholder="e.g., Intel"
                     placeholderTextColor={colors.textMuted}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                     Model *
                  </Text>
                  <TextInput
                     style={[
                        styles.input,
                        {
                           backgroundColor: colors.bgTertiary,
                           color: colors.textPrimary,
                        },
                     ]}
                     value={formData.model}
                     onChangeText={(text) =>
                        setFormData({ ...formData, model: text })
                     }
                     placeholder="e.g., i7-13700K"
                     placeholderTextColor={colors.textMuted}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                     Shop Name *
                  </Text>
                  <TextInput
                     style={[
                        styles.input,
                        {
                           backgroundColor: colors.bgTertiary,
                           color: colors.textPrimary,
                        },
                     ]}
                     value={formData.shopName}
                     onChangeText={(text) =>
                        setFormData({ ...formData, shopName: text })
                     }
                     placeholder="e.g., PCHub"
                     placeholderTextColor={colors.textMuted}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                     Price (₱) *
                  </Text>
                  <TextInput
                     style={[
                        styles.input,
                        {
                           backgroundColor: colors.bgTertiary,
                           color: colors.textPrimary,
                        },
                     ]}
                     value={formData.price}
                     onChangeText={(text) =>
                        setFormData({ ...formData, price: text })
                     }
                     placeholder="e.g., 25000"
                     keyboardType="numeric"
                     placeholderTextColor={colors.textMuted}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                     Product URL
                  </Text>
                  <TextInput
                     style={[
                        styles.input,
                        {
                           backgroundColor: colors.bgTertiary,
                           color: colors.textPrimary,
                        },
                     ]}
                     value={formData.productUrl}
                     onChangeText={(text) =>
                        setFormData({ ...formData, productUrl: text })
                     }
                     placeholder="https://..."
                     placeholderTextColor={colors.textMuted}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                     Rating (1–5)
                  </Text>
                  <TextInput
                     style={[
                        styles.input,
                        {
                           backgroundColor: colors.bgTertiary,
                           color: colors.textPrimary,
                        },
                     ]}
                     value={formData.rating}
                     onChangeText={(text) =>
                        setFormData({ ...formData, rating: text })
                     }
                     placeholder="e.g., 4.5"
                     keyboardType="numeric"
                     placeholderTextColor={colors.textMuted}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                     Rating Count
                  </Text>
                  <TextInput
                     style={[
                        styles.input,
                        {
                           backgroundColor: colors.bgTertiary,
                           color: colors.textPrimary,
                        },
                     ]}
                     value={formData.ratingCount}
                     onChangeText={(text) =>
                        setFormData({ ...formData, ratingCount: text })
                     }
                     placeholder="e.g., 120"
                     keyboardType="numeric"
                     placeholderTextColor={colors.textMuted}
                  />

                  <TouchableOpacity
                     style={styles.checkboxRow}
                     onPress={() =>
                        setFormData({ ...formData, inStock: !formData.inStock })
                     }
                  >
                     <MaterialIcons
                        name={
                           formData.inStock
                              ? 'check-box'
                              : 'check-box-outline-blank'
                        }
                        size={24}
                        color={
                           formData.inStock ? colors.primary : colors.textMuted
                        }
                     />
                     <Text
                        style={[
                           styles.checkboxLabel,
                           { color: colors.textSecondary },
                        ]}
                     >
                        In Stock
                     </Text>
                  </TouchableOpacity>
                  {/* Replace submit button with modal trigger */}
                  <TouchableOpacity
                     style={[
                        styles.submitButton,
                        {
                           backgroundColor: colors.surface,
                           marginBottom: 12,
                           marginTop: 20,
                        },
                     ]}
                     onPress={() => setModalVisible(true)}
                  >
                     <Text
                        style={[
                           styles.submitText,
                           { color: colors.textPrimary },
                        ]}
                     >
                        Edit Specs & Descriptions
                     </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={[
                        styles.submitButton,
                        { backgroundColor: colors.primary },
                     ]}
                     onPress={handleUpdate}
                     disabled={loading}
                  >
                     <Text
                        style={[styles.submitText, { color: colors.textDark }]}
                     >
                        {loading ? 'Updating...' : 'Update Product'}
                     </Text>
                  </TouchableOpacity>
               </View>
            </ScrollView>

            <ProductDetailsModal
               visible={modalVisible}
               onClose={() => setModalVisible(false)}
               category={formData.category}
               specs={specifications}
               descriptions={descriptions}
               onSave={(specs, descs) => {
                  setSpecifications(specs);
                  setDescriptions(descs);
               }}
            />
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
   title: { fontSize: 18, fontWeight: '700' },
   content: { padding: 16, paddingBottom: 40 },
   card: { borderRadius: 16, padding: 16, marginBottom: 16 },
   label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
   input: {
      borderRadius: 12,
      padding: 12,
      fontSize: 15,
   },
   categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
   },
   categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
   },
   checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 16,
   },
   checkboxLabel: { fontSize: 15, fontWeight: '600' },
   submitButton: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
   },
   submitText: { fontSize: 16, fontWeight: '700' },
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
   title: { fontSize: 18, fontWeight: '700' },
   content: { padding: 16, paddingBottom: 40 },
   card: { borderRadius: 16, padding: 16, marginBottom: 16 },
   submitButton: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
   },
   submitText: { fontSize: 16, fontWeight: '700' },
});
