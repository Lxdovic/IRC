import { useState } from "react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { modifyRoom, leaveRoom, deleteRoom } from "../../api/chat";

const Room = ({ room, setRoomList }) => {
  const [roomMenuIsOpen, setRoomMenuIsOpen] = useState(false);
  const [roomName, setRoomName] = useState(room.name);
  const [roomIsPrivate, setRoomIsPrivate] = useState(room.isPrivate);
  const [linkIsCopied, setLinkIsCopied] = useState(false);

  const user = useSelector((state) => state.user);

  const handleOpenRoomMenu = (e) => {
    e.stopPropagation();

    if (roomMenuIsOpen) {
      setLinkIsCopied(false);
    }

    setRoomMenuIsOpen(!roomMenuIsOpen);
  };

  const handleModifyRoom = async (e) => {
    e.preventDefault();


    if (roomName === room.name && roomIsPrivate === room.isPrivate) {
      return;
    }

    try {
      const response = await modifyRoom(
        {
          name: roomName,
          isPrivate: roomIsPrivate,
        },
        room._id
      );

      setRoomList((prev) =>
        prev.map((currRoom) => {
          if (room._id === currRoom._id) {
            return {
              ...currRoom,
              name: roomName,
              isPrivate: roomIsPrivate,
            };
          }

          return currRoom;
        })
      );

    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyRoomLink = (e) => {
    navigator.clipboard.writeText(`http://localhost:5173/join/${room._id}`);

    setLinkIsCopied(true);
  };

  const handleLeaveRoom = async (e) => {
    e.preventDefault();

    try {
      const response = await leaveRoom(room._id);

      setRoomList((prev) =>
        prev.filter((currRoom) => currRoom._id !== room._id)
      );

    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRoom = async (e) => {
    e.preventDefault();

    try {
      const response = await deleteRoom(room._id);

      setRoomList((prev) =>
        prev.filter((currRoom) => currRoom._id !== room._id)
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <span className="flex gap-2">
        <Icon
          icon="mdi:account-group"
          className="self-center"
          color={room.isPrivate ? "rgb(244 63 94)" : "rgb(14 165 233)"}
        />
        {room.name}
      </span>

      <Icon
        icon="mdi:dots-vertical"
        color="#F0F6FC"
        onClick={(e) => handleOpenRoomMenu(e)}
        className="self-center rounded-full hover:bg-[#30363D] h-6 w-6 p-1"
      />

      {roomMenuIsOpen && (
        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleModifyRoom}
          className="absolute flex flex-col gap-2 w-32 right-[-10rem] top-0 p-2 bg-[#0D1117] rounded z-10"
        >
          <label htmlFor={room._id + "SettingsName"} className="text-[#F0F6FC]">
            Room name
          </label>

          <input
            id={room._id + "SettingsName"}
            type="text"
            className="indent-2 w-full outline-0 h-8 rounded bg-[#161B22] text-[#F0F6FC]"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <button
            type="submit"
            className="w-full mt-auto outline-0 h-8 rounded bg-[#161B22] text-[#F0F6FC]"
          >
            Save
          </button>

          <label className="relative inline-flex justify-between cursor-pointer">
            <input
              id={room._id + "isPrivate"}
              type="checkbox"
              className="sr-only peer"
              checked={roomIsPrivate}
              onChange={() => setRoomIsPrivate(!roomIsPrivate)}
            />
            <div className="w-11 h-6 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
            <span className="self-center text-sm font-medium text-gray-300">
              Private
            </span>
          </label>

          {!roomIsPrivate && (
            <button
              onClick={handleCopyRoomLink}
              className={`w-fulloutline-0 h-8 rounded text-[#F0F6FC] ${
                linkIsCopied ? "bg-sky-500" : "bg-[#161B22]"
              }`}
            >
              {linkIsCopied ? "Copied!" : "Copy link"}
            </button>
          )}

          {room.creator === user._id ? (
            <button
              className="w-full mt-auto outline-0 h-8 rounded bg-rose-500 text-[#F0F6FC]"
              onClick={handleDeleteRoom}
            >
              Delete
            </button>
          ) : (
            <button
              className="w-full mt-auto outline-0 h-8 rounded bg-rose-500 text-[#F0F6FC]"
              onClick={handleLeaveRoom}
            >
              Leave
            </button>
          )}
        </form>
      )}
    </>
  );
};

export default Room;
