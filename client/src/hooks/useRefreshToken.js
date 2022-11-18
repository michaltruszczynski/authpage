import axiosInstance from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
   const { setAuth } = useAuth();
   
   const refresh = async () => {
      const response = await axiosInstance.get("/refresh", {
         withCredentials: true,
      });

      setAuth((prev) => {
         console.log(prev);
         console.log(response.data.accessToken);
         return { ...prev, roles: response.data.roles, accessToken: response.data.accessToken };
      });

      return response.data.accessToken;
   };

   return refresh;
};

export default useRefreshToken;
