import React from "react";

const SubmitButton = (props) => {
  const {className, children} = props;

  return (
    <button
      className={`flex justify-center items-center h-10 outline-0 hover:cursor-pointer focus:bg-teal-500 text-white text-center bg-teal-600 rounded-full ${className}`}
      type="submit">
      {children}
    </button>
  );
};

export default SubmitButton;
