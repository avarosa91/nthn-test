import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from '@/store';

Vue.use(VueAxios, axios);

// Headers
axios.defaults.headers.common.Accept = 'application/json';

// Interceptors
// Auto Bearer Authentication
axios.interceptors.request.use(
  (config) => {
    const token = Vue.$cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

// https://stackoverflow.com/questions/52096412/vue-js-and-axios-redirect-on-401
// AutoLogOut if 401
axios.interceptors.response.use(null, (error) => {
  if (error.response && error.response.status && error.response.status === 401 && window.location.pathname !== '/login') {
    if (store.getters['user/isAuthenticated']) {
      store.dispatch('user/cleanData')
        .then(() => {
          //  we use a redirect to reset all requests. If at the time of logout there were unfinished requests, then after authorization they substitute incorrect data
          window.location.href = '/login';
        });
    } else {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

// Base URL
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  axios,
};
