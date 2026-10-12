import axios from "axios";
// import { useUserStore } from '@/stores/userStore'
import { useLoadingStore } from "@/stores/loadingStore";

export const baseUrl = "http://127.0.0.1:8765";
const request = axios.create({
  baseURL: `${baseUrl}/api`,
  timeout: 16000,
});
request.interceptors.request.use(
  (config: any) => {
    if (!config?.silent) {
      useLoadingStore().start && useLoadingStore().start();
    }
    //   const userStore = useUserStore()
    //   if (userStore.token) {
    //     config.headers.Authorization = `Bearer ${userStore.token}`
    //   }
    return config;
  },
  (err) => {
    useLoadingStore().stop && useLoadingStore().stop();
    return Promise.reject(err);
  },
);

request.interceptors.response.use(
  (res) => {
    const { ok, message } = res.data;
    if (!ok) {
      return Promise.reject(new Error(message || "请求失败"));
    }
    useLoadingStore().stop && useLoadingStore().stop();
    return res.data;
  },
  (err) => {
    if (err.response?.status === 401) {
      //   const userStore = useUserStore()
      //   userStore.logout()
      // router.push('/login')
    }
    if (!err.config?.silent) {
      useLoadingStore().stop && useLoadingStore().stop();
    }
    return Promise.reject(err);
  },
);

export default request;
