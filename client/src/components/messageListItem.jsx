const MessageListItem = ({children, author, ...props}) => {
  return (
    <div
      className="relative max-w-xl px-4 py-2 ml-2 text-gray-700 bg-gray-100 rounded shadow"
      {...props}
    >
      <strong>{author}</strong>
      <span className="block">{children}</span>
    </div>
  );
};

export default MessageListItem;
