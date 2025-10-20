import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
   baseURL: API_URL,
});

// Products
export const getProducts = async (filters = {}) => {
   try {
      const { data } = await api.get('/products', { params: filters });
      return data;
   } catch (error) {
      return { error: true, message: error.response?.data?.message };
   }
};

export const getProduct = async (id) => {
   try {
      const { data } = await api.get(`/products/${id}`);
      return data;
   } catch (error) {
      return { error: true, message: error.response?.data?.message };
   }
};

export const createReview = async (productId, reviewData) => {
   try {
      const { data } = await api.post(
         `/products/${productId}/reviews`,
         reviewData
      );
      return data;
   } catch (error) {
      return { error: true, message: error.response?.data?.message };
   }
};

export const getReviews = async (productId) => {
   try {
      const { data } = await api.get(`/products/${productId}/reviews`);
      return data;
   } catch (error) {
      return { error: true, message: error.response?.data?.message };
   }
};

// Bundles
export const getBundles = async () => {
   try {
      const { data } = await api.get('/bundles');
      return data;
   } catch (error) {
      return { error: true, message: error.response?.data?.message };
   }
};

export const getBundle = async (id) => {
   try {
      const { data } = await api.get(`/bundles/${id}`);
      return data;
   } catch (error) {
      return { error: true, message: error.response?.data?.message };
   }
};

export const createBundle = async (bundleData) => {
   try {
      // Transform bundleData.parts to products array
      const products = Object.entries(bundleData.parts).map(
         ([category, part]) => ({
            product: part._id,
            category,
         })
      );

      // Extract sources with proper structure
      const sources = {};
      Object.entries(bundleData.sources || {}).forEach(([category, source]) => {
         sources[category] = {
            shopName: source.shopName,
            price: source.price,
            productUrl: source.productUrl,
            shipping: source.shipping || { available: false, cost: 0 },
         };
      });

      const payload = {
         name: bundleData.name,
         products,
         sources,
         notes: bundleData.notes || '',
         compatibilityScore: bundleData.compatibilityScore || 0,
         comfortProfile: bundleData.comfortProfile || {},
         isPublic: bundleData.isPublic || false,
      };

      const { data } = await api.post('/bundles', payload);
      return data;
   } catch (error) {
      return {
         error: true,
         message: error.response?.data?.message || error.message,
      };
   }
};
export const updateBundle = async (id, bundleData) => {
   try {
      const { data } = await api.put(`/bundles/${id}`, bundleData);
      return data;
   } catch (error) {
      return { error: true, message: error.response?.data?.message };
   }
};

export const deleteBundle = async (id) => {
   try {
      const { data } = await api.delete(`/bundles/${id}`);
      return data;
   } catch (error) {
      return { error: true, message: error.response?.data?.message };
   }
};

export const getBundleComfortRating = async (parts) => {
   try {
      const { data } = await api.post('/ml/comfort/bundle', { parts });
      return data;
   } catch (error) {
      return {
         error: true,
         message: error.response?.data?.message || 'Comfort rating failed',
      };
   }
};

export const getProductComfortRating = async (productId) => {
   try {
      const { data } = await api.get(`/ml/comfort/product/${productId}`);
      return data;
   } catch (error) {
      return {
         error: true,
         message: error.response?.data?.message || 'Comfort rating failed',
      };
   }
};

export const getMLStatus = async () => {
   try {
      const { data } = await api.get('/ml/status');
      return data;
   } catch (error) {
      return {
         error: true,
         message: error.response?.data?.message || 'ML status check failed',
      };
   }
};

export default api;
