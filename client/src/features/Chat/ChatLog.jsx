const ChatLog = ({ log }) => {
  return (
    <div className="flex flex-col hover:bg-[#0D1117] p-4 rounded">
      <div className="text-gray-400 flex gap-2 text-sm font-regular">
        <span>{log.action}</span>
        <span>{new Date(log.date).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ChatLog;
