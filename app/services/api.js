import axios from 'axios';
import Constants from 'expo-constants';

const DEV_URL = Constants.expoGoConfig?.debuggerHost
   ?.split(':')
   .shift()
   ?.concat(':6600/api');

const API_URL =
   process.env.NODE_ENV !== 'production'
      ? 'http://' + DEV_URL
      : process.env.EXPO_PUBLIC_API_URL;

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
      const { data } = await api.post('/bundles', bundleData);
      return data;
   } catch (error) {
      return { error: true, message: error.response?.data?.message };
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

export default api;
