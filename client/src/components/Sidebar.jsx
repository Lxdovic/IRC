import { Icon } from "@iconify/react";
import { chatRoomsData } from "../data/chatRoomsData";

const Sidebar = (props) => {
  const chatRooms = chatRoomsData;

  return (
    <div className="flex flex-col gap-[5px] bg-teal-600 h-[calc(100vh-2.5rem)] w-52">
      <div className="flex items-center text-stone-300 ml-3 mt-2">
        Messages
        <Icon icon="ic:baseline-plus" className="cursor-pointer ml-auto mr-3" />
      </div>
      <ul>
        {chatRooms.map((room, index) => (
          <div
            key={index}
            className="flex items-center hover:bg-teal-500 ml-2 mr-2 rounded gap-1"
          >
            <li className="ml-1">{room.name}</li>
            <Icon
              icon="radix-icons:cross-2"
              className="cursor-pointer ml-auto mr-1"
            />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
