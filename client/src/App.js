import { Routes, Route } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Layout from "./components/Layout";
import LinkPage from "./pages/linkpage/LinkPage";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import Home from "./pages/home/Home";
import Editor from "./pages/editors/Editor";
import Admin from "./pages/admin/Admin";
import Lounge from "./pages/lounge/Lounge";
import Missing from "./components/Missing";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

const ROLES = {
   User: 2001,
   Editor: 1984,
   Admin: 5150,
};

function App() {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="LinkPage" element={<LinkPage />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            {/* Protected routes */}
            <Route element={<PersistLogin />}>
               <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                  <Route path="/" element={<Home />} />
               </Route>
               {/*  */}
               <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
                  <Route path="editor" element={<Editor />} />
               </Route>
               <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="admin" element={<Admin />} />
               </Route>
               <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                  <Route path="lounge" element={<Lounge />} />
               </Route>
            </Route>
         </Route>
         {/* Catch all routes */}
         <Route path="*" element={<Missing />} />
      </Routes>
   );
}

export default App;
