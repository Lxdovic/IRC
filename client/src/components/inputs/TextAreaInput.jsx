import React from "react";

const TextAreaInput = ({ onChange, placeholder, value, className, ...props}) => {

  return (
    <textarea
      className={`h-10 bg-white outline-0 focus:bg-teal-100 rounded-full border-gray-400 border indent-4 ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};

export default TextAreaInput;
