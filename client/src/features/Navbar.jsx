import { routePaths } from "../routes/index.jsx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../actions/index.jsx";

const Navbar = () => {
  const dispatch = useDispatch();
  const onLogout = (event) => {
    event.preventDefault();
    toast("User logged out.", { type: "success" });
    dispatch(setUser({ username: `Guest ${uuid()}` }));
  };

  return (
    <ul className="flex gap-6 bg-teal-700 h-10 items-center px-10">
      {routePaths.map((route, index) => (
        <Link to={route.path} key={index}>
          <li className="text-stone-300 h-6 rounded hover:bg-teal-900 px-2 cursor-pointer">
            {route.name}
          </li>
        </Link>
      ))}
      <li
        className="text-stone-300 h-6 rounded hover:bg-teal-900 px-2 cursor-pointer ml-auto mr-2"
        onClick={onLogout}
        key="logout"
      >
        Logout
      </li>
    </ul>
  );
};

export default Navbar;
