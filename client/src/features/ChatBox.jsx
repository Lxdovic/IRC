import {useState, useEffect, useRef} from "react";
import {
  SubmitButton,
  TextInputFull,
} from "../components/inputs/index.jsx";
import MessageListItem from "../components/messageListItem.jsx";
import {Icon} from "@iconify/react";
import {useSelector} from "react-redux";

const ChatBox = (props) => {
  const user = useSelector((state) => state.user);
  const {onMessage, sendMessage} = props;

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const handleMessageInput = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message.length <= 0 || !user.username) return;

    const newList = messageList.concat(message);

    sendMessage(message);
    setMessageList(newList);
    setMessage("");
  };

  return (
    <div className="relative flex flex-col w-[calc(100vw-13rem)]">
      <ul id="messages">
        {messageList.map((item, index) => (
          <li key={index} className="flex justify-start mt-2">
            <MessageListItem author={user.username}>{item}</MessageListItem>
          </li>
        ))}
      </ul>
      <div className="inset-x-0 mt-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-row gap-2 mb-2 w-full">
          <TextInputFull
            type="text"
            placeholder="Send a message..."
            value={message}
            onChange={handleMessageInput}
            maxLength="500"
            className="ml-2 w-full"
          />
          <SubmitButton className="ml-auto mr-2 w-10">
            <Icon icon="mdi:send"/>
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
