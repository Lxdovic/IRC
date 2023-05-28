import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { getUser, searchUser } from "../api/user";
import { createRoom, getRooms } from "../api/chat";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { whoami } from "../api/user";

import ChatLayout from "../layouts/ChatLayout";

const Chat = () => {
  const socket = io("http://localhost:3000", {
    auth: {
      accessToken: localStorage.getItem("accessToken"),
      accessTokenGuest: sessionStorage.getItem("accessToken"),
    },
  });
  /**
   *  USE STATES
   */
  const [message, setMessage] = useState("");
  const [userSearchUsername, setUserSearchUsername] = useState("");
  const [userSearchResult, setUserSearchResult] = useState([]);
  const [createRoomUsers, setCreateRoomUsers] = useState([]);
  const [createRoomName, setCreateRoomName] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [room, setRoom] = useState("");

  /**
   *  OTHER HOOKS
   */
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchUser = async (e) => {
    setUserSearchUsername(e.target.value);

    if (e.target.value.length < 1) return setUserSearchResult([]);

    try {
      const result = await searchUser(e.target.value);

      setUserSearchResult(result.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    try {
      const result = await createRoom({
        users: createRoomUsers.map((user) => user._id),
        name: createRoomName,
      });

      setRoomList([...roomList, result.data.room]);

      result.data.room.users.map(async (user) => {
        let result = await getUser(user);

        dispatch({ type: "ADD_USER", user: result.data.user });
      });

      setRoom(result.data.room._id);
      setCreateRoomUsers([]);
      setUserSearchResult([]);
      setCreateRoomName("");
      setUserSearchUsername("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = (e, attachments) => {
    e.preventDefault();

    sendMessage(message, attachments);
  };

  const sendMessage = (message, attachments) => {
    if (attachments.length == 0) {
      return socket.emit("message", { content: message, destination: room });
    }

    socket.emit("message", {
      content: message,
      destination: room,
      attachments: attachments
        .filter((attachment) => {
          return attachment != undefined;
        })
        .map((attachment) => {
          return { type: attachment?.type, data: attachment };
        }),
    });
  };

  const handleChangeRoom = (e, newRoom) => {
    e.stopPropagation();

    setRoom(newRoom._id);
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await getRooms();

        setRoomList(result.data.rooms);

        result.data.rooms.map((room) =>
          room.users.map(async (user) => {
            const result = await getUser(user);

            dispatch({ type: "ADD_USER", user: result.data.user });
          })
        );

        setCreateRoomUsers([]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {}, [userSearchResult, roomList, room, user]);

  useEffect(() => {
    (async () => {
      try {
        const profile = await whoami();

        dispatch({ type: "SET_USER", user: profile.data.user });
      } catch (error) {
        navigate("/");
      }
    })();

    console.log("user", user);

    socket.on("room_update", async () => {
      const result = await getRooms();

      setRoomList(result.data.rooms);

      result.data.rooms.map((room) =>
        room.users.map(async (user) => {
          const result = await getUser(user);

          dispatch({ type: "ADD_USER", user: result.data.user });
        })
      );

      setCreateRoomUsers([]);
    });

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("user_update", (data) => {
      console.log(data.user._id, user._id);

      if (data.user._id == user._id) {
        console.log("user update");
        dispatch({ type: "SET_USER", user: data.user });
      }

      dispatch({ type: "ADD_USER", user: data.user });
    });

    socket.on("room_log", (data) => {
      setRoomList((prev) => {
        const newRoomList = prev.map((prevRoom) => {
          if (prevRoom._id === data.room) {
            const newRoom = {
              ...prevRoom,
              logs: [...prevRoom.logs, data.log],
            };

            return newRoom;
          }

          return prevRoom;
        });

        return newRoomList;
      });
    });

    socket.on("message", (data) => {
      setRoomList((prev) => {
        const newRoomList = prev.map((prevRoom) => {
          if (prevRoom._id === data.destination) {
            const newRoom = {
              ...prevRoom,
              messages: [...prevRoom.messages, data],
            };

            return newRoom;
          }

          return prevRoom;
        });

        return newRoomList;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      socket.off("user_update");
      socket.off("room_update");
      socket.off("room_log");
    };
  }, []);

  return (
    <ChatLayout
      handleSearchUser={handleSearchUser}
      handleSendMessage={handleSendMessage}
      handleChangeRoom={handleChangeRoom}
      handleCreateRoom={handleCreateRoom}
      userSearchUsername={userSearchUsername}
      userSearchResult={userSearchResult}
      setUserSearchResult={setUserSearchResult}
      createRoomUsers={createRoomUsers}
      setCreateRoomUsers={setCreateRoomUsers}
      createRoomName={createRoomName}
      setCreateRoomName={setCreateRoomName}
      roomList={roomList}
      setRoomList={setRoomList}
      room={room}
      message={message}
      setMessage={setMessage}
      socket={socket}
    />
  );
};

export default Chat;
