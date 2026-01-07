import React from "react";

const WorkCard = ({ img, name, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="
        group cursor-pointer
        rounded-2xl overflow-hidden
        transition-all duration-300
        dark:bg-white/5 bg-black/5
        border border-white/10 dark:border-black/10
        hover:border-transparent
        hover:scale-[1.02]
      "
    >
      {/* IMAGE */}
      <div className="relative h-52 tablet:h-60 laptop:h-64 overflow-hidden">
        <img
          src={img}
          alt={name}
          className="
            w-full h-full object-cover
            transition-transform duration-500 ease-out
            group-hover:scale-105
          "
        />

        {/* OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-black/40 dark:bg-white/10
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          "
        />
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h1
          className="
            text-xl font-semibold
            tracking-tight
            text-white dark:text-black
            transition-colors duration-300
          "
        >
          {name || "Project Name"}
        </h1>

        <p className="mt-2 text-sm leading-relaxed line-clamp-3
          text-white/70 dark:text-black/70"
        >
          {description || "Project description goes here"}
        </p>

        {/* CTA */}
        <span
          className="
            inline-block mt-4
            text-sm font-medium
            text-white/80 dark:text-black/80
            opacity-0 translate-y-1
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-300
          "
        >
          View Project →
        </span>
      </div>
    </div>
  );
};

export default WorkCard;
