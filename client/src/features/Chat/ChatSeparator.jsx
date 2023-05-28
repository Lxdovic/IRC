const ChatSeparator = ({ date }) => {
  return (
    <div className="flex justify-center my-2">
      <hr className="border-[#1E2329] w-full self-center" />
      <div className="flex justify-center px-2 h-6 w-[25rem]">
        <div
          // Dont mind the weird stuff happening here it's just a triangle
          style={{
            borderTop: "11px solid transparent",
            borderBottom: "11px solid transparent",
            borderRight: "10px solid #1E2329",
          }}
        ></div>
        <span className="text-gray-400 bg-[#1E2329] h-full text-sm font-regular text-center">
          {new Date(date).toDateString()}
        </span>
        <div
          // Same here
          style={{
            borderTop: "11px solid transparent",
            borderBottom: "11px solid transparent",
            borderLeft: "10px solid #1E2329",
          }}
        ></div>
      </div>
      <hr className="border-[#1E2329] w-full self-center" />
    </div>
  );
};

export default ChatSeparator;
