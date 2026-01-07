import React from "react";
import Socials from "../Socials";
import Link from "next/link";
import Button from "../Button";

const Footer = ({}) => {
  return (
    <>
      <div className="mt-16 laptop:mt-40 laptop:p-0">
        <div>
          <h1 className="text-2xl text-bold section-title">Contact </h1>
          <div className="mt-10">
          <h2 className="mt-20 text-4xl tablet:text-6xl laptop:text-7xl font-extrabold leading-tight">
          Let’s work <br />
          together
        </h2>
        <Button
  onClick={() => (window.location.href = "tel:8858645338")}
  classes="
    px-8 py-3
    text-base font-medium
    border dark:border-black
    dark:text-black text-white
    bg-transparent
    hover:bg-black hover:text-white
    dark:hover:bg-white dark:hover:text-black
    transition-all duration-300
  "
>
  Schedule a call
</Button>

            <div className="mt-10">
              <Socials />
            </div>
            <div className="mt-20 text-lg text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} • All rights reserved
        </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
