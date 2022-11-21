import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useInput from "../../hooks/useInput";
import useToggle from "../../hooks/useToggle";

import axiosInstnance from "../../api/axios";
const LOGIN_URL = "/auth";

const Login = () => {
   const { setAuth } = useAuth();

   const navigate = useNavigate();
   const location = useLocation();
   const from = location.state?.from?.pathname || "/";

   const userRef = useRef();
   const errRef = useRef();

   const [user, resetUser, userAttributes] = useInput("user", ''); // useState("");

   const [pwd, setPwd] = useState("");
   const [errMsg, setErrMsg] = useState("");
   const [check, toggleCheck] = useToggle('persist', false);

   useEffect(() => {
      // console.log("didMount: ", userRef);
      userRef.current.focus();
      return () => {
         // console.log("unMount: ", userRef);
      };
   }, []);

   useEffect(() => {
      setErrMsg("");
   }, [user, pwd]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axiosInstnance.post(
            LOGIN_URL,
            { user, pwd },
            {
               withCredentials: true,
            }
         );

         console.log(response.data);
         const accessToken = response?.data?.accessToken;
         const roles = response?.data?.roles;
         console.log({ accessToken, roles });
         setAuth({ user, roles, accessToken });
         resetUser();
         setPwd("");
         navigate(from, { replace: true });
      } catch (err) {
         console.log(err);
         if (!err?.response) {
            setErrMsg("No Server response.");
         } else if (err.response?.status === 400) {
            setErrMsg("Missing username or password.");
         } else if (err.response?.status === 401) {
            setErrMsg("Unauthorized.");
         } else {
            setErrMsg("Login failed");
         }
         errRef.current.focus();
      }
   };

   return (
      <section>
         <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} arial-live="assertive">
            {errMsg}
         </p>
         <h1>Sign In</h1>
         <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" ref={userRef} autoComplete="off" {...userAttributes} required />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required />
            <button>Sign In</button>
            <div className="persistCheck">
               <input type="checkbox" id="persist" onChange={toggleCheck} checked={check} />
               <label htmlFor="persist">Trust this device</label>
            </div>
         </form>
         <p>
            Need an Account?
            <br />
            <span className="line">
               <Link to="/register">Sign Up</Link>
            </span>
         </p>
      </section>
   );
};

export default Login;
