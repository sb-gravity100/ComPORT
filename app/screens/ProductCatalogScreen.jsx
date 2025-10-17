import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   TextInput,
   TouchableOpacity,
   StatusBar,
   ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getProducts } from '../services/api';
import PartCard from '../components/PartCard';
import { useNavigation } from '@react-navigation/native';

const CATEGORIES = [
   'All',
   'CPU',
   'GPU',
   'RAM',
   'Motherboard',
   'Storage',
   'PSU',
   'Case',
];

export default function ProductCatalogScreen() {
   const { theme, isDark } = useTheme();
   const { colors, gradients, spacing } = theme;
   const navigation = useNavigation();

   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('All');
   const [sortBy, setSortBy] = useState('newest');

   useEffect(() => {
      fetchProducts();
   }, [selectedCategory, sortBy]);

   const fetchProducts = async () => {
      setLoading(true);
      const filters = {
         category: selectedCategory !== 'All' ? selectedCategory : undefined,
         sort: sortBy,
         search: search || undefined,
      };

      const result = await getProducts(filters);
      if (!result.error) {
         setProducts(result.products);
      }
      setLoading(false);
   };

   const handleSearch = () => {
      fetchProducts();
   };

   return (
      <>
         <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
         <LinearGradient colors={gradients.primary} style={styles.container}>
            <View style={styles.header}>
               <Text style={[styles.title, { color: colors.primary }]}>
                  Browse Parts
               </Text>

               <View
                  style={[
                     styles.searchContainer,
                     {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                     },
                  ]}
               >
                  <MaterialIcons
                     name="search"
                     size={20}
                     color={colors.textMuted}
                  />
                  <TextInput
                     style={[styles.searchInput, { color: colors.textPrimary }]}
                     placeholder="Search products..."
                     placeholderTextColor={colors.textMuted}
                     value={search}
                     onChangeText={setSearch}
                     onSubmitEditing={handleSearch}
                  />
                  {search.length > 0 && (
                     <TouchableOpacity onPress={() => setSearch('')}>
                        <MaterialIcons
                           name="close"
                           size={20}
                           color={colors.textMuted}
                        />
                     </TouchableOpacity>
                  )}
               </View>

               <FlatList
                  horizontal
                  data={CATEGORIES}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={[
                           styles.categoryChip,
                           {
                              backgroundColor:
                                 selectedCategory === item
                                    ? colors.primary
                                    : colors.surface,
                              borderColor: colors.surfaceBorder,
                           },
                        ]}
                        onPress={() => setSelectedCategory(item)}
                     >
                        <Text
                           style={[
                              styles.categoryText,
                              {
                                 color:
                                    selectedCategory === item
                                       ? colors.textDark
                                       : colors.textSecondary,
                              },
                           ]}
                        >
                           {item}
                        </Text>
                     </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.categories}
               />

               <View style={styles.sortContainer}>
                  <Text style={[styles.sortLabel, { color: colors.textMuted }]}>
                     Sort by:
                  </Text>
                  <TouchableOpacity
                     style={[
                        styles.sortButton,
                        {
                           backgroundColor: colors.surface,
                           borderColor: colors.surfaceBorder,
                        },
                     ]}
                     onPress={() => {
                        const sorts = [
                           'newest',
                           'price_asc',
                           'price_desc',
                           'rating',
                        ];
                        const current = sorts.indexOf(sortBy);
                        setSortBy(sorts[(current + 1) % sorts.length]);
                     }}
                  >
                     <Text
                        style={[styles.sortText, { color: colors.textPrimary }]}
                     >
                        {sortBy === 'newest' && 'Newest'}
                        {sortBy === 'price_asc' && 'Price: Low to High'}
                        {sortBy === 'price_desc' && 'Price: High to Low'}
                        {sortBy === 'rating' && 'Highest Rated'}
                     </Text>
                     <MaterialIcons
                        name="arrow-drop-down"
                        size={20}
                        color={colors.textPrimary}
                     />
                  </TouchableOpacity>
               </View>
            </View>

            {loading ? (
               <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
               </View>
            ) : (
               <FlatList
                  data={products}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                     <PartCard
                        product={item}
                        onPress={() =>
                           navigation.navigate('PartDetail', {
                              partId: item._id,
                           })
                        }
                     />
                  )}
                  contentContainerStyle={styles.list}
                  ListEmptyComponent={
                     <View style={styles.emptyContainer}>
                        <MaterialIcons
                           name="inventory-2"
                           size={64}
                           color={colors.textMuted}
                        />
                        <Text
                           style={[
                              styles.emptyText,
                              { color: colors.textMuted },
                           ]}
                        >
                           No products found
                        </Text>
                     </View>
                  }
               />
            )}
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
   },
   title: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: 1,
      marginBottom: 16,
   },
   searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 48,
      marginBottom: 16,
      borderWidth: 1,
      gap: 8,
   },
   searchInput: {
      flex: 1,
      fontSize: 15,
   },
   categories: {
      paddingVertical: 8,
      gap: 8,
   },
   categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
   },
   categoryText: {
      fontSize: 13,
      fontWeight: '600',
   },
   sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 16,
      gap: 8,
   },
   sortLabel: {
      fontSize: 13,
      fontWeight: '600',
   },
   sortButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
   },
   sortText: {
      fontSize: 13,
      fontWeight: '600',
   },
   list: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 24,
   },
   loadingContainer: {
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
