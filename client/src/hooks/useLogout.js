import axiosInstance from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
   const { setAuth } = useAuth();

   const useLogout = async () => {
      setAuth({});
      try {
         const response = await axiosInstance.get("/logout", {
            withCredentials: true,
         });
      } catch (err) {
         console.log(err);
      }
   };

   return useLogout;
};

export default useLogout;
