import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { whoami } from "../api/user";
import { guestLogin } from "../api/auth";
import { toast } from "react-toastify";

const Home = () => {
  const [username, setUsername] = useState("");

  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGuestLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await guestLogin({ username });

      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      const profile = await whoami();

      dispatch({ type: "SET_USER", user: profile.data.user });

      navigate("/chat");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleGuestLogin}>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        placeholder="Username"
      />
      <input type="submit" />
    </form>
  );
};

export default Home;
