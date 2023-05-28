import { useEffect, useRef } from "react";

import ChatMessage from "./ChatMessage";
import ChatSeparator from "./ChatSeparator";
import TextAreaWithSlashCommands from "./TextAreaWithSlashCommands.jsx";
import ChatLog from "./ChatLog";

const Chat = ({
  handleSendMessage,
  setMessage,
  message,
  room,
  roomList,
  socket
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [roomList]);

  const currentRoom = roomList.find(
    (roomFromList) => roomFromList._id === room
  );

  const messagesAndLogs = currentRoom?.messages
    .concat(currentRoom?.logs)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="relative h-full w-[calc(100vw-16rem)]">
      <ul
        ref={messagesEndRef}
        className={`pb-8 p-4 flex max-h-[100vh] h-[calc(100%-64px)] flex-col overflow-y-scroll overflow-x-hidden`}
      >
        {room &&
          messagesAndLogs?.map((item, index, items) => {
            let prevDate = new Date(items[index - 1]?.date).getDay();
            let currDate = new Date(item?.date).getDay();

            return item.isLog ? (
              <li className="text-white" key={index}>
                <ChatLog log={item} />
              </li>
            ) : (
              <li className="text-white" key={index}>
                {index > 0 && prevDate !== currDate && (
                  <ChatSeparator date={item.date} />
                )}
                <ChatMessage message={item} />
              </li>
            );
          })}
      </ul>

      <form className="flex bg-[#0D1117] p-2 absolute bottom-0 w-full">
        <TextAreaWithSlashCommands
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          currentRoom={currentRoom}
          roomList={roomList}
          socket={socket}
        />

        <button type="submit" className="hidden" />
      </form>
    </div>
  );
};

export default Chat;