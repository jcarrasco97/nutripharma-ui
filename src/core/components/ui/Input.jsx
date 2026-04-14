import React from "react";

const Input = ({
  label,
  icon: Icon,
  error,
  className = "",
  inputClassName = "",
  ...props
}) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="block text-[10px] font-black text-secondary/50 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        <input
          className={`
            w-full bg-[#f4f7f4] border border-gray-200 rounded-xl py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-secondary transition-all
            ${error ? "border-red-400 focus:ring-red-400" : ""}
            ${Icon ? "pl-11 pr-4" : "px-4"} 
            ${inputClassName}
          `}
          {...props}
        />
      </div>

      {error && (
        <span className="text-red-500 text-[10px] font-bold ml-1 uppercase tracking-widest">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
