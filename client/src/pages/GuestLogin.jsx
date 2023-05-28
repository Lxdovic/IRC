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
    <div className="flex gap-16 justify-between bg-[#010409] w-screen h-screen p-32">
      <div className="w-1/3">
        <h1 className="font-['Poppins'] text-5xl font-bold text-gray-200 uppercase">
          Discord at Home
        </h1>
        <span className="font-['Poppins'] text-gray-200">
          A bit like discord but not nearly as good
        </span>
        <form className="flex flex-col gap-4 mt-40" onSubmit={handleGuestLogin}>
          <h2 className="font-['Poppins'] text-2xl text-gray-200">
            Sign in as Guest
          </h2>
          <input
            className="w-96 h-12 p-4 rounded-md bg-gray-800 text-gray-200 outline-none"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="Username"
          />
          <input
            className="w-32 h-12 cursor-pointer rounded-md bg-sky-500 text-gray-200 outline-none"
            value="Sign in"
            type="submit"
          />
        </form>
        <span className="flex gap-2 text-white mt-10">
          <a className="text-sky-500" href="/register">
            Register
          </a>
          or
          <a className="text-sky-500" href="/login">
            Sign in
          </a>
        </span>
      </div>
      <div className="w-2/3">
        <img
          className="rounded border-2 border-gray-800"
          alt="Discord at Home"
          src="DiscordAtHome.png"
        ></img>
      </div>
    </div>
  );
};

export default Home;
