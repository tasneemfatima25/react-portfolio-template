import React from "react";
import { useTheme } from "next-themes";
import data from "../../data/portfolio.json";

const Button = ({ children, type, onClick, classes = "" }) => {
  const { theme } = useTheme();

  /* ---------------- PRIMARY BUTTON ---------------- */
  if (type === "primary") {
    return (
      <button
        onClick={onClick}
        type="button"
        className={`
          text-sm tablet:text-base
          px-3 py-2 m-1 laptop:m-2
          rounded-lg font-medium
          transition-all duration-300 ease-out
          hover:scale-105 active:scale-100
          ${theme === "dark" ? "bg-black text-white" : "bg-white text-balck"}
          ${data.showCursor ? "cursor-none" : ""}
          ${classes}
        `}
      >
        {children}
      </button>
    );
  }

  /* ---------------- SECONDARY BUTTON ---------------- */
  return (
    <button
      onClick={onClick}
      type="button"
      className={`
        text-sm tablet:text-base
        px-3 py-2 m-1 laptop:m-2
        rounded-lg font-medium
        flex items-center
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-100

        ${
          theme === "dark"
            ? "bg-transparent text-black hover:bg-black hover:text-white"
            : "bg-transparent text-white hover:bg-slate-100 hover:text-black"
        }

        ${data.showCursor ? "cursor-none" : ""}
        ${classes}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
