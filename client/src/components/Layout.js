import { Outlet, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Layout = () => {
   const { auth } = useAuth();
   const { accessToken } = auth;
   return (
      <main className="App">
         {!accessToken ? <Link to="/linkpage">Link Page</Link> : null}
         <Outlet />
      </main>
   );
};

export default Layout;
