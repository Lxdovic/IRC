import React from "react";

const SubmitInputSmall = (props) => {
  const { className } = props;

  return (
    <input
      className={`h-10 outline-0 hover:cursor-pointer focus:bg-teal-500 text-white text-center bg-teal-600 rounded-full w-1/2 ${className}`}
      type="submit"
    />
  );
};

export default SubmitInputSmall;
