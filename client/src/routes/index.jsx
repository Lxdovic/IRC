import GuestLogin from "../pages/GuestLogin";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Chat from "../pages/Chat";
import Join from "../pages/Join";
import TextAreaWithSlashCommands from "../features/Chat/TextAreaWithSlashCommands.jsx";

export const routes = [
  {
    path: "/",
    element: <GuestLogin />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/join/:id",
    element: <Join />,
  },
  {
    path: "/test",
    element: <TextAreaWithSlashCommands />,
  },
];
