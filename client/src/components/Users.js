import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Users = () => {
   const [users, setUsers] = useState();
   const axiosPrivate = useAxiosPrivate();
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      let isMounted = true;
      const controller = new AbortController();
      const getUsers = async () => {
         try {
            const response = await axiosPrivate.get("/users", {
               signal: controller.signal,
            });
            const userNames = response.data.map(user => user.username)
            console.log(response.data);
            isMounted && setUsers(userNames);
         } catch (err) {
            if (controller.signal.aborted === true) return;
            console.log(err);
            navigate("/login", { state: { from: location }, replace: true });
         }
      };

      getUsers();

      return () => {
         isMounted = false;
         controller.abort();
      };
   }, []);

   useEffect(() => {
      console.log("[Users.js] mounted");
      return () => {
         console.log("[Users.js] unmounted");
      };
   }, []);

   return (
      <article>
         <h2>Users List</h2>
         {users?.length ? (
            <ul>
               {users.map((user, i) => (
                  <li key={i}>{user}</li>
               ))}
            </ul>
         ) : (
            <p>No user to display</p>
         )}

         <br />
      </article>
   );
};

export default Users;
