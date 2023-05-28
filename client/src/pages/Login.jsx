import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { whoami } from "../api/user";
import { useDispatch } from "react-redux";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ username, password });

      localStorage.setItem("accessToken", res.data.accessToken);

      const profile = await whoami();

      dispatch({ type: "SET_USER", user: profile.data.user });

      navigate("/chat");
    } catch (error) {
      console.log(error);
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
        <form className="flex flex-col gap-4 mt-40" onSubmit={handleSubmit}>
          <h2 className="font-['Poppins'] text-2xl text-gray-200">Sign in</h2>
          <input
            className="w-96 h-12 p-4 rounded-md bg-gray-800 text-gray-200 outline-none"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="Username"
          />
          <input
            className="w-96 h-12 p-4 rounded-md bg-gray-800 text-gray-200 outline-none"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <input
            className="w-32 h-12 cursor-pointer rounded-md bg-sky-500 text-gray-200 outline-none"
            value="Sign in"
            type="submit"
          />
        </form>{" "}
        <span className="flex gap-2 text-white mt-10">
          <a className="text-sky-500" href="/register">
            Register
          </a>
          or
          <a className="text-sky-500" href="/">
            Sign in as Guest
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

export default Login;
