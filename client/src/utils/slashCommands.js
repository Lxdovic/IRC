import { updateUser } from "../api/user.jsx";
import {
  createRoom,
  deleteRoomByName,
  getAllRooms,
  getRoomByName,
  joinRoomByName,
  leaveRoom,
} from "../api/chat.jsx";
import { toast } from "react-toastify";

export const slashCommands = [
  {
    label: "/nick",
    params: "nickname",
    description: "define the nickname of the user on the server",
    action: async (props) => {
      const username = props.args.at(1);
      if (username) return await updateUser({ username });
    },
  },
  {
    label: "/list",
    params: "string",
    description:
      "list the available channels from the server. If string is specified, only displays those whose name contains the string",
    action: async (props) => {
      const searchName = props.args.at(1);
      let response;

      if (searchName) response = await getRoomByName(searchName);
      else response = await getAllRooms();

      if (response.status === 200) {
        const roomNames = response.data.rooms.map((room) => room.name);
        toast(
          "Here's the available rooms on the server: " + roomNames.join(", "),
          { autoClose: 5000 }
        );
      }

      return response;
    },
  },
  {
    label: "/create",
    params: "channel",
    description: "create a channel with the specified name.",
    action: async (props) => {
      const channelName = props.args.at(1);
      if (channelName)
        return await createRoom({ users: [], name: channelName });
    },
  },
  {
    label: "/delete",
    params: "channel",
    description: "delete the channel with the specified name",
    action: async (props) => {
      const channelName = props.args.at(1);
      if (channelName) return await deleteRoomByName(channelName);
    },
  },
  {
    label: "/join",
    params: "channel",
    description: "join the specified channel.",
    action: async (props) => {
      const roomName = props.args.at(1);
      if (roomName) return await joinRoomByName(roomName);
    },
  },
  {
    label: "/leave",
    description: "leave the current channel.",
    action: async (props) => {
      const roomId = props.currentRoom._id;
      if (roomId) return await leaveRoom(roomId);
    },
  },
  {
    label: "/quit",
    params: "channel",
    description: "quit the specified channel.",
    action: async (props) => {
      const roomName = props.args.at(1);
      const { _id } = props.roomList.find((room) => room.name === roomName);
      if (_id) return await leaveRoom(_id);
    },
  },
  {
    label: "/users",
    description: "list the users currently in the channel",
    action: async (props) => {
      const usersId = props.currentRoom.users;
      let roomUsers = props.users
        .filter((user) => usersId.includes(user._id))
        .map((user) => user.username);

      roomUsers = [...new Set(roomUsers)];
      toast("The users in this room are: " + roomUsers.join(", "));
    },
  },
  {
    label: "/msg",
    params: "nickname message",
    description: "send a private the message to the specified nickname.",
    action: async (props) => {
      const recipient = props.users.find(
        (user) => user.username === props.args.at(1)
      );
      const messageContent = props.args.slice(2).join(" ");

      if (!recipient || !messageContent) {
        toast.error("Please specify a recipient and a message.");
        return;
      }

      let privateRoom = props.roomList.find(
        (room) =>
          room.isPrivate &&
          room.users.includes(recipient._id) &&
          room.users.includes(props.currentUser._id)
      );

      if (!privateRoom) {
        const res = await createRoom({
          users: [recipient._id],
          name: recipient.username,
        });
        privateRoom = res.data.room;
      }

      props.socket.emit("message", {
        content: messageContent,
        destination: privateRoom._id,
      });
    },
  },
];

export const commandSender = async ({
  message,
  currentRoom,
  roomList,
  currentUser,
  users,
  socket,
}) => {
  const args = message.split(" ");
  const cmd = slashCommands.find((command) => command.label === args.at(0));
  try {
    const response = await cmd.action({
      args,
      currentRoom,
      roomList,
      currentUser,
      users,
      socket,
    });

    toast(response.data.message);
  } catch (err) {
    toast.error(err?.response?.data?.message);
  }
};
