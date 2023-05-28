const CommandListItem = ({
  item: { label, params, description },
  isSelected,
}) => {
  const colorStyle = isSelected
    ? "bg-sky-500 text-black"
    : "bg-[#0D1117] text-gray-400";
  return (
    <div
      className={`${colorStyle} hover:bg-sky-500 hover:text-black flex cursor-pointer gap-2`}
    >
      <div className="font-bold min-w-max">{label}</div>
      {params && <div className="italic">{params}</div>}
      <div>{`: ${description}`}</div>
    </div>
  );
};

export default CommandListItem;
