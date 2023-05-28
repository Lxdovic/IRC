import React from "react";

const TextInput = ({ onChange, placeholder, value, type, className, ...props}) => {

  return (
    <input
      className={`h-10 bg-white outline-0 focus:bg-teal-100 rounded-full border-gray-400 border indent-4 w-3/4 ${className}`}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};

export default TextInput;
