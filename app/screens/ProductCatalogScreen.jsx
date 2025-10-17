import React, { useState, useEffect, useRef } from 'react';
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
import api from '../services/api';
import { Animated } from 'react-native';

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
   const { colors, gradients } = theme;
   const navigation = useNavigation();
   const filterHeight = useRef(new Animated.Value(1)).current;

   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('All');
   const [selectedShop, setSelectedShop] = useState('All');
   const [shops, setShops] = useState(['All']);
   const [inStockOnly, setInStockOnly] = useState(false);
   const [sortBy, setSortBy] = useState('newest');
   const [showFilters, setShowFilters] = useState(true);
   const [collapsedSections, setCollapsedSections] = useState({
      category: false,
      shop: false,
      stockSort: false,
   });
   const [showCategoryFilter, setShowCategoryFilter] = useState(true);
   const [showShopFilter, setShowShopFilter] = useState(true);
   const [showStockSortFilter, setShowStockSortFilter] = useState(true);

   useEffect(() => {
      fetchShops();
   }, []);

   useEffect(() => {
      fetchProducts();
   }, [selectedCategory, selectedShop, sortBy, inStockOnly]);

   useEffect(() => {
      Animated.timing(filterHeight, {
         toValue: showFilters ? 1 : 0,
         duration: 300,
         useNativeDriver: false,
      }).start();
   }, [showFilters]);

   const animatedStyle = {
      opacity: filterHeight,
      height: filterHeight.interpolate({
         inputRange: [0, 1],
         outputRange: [0, null],
      }),
   };

   const fetchShops = async () => {
      try {
         const result = await api.get('/products/shops/list');
         if (result.data.success) {
            setShops(['All', ...result.data.shops.map((s) => s.name)]);
         }
      } catch (error) {
         console.error('Error fetching shops:', error);
      }
   };

   const fetchProducts = async () => {
      setLoading(true);
      const filters = {
         category: selectedCategory !== 'All' ? selectedCategory : undefined,
         sort: sortBy,
         search: search || undefined,
         shopName: selectedShop !== 'All' ? selectedShop : undefined,
         inStockOnly: inStockOnly ? 'true' : undefined,
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

               <Animated.View>
                  {/* Category Filter */}
                  <TouchableOpacity
                     onPress={() => setShowCategoryFilter(!showCategoryFilter)}
                     style={styles.filterToggle}
                  >
                     <Text
                        style={[
                           styles.filterLabel,
                           { color: colors.textMuted },
                        ]}
                     >
                        Category {showCategoryFilter ? '▲' : '▼'}
                     </Text>
                  </TouchableOpacity>

                  {showCategoryFilter && (
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
                  )}

                  {/* Shop Filter */}
                  {shops.length > 1 && (
                     <>
                        <TouchableOpacity
                           onPress={() => setShowShopFilter(!showShopFilter)}
                           style={styles.filterToggle}
                        >
                           <Text
                              style={[
                                 styles.filterLabel,
                                 { color: colors.textMuted },
                              ]}
                           >
                              Shop {showShopFilter ? '▲' : '▼'}
                           </Text>
                        </TouchableOpacity>

                        {showShopFilter && (
                           <FlatList
                              horizontal
                              data={shops}
                              showsHorizontalScrollIndicator={false}
                              keyExtractor={(item) => item}
                              renderItem={({ item }) => (
                                 <TouchableOpacity
                                    style={[
                                       styles.categoryChip,
                                       {
                                          backgroundColor:
                                             selectedShop === item
                                                ? colors.primary
                                                : colors.surface,
                                          borderColor: colors.surfaceBorder,
                                       },
                                    ]}
                                    onPress={() => setSelectedShop(item)}
                                 >
                                    <Text
                                       style={[
                                          styles.categoryText,
                                          {
                                             color:
                                                selectedShop === item
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
                        )}
                     </>
                  )}

                  {/* Stock Filter & Sort */}
                  <TouchableOpacity
                     onPress={() =>
                        setShowStockSortFilter(!showStockSortFilter)
                     }
                     style={styles.filterToggle}
                  >
                     <Text
                        style={[
                           styles.filterLabel,
                           { color: colors.textMuted },
                        ]}
                     >
                        Stock & Sort {showStockSortFilter ? '▲' : '▼'}
                     </Text>
                  </TouchableOpacity>

                  {showStockSortFilter && (
                     <View style={styles.filterRow}>
                        <TouchableOpacity
                           style={[
                              styles.stockToggle,
                              {
                                 backgroundColor: colors.surface,
                                 borderColor: inStockOnly
                                    ? colors.primary
                                    : colors.surfaceBorder,
                              },
                           ]}
                           onPress={() => setInStockOnly(!inStockOnly)}
                        >
                           <MaterialIcons
                              name={
                                 inStockOnly
                                    ? 'check-box'
                                    : 'check-box-outline-blank'
                              }
                              size={20}
                              color={
                                 inStockOnly ? colors.primary : colors.textMuted
                              }
                           />
                           <Text
                              style={[
                                 styles.stockToggleText,
                                 {
                                    color: inStockOnly
                                       ? colors.primary
                                       : colors.textSecondary,
                                 },
                              ]}
                           >
                              In Stock
                           </Text>
                        </TouchableOpacity>

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
                                 'availability',
                              ];
                              const current = sorts.indexOf(sortBy);
                              setSortBy(sorts[(current + 1) % sorts.length]);
                           }}
                        >
                           <Text
                              style={[
                                 styles.sortText,
                                 { color: colors.textPrimary },
                              ]}
                           >
                              {sortBy === 'newest' && 'Newest'}
                              {sortBy === 'price_asc' && 'Price: Low'}
                              {sortBy === 'price_desc' && 'Price: High'}
                              {sortBy === 'rating' && 'Top Rated'}
                              {sortBy === 'availability' && 'Most Available'}
                           </Text>
                           <MaterialIcons
                              name="arrow-drop-down"
                              size={20}
                              color={colors.textPrimary}
                           />
                        </TouchableOpacity>
                     </View>
                  )}
               </Animated.View>
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
   filterLabel: {
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
      marginBottom: 8,
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
   filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 16,
      gap: 8,
   },
   stockToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1.5,
      gap: 6,
   },
   stockToggleText: {
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
   toggleFiltersButton: {
      padding: 8,
      borderRadius: 8,
      alignSelf: 'flex-end',
      marginBottom: 8,
   },
   sectionToggle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
   },
});
