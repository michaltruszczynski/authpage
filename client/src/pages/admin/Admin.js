import { Link } from "react-router-dom";
import Users from "../../components/Users";

const Admin = () => {
   return (
      <section>
         <h1>Admins Page</h1>
         <br />
         <Users />
         <br />
         <p>You must have been assigned an Admin role.</p>
         <div className="flexGrow">
            <Link to="/">Home</Link>
         </div>
      </section>
   );
};

export default Admin;
