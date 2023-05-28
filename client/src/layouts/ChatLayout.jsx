import Sidebar from "../features/Sidebar";
import Chat from "../features/Chat";

const ChatLayout = ({
  handleSearchUser,
  handleSendMessage,
  handleChangeRoom,
  handleCreateRoom,
  userSearchUsername,
  userSearchResult,
  setUserSearchResult,
  createRoomUsers,
  setCreateRoomUsers,
  createRoomName,
  setCreateRoomName,
  roomList,
  setRoomList,
  room,
  message,
  setMessage,
  socket
}) => {
  return (
    <div className="flex h-screen bg-[#010409] select-none">
      <Sidebar
        rooms={roomList}
        handleChangeRoom={handleChangeRoom}
        handleCreateRoom={handleCreateRoom}
        currentRoom={room}
        createRoomUsers={createRoomUsers}
        handleSearchUser={handleSearchUser}
        userSearchResult={userSearchResult}
        setUserSearchResult={setUserSearchResult}
        userSearchUsername={userSearchUsername}
        setCreateRoomName={setCreateRoomName}
        createRoomName={createRoomName}
        setRoomList={setRoomList}
        setCreateRoomUsers={setCreateRoomUsers}
      />

      <Chat
        handleSendMessage={handleSendMessage}
        roomList={roomList}
        setMessage={setMessage}
        message={message}
        room={room}
        socket={socket}
      />
    </div>
  );
};

export default ChatLayout;