import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
   const refresh = useRefreshToken();
   const { auth } = useAuth();

   useEffect(() => {
      const requestIntercept = axiosPrivate.interceptors.request.use(
         (config) => {
            if (!config.headers["Authorization"]) {
               config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
            }
            return config;
         },
         (error) => {
            console.log('[Error, inter, req]',error)
            return Promise.reject(error);
         }
      );

      const responseIntercept = axiosPrivate.interceptors.response.use(
         (response) => response,
         async (error) => {
            console.log('dupa1',error)
            const prevRequest = error?.config;
            if (error?.response?.status === 403 && !prevRequest?.sent) {
               prevRequest.sent = true;
               const newAccessToken = await refresh();
               console.log(prevRequest)
               prevRequest.headers = { ...prevRequest.headers }; // axios error https://github.com/axios/axios/issues/5143
               prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
               return axiosPrivate(prevRequest);
            }
            console.log('dupa2')
            return Promise.reject(error);
         }
      );

      return () => {
         axiosPrivate.interceptors.request.eject(requestIntercept);
         axiosPrivate.interceptors.response.eject(responseIntercept);
      };
   }, [auth, refresh]);

   return axiosPrivate;
};

export default useAxiosPrivate;
