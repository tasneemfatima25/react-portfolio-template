import React from "react";

const ServiceCard = ({ name, description }) => {
  return (
    <div
    className="
      w-full
      p-4
      rounded-xl
      transition-all duration-300 ease-out
      bg-transparent
      border
      border-white/10 dark:border-black/10
      hover:border-white/30 dark:hover:border-black/30
      hover:bg-white/5 dark:hover:bg-black/5
    "
  >
    <h1 className="text-2xl laptop:text-3xl font-semibold text-white dark:text-black">
      {name || "Heading"}
    </h1>
  
    <p className="mt-4 text-base laptop:text-lg leading-relaxed text-white/70 dark:text-black/70">
      {description ||
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
    </p>
  </div>
  
  );
};

export default ServiceCard;
