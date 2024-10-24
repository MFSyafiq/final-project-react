import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-black p-3 flex justify-end">
      <div>
        <div className="flex space-x-3 md:space-x-5 text-white">
          <Link to="/" className="hover:underline">
            <p>Home</p>
          </Link>
          <Link to="/menu-page" className="hover:underline">
            <p>Our Team</p>
          </Link>
          <Link to="/login" className="hover:underline">
            <p>Login/Register</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
