import axios from 'axios';
import Constants from 'expo-constants';

let API_URL = process.env.EXPO_PUBLIC_API_URL;

// if (process.env.NODE_ENV !== 'production') {
//    API_URL = Constants.expoGoConfig?.debuggerHost
//       ?.split(':')
//       .shift()
//       ?.concat(':6600/api');
// }
// console.log(API_URL);

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
      const payload = {
         ...bundleData,
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

export const updateUser = async (updates) => {
   try {
      const { data } = await api.put('/auth/me', updates);
      return data;
   } catch (error) {
      return { error: true, message: error.response?.data?.message };
   }
};

// app/services/api.js - Add this function

export const createProduct = async (productData) => {
   try {
      const { data } = await api.post('/products', productData);
      return data;
   } catch (error) {
      return {
         error: true,
         message: error.response?.data?.message || error.message,
      };
   }
};

export const updateProduct = async (id, productData) => {
   try {
      const { data } = await api.put(`/products/${id}`, productData);
      return data;
   } catch (error) {
      return {
         error: true,
         message: error.response?.data?.message || error.message,
      };
   }
};

export default api;
