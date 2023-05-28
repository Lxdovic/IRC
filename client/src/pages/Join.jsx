import { useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { joinRoom } from "../api/chat.jsx";

const Join = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    (async () => {
      try {
        const res = await joinRoom(id);

        if (res.status !== 200) toast.error(res.message);

        toast.success(res.message);

      } catch (err) {
        toast.error(err.response.message);
      }
    })();

    navigate("/chat");
  });
  return (
    <div/>
  );
}

export default Join;