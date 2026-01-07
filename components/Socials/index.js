import React from "react";
import Button from "../Button";
import yourData from "../../data/portfolio.json";

const Socials = ({ className }) => {
  return (
    <div className={`${className} flex flex-wrap mob:flex-nowrap`}>
      {yourData.socials.map((social, index) => (
       <Button
       key={index}
       onClick={() => window.open(social.link)}
       classes="
         text-white
         hover:text-white
         border border-white/30
         hover:bg-white/10
         hover:border-white/60
     
         dark:text-black
         dark:border-black/30
         dark:hover:bg-black/10
         dark:hover:border-black/60
       "
     >
     
          {social.title}
        </Button>
      ))}
    </div>
  );
};

export default Socials;
