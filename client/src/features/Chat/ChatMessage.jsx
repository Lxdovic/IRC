import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUser } from "../../api/user";
import { useDispatch } from "react-redux";
import { parseEmote } from "../../utils/emotes";
import parseHTML from "html-react-parser";

const ChatMessage = ({ message }) => {
  const users = useSelector((state) => state.users);
  const author = users.find((user) => user._id === message.author);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (!author) {
        try {
          const result = await getUser(message.author);

          dispatch({
            type: "ADD_USER",
            user: result.data.user,
          });
        } catch (error) {
          console.log(error);
        }
      }
    })();
  });

  return (
    <div className="flex flex-col hover:bg-[#0D1117] p-4 rounded">
      <div className="flex gap-2">
        <span className="font-bold">
          {users.find((user) => user._id === message.author)?.username ||
            "User-" + message.author}
        </span>
        <span className="text-gray-400 text-sm font-regular self-center">
          {new Date(message.date).toLocaleString()}
        </span>
      </div>
      <pre className="text-gray-300 text-sm font-regular font-[Arial]">
        {parseHTML(parseEmote(message.content))}
      </pre>

      {message.attachments?.length > 0 &&
        message.attachments.map((attachment, index) => {
          return (
            <div key={index} className="py-2">
              {attachment.type === "image" && (
                <img
                  onClick={() => {
                    window.open(
                      import.meta.env.VITE_API_URL +
                        "/uploads/images/" +
                        attachment.name
                    );
                  }}
                  className="h-[300px] object-cover rounded cursor-pointer"
                  src={
                    import.meta.env.VITE_API_URL +
                    "/uploads/images/" +
                    attachment.name
                  }
                />
              )}

              {attachment.type === "audio" && (
                <audio
                  controlsList="nodownload noplaybackrate"
                  controls={true}
                  src={
                    import.meta.env.VITE_API_URL +
                    "/uploads/audios/" +
                    attachment.name
                  }
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ChatMessage;
