import { useState } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";

import SidebarItem from "./SidebarItem";
import Room from "./Room";

const Sidebar = ({
  rooms,
  handleChangeRoom,
  createRoomUsers,
  handleSearchUser,
  userSearchResult,
  setCreateRoomUsers,
  userSearchUsername,
  createRoomName,
  setCreateRoomName,
  setUserSearchResult,
  handleCreateRoom,
  setRoomList,
}) => {
  const [createRoomMenuIsOpen, setCreateRoomMenuIsOpen] = useState(false);

  const user = useSelector((state) => state.user);

  const openCreateRoomMenu = () => {
    setCreateRoomMenuIsOpen(!createRoomMenuIsOpen);
  };

  const handleOpenRoomMenu = (e) => {
    e.stopPropagation();
  };

  return (
    <ul className="flex flex-col bg-[#0D1117] w-64 border-r gap-2 border-[#30363D] p-4">
      <li className="text-[#F0F6FC] flex gap-2">
        <Icon icon="mdi:user" width="30" height="30" className="self-center" />
        <span className="self-center">{user?.username}</span>
      </li>

      <hr className="mb-2 border-[#30363D]"></hr>

      {rooms.map((room, index) => {
        return (
          <SidebarItem
            className={"relative text-[#F0F6FC] justify-between cursor-pointer"}
            key={index}
            onClick={(e) => handleChangeRoom(e, room)}
          >
            <Room room={room} setRoomList={setRoomList} />
          </SidebarItem>
        );
      })}

      <SidebarItem
        className="text-[#F0F6FC] mt-auto flex-col gap-2 overflow-hidden"
        style={{
          transition: "all 0.3s ease-in-out",
          height: createRoomMenuIsOpen ? "100%" : "2.5rem",
          backgroundColor: createRoomMenuIsOpen ? "#161B22" : "transparent",
        }}
      >
        <div
          onClick={openCreateRoomMenu}
          className="flex w-full justify-between h-6 cursor-pointer"
        >
          <span>Create Room</span>
          <Icon
            icon="mdi:add"
            className={`self-center ${
              createRoomMenuIsOpen
                ? "rotate-45 hover:bg-rose-500 rounded"
                : "hover:bg-sky-400 rounded"
            }`}
          />
        </div>

        {createRoomMenuIsOpen && (
          <form
            onSubmit={handleCreateRoom}
            className="h-full flex flex-col gap-2 mt-2"
          >
            <input
              className="bg-[#161B22] border shadow-md border-gray-800 rounded indent-2 outline-0 py-1"
              type="text"
              placeholder="Room name"
              value={createRoomName}
              onChange={(e) => setCreateRoomName(e.target.value)}
            />
            <input
              className="bg-[#161B22] border shadow-md border-gray-800 rounded indent-2 outline-0 py-1"
              type="text"
              onChange={handleSearchUser}
              value={userSearchUsername}
              placeholder="Search for users"
            />
            {userSearchResult.length > 0 && (
              <ul className="flex flex-col gap-2">
                {userSearchResult.map((user, index) => (
                  <li
                    onClick={(e) => {
                      setUserSearchResult(
                        userSearchResult.filter((u) => u._id !== user._id)
                      );
                      setCreateRoomUsers([...createRoomUsers, user]);
                    }}
                    className="cursor-pointer flex gap-2 bg-rose-500 shadow-xl px-2 py-1 rounded"
                    key={index}
                  >
                    <Icon icon={"mdi:user"} className="self-center"></Icon>
                    {user.username}
                    <Icon
                      icon={"mdi:add"}
                      className="self-center ml-auto hover:bg-gray-700 rounded"
                    />
                  </li>
                ))}
              </ul>
            )}

            {createRoomUsers.length > 0 && (
              <ul className="mt-auto flex flex-col gap-2">
                <span className="self-center">Users</span>

                {createRoomUsers.map((user, index) => (
                  <li
                    className="cursor-pointer flex gap-2 bg-sky-500 shadow-xl rounded px-2 py-1"
                    key={index}
                  >
                    <Icon icon={"mdi:user"} className="self-center" />
                    {user.username}
                    <Icon
                      onClick={(e) =>
                        setCreateRoomUsers(
                          createRoomUsers.filter((u) => u._id !== user._id)
                        )
                      }
                      icon={"mdi:add"}
                      className="self-center rotate-45 ml-auto hover:bg-gray-700 rounded"
                    />
                  </li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              className={`flex shadow-xl justify-between px-2 hover:bg-sky-500 rounded py-1 ${
                createRoomUsers.length > 0
                  ? "mt-4 cursor-pointer"
                  : "mt-auto cursor-not-allowed"
              }`}
            >
              <span>Create</span>
              <Icon icon="mdi:send" className="self-center" />
            </button>
          </form>
        )}
      </SidebarItem>
    </ul>
  );
};

export default Sidebar;
