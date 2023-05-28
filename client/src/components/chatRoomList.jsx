import { Icon } from "@iconify/react";

const ChatRoomList = (props) => {
  const { chatRooms } = props;

  return (
    <ul>
      {
        chatRooms.map((room, index) => (
          <div key={index} className="flex items-center hover:bg-teal-500 ml-2 mr-2 rounded gap-1">
            <li  className="ml-1">{room.name}</li>
            <Icon icon="radix-icons:cross-2" className="cursor-pointer ml-auto mr-1"/>
          </div>
        ))
      }
    </ul>
  )
}
export default ChatRoomList;