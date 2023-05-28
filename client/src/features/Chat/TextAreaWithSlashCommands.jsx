import { useState, useEffect } from "react";
import { matchSorter } from "match-sorter";
import { Icon } from "@iconify/react";

import { slashCommands, commandSender } from "../../utils/slashCommands.js";
import CommandMenu from "./CommandMenu.jsx";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

import { parseEmote } from "../../utils/emotes";
import parseHTML from "html-react-parser";
import { useSelector } from "react-redux";

const TextAreaWithSlashCommands = ({
 message,
 setMessage,
 handleSendMessage,
 currentRoom,
 roomList,
 socket,
}) => {
  const [isCommand, setIsCommand] = useState(false);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandSuggestions, setCommandSuggestions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioRecord, setAudioRecord] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [filePreview, setFilePreview] = useState();
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const recorderControls = useAudioRecorder();
  const currentUser = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      if (isCommand) {
        commandSender({
          message,
          currentRoom,
          roomList,
          currentUser,
          users,
          socket,
        }).then();
      } else handleSendMessage(e, [selectedFile, audioRecord]);
      setMessage("");
      setSelectedFile(null);
      setFilePreview(null);
      setAudioRecord(undefined);
      setAudioURL(undefined);
    }
  };

  const handleKeyUp = (event) => {
    if (message.charAt(0) === "/") {
      setIsCommand(true);
      setCommandSuggestions(
        matchSorter(slashCommands, event.target.value, { keys: ["label"] })
      );
      setShowCommandMenu(true);
      return;
    }

    setIsCommand(false);
    setShowCommandMenu(false);
  };

  const handleMessagesAndCommands = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    if (!selectedFile) {
      setFilePreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setFilePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!audioRecord) {
      return;
    }

    const objectUrl = URL.createObjectURL(audioRecord);

    setAudioURL(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [audioRecord]);

  return (
    <div className="w-full flex flex-col gap-2">
      <CommandMenu
        message={message}
        setMessage={setMessage}
        commandSuggestions={commandSuggestions}
        selectedSuggestionIndex={selectedSuggestionIndex}
        setSelectedSuggestionIndex={setSelectedSuggestionIndex}
        showCommandMenu={showCommandMenu}
      />
      {selectedFile && (
        <div className="relative flex rounded h-60 w-max">
          <img className="self-center rounded h-full" src={filePreview} />
          <Icon
            onClick={() => {
              setFilePreview(undefined);
              setSelectedFile(undefined);
            }}
            height={24}
            width={24}
            icon="mdi:delete"
            className="absolute top-2 right-2 bg-[#30363D] rounded p-1 cursor-pointer hover:bg-[#20222D]"
            color="rgb(244 63 94)"
          />
        </div>
      )}

      {audioRecord && (
        <div className="relative flex rounded w-max">
          <audio
            controlsList="nodownload"
            className="recorded-audio"
            controls={true}
            src={audioURL}
          />
          <Icon
            onClick={() => {
              setAudioRecord(undefined);
              setAudioURL(undefined);
            }}
            height={26}
            width={26}
            icon="mdi:delete"
            className="absolute top-1/2 -translate-y-1/2 right-5 p-1 cursor-pointer hover:bg-[#20222D]"
            color="rgb(244 63 94)"
          />
        </div>
      )}

      <div className="w-full flex p-2 bg-[#161B22]">
        <textarea
          value={parseHTML(parseEmote(message))}
          onChange={handleMessagesAndCommands}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          className="bg-[#161B22] w-full max-h-64 h-max text-gray-400 placeholder:text-gray-500 rounded resize-none outline-none"
          placeholder="Send a message or type a / command..."
        />
        <label
          htmlFor="chatImageUpload"
          className="flex w-12 cursor-pointer rounded justify-center hover:bg-[#20222D]"
        >
          <Icon
            color="777"
            className="self-center"
            width={24}
            icon="bxs:image-add"
          />
        </label>

        <div className="display-none">
          <AudioRecorder
            onRecordingComplete={(blob) => setAudioRecord(blob)}
            recorderControls={recorderControls}
          />
        </div>
        {!recorderControls.isRecording && (
          <div
            onClick={recorderControls.startRecording}
            className="flex w-12 cursor-pointer rounded justify-center hover:bg-[#20222D]"
          >
            <Icon
              className="self-center"
              width={24}
              color="777"
              icon="ic:outline-mic"
            />
          </div>
        )}
        {recorderControls.isRecording && (
          <div
            onClick={recorderControls.stopRecording}
            className="flex w-12 cursor-pointer rounded justify-center hover:bg-[#20222D]"
          >
            <Icon
              className="self-center"
              width={24}
              color="rgb(244 63 94)"
              icon="mdi:stop"
            />
          </div>
        )}
        {recorderControls.isRecording && (
          <>
            {recorderControls.isPaused ? (
              <div
                onClick={recorderControls.togglePauseResume}
                className="flex w-12 cursor-pointer rounded justify-center hover:bg-[#20222D]"
              >
                <Icon
                  className="self-center"
                  width={24}
                  color="777"
                  icon="mdi:play"
                />
              </div>
            ) : (
              <div
                onClick={recorderControls.togglePauseResume}
                className="flex w-12 cursor-pointer rounded justify-center hover:bg-[#20222D]"
              >
                <Icon
                  className="self-center"
                  width={24}
                  color="777"
                  icon="mdi:pause"
                />
              </div>
            )}
          </>
        )}
      </div>
      <input
        className="hidden"
        type="file"
        onClick={(event) => {
          event.target.value = null;
        }}
        onChange={(e) => {
          setSelectedFile(e.target.files[0]);
        }}
        accept="image/png, image/gif, image/jpeg, image/jpg"
        id="chatImageUpload"
      />
    </div>
  );
};

export default TextAreaWithSlashCommands;
