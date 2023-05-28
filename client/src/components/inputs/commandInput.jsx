import React from "react";
import Select from "react-select";

const CommandInput = ({...props}) => {

  return (
    <Select
      {...props}
      options={options}
    />
  );
};

export default CommandInput;

const options = [
  {value: "/nick", label: "/nick", description: "nickname: define the nickname of the user on the server"},
  {
    value: "/list",
    label: "/list",
    description: "[string]: list the available channels from the server. If string is specified, only displays those whose\n" +
      "name contains the string"
  },
  {value: "/create", label: "/create", params: "channel", description: "create a channel with the specified name."},
  {value: "/delete", label: "/delete", params: "channel", description: "delete the channel with the specified name"},
  {value: "/join", label: "/join", params: "channel", description: "join the specified channel."},
  {value: "/quit", label: "/quit", params: "channel", description: "quit the specified channel."},
  {value: "/users", label: "/users", description: "list the users currently in the channel"},
  {value: "/msg", label: "/msg", params: "nickname message",description: "send a private the message to the specified nickname."}
];