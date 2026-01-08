import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";

export default function Home({ data: initialData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();

  useEffect(() => {
    const refreshData = () => {
      fetch("/api/portfolio")
        .then((res) => res.json())
        .then((newData) => {
          if (newData && Object.keys(newData).length > 1) {
            setData(newData);
          }
        })
        .catch(() => {});
    };

    router.events.on("routeChangeComplete", refreshData);
    window.addEventListener("focus", refreshData);

    return () => {
      router.events.off("routeChangeComplete", refreshData);
      window.removeEventListener("focus", refreshData);
    };
  }, [router]);

  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    if (
      textOne.current &&
      textTwo.current &&
      textThree.current &&
      textFour.current
    ) {
      stagger(
        [
          textOne.current,
          textTwo.current,
          textThree.current,
          textFour.current,
        ],
        { y: 40, x: -10, transform: "scale(0.95)" },
        { y: 0, x: 0, transform: "scale(1)" }
      );
    }
  }, []);

  if (!data) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}

      <Head>
        <title>{data.name}</title>
      </Head>

      <div className="gradient-circle" />
      <div className="gradient-circle-bottom" />

      <div className="container mx-auto px-4 mb-20">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />

        {/* ---------------- HERO ---------------- */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center">
  <div className="space-y-2 tablet:space-y-3 laptop:space-y-4 max-w-4xl">

    {/* MAIN HIGHLIGHT */}
    <h1
      ref={textOne}
      className="
        block
        text-4xl tablet:text-6xl laptop:text-7xl
        font-extrabold
        leading-[1.05]
        tracking-tight
        dark:text-black text-white
      "
    >
      {data.headerTaglineOne}
    </h1>

    {/* SUPPORTING TEXT */}
    <h2
      ref={textTwo}
      className="
        text-3xl tablet:text-5xl laptop:text-6xl
        font-semibold leading-snug
        dark:text-black/90 text-white/90
      "
    >
      {data.headerTaglineTwo}
    </h2>

    <h3
      ref={textThree}
      className="
        text-2xl tablet:text-4xl laptop:text-5xl
        font-medium leading-snug
        dark:text-black/70 text-white/70
      "
    >
      {data.headerTaglineThree}
    </h3>

    <p
      ref={textFour}
      className="
        text-lg tablet:text-2xl laptop:text-3xl
        font-normal leading-relaxed
        dark:text-black/60 text-white/60
      "
    >
      {data.headerTaglineFour}
    </p>
  </div>

  {/* SOCIALS */}
  <div className="mt-10">
    <Socials
      className="
        flex justify-center gap-6
        text-black/70 dark:text-white/70
        hover:text-black dark:hover:text-white
        transition
      "
    />
  </div>
</section>





        {/* ---------------- WORK ---------------- */}
        <section ref={workRef} className="mt-32">
          <h2 className="section-title">Work</h2>

          <div className="mt-8 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-10">
            {data.projects.map((project) => (
              <div key={project.id} className="glass hover-lift">
                <WorkCard
                  img={project.imageSrc}
                  name={project.title}
                  description={project.description}
                  onClick={() => window.open(project.url)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- SERVICES ---------------- */}
        <section className="mt-32">
          <h2 className="section-title">Services</h2>

          <div className="mt-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
            {data.services.map((service, index) => (
              <div key={index} className="glass hover-lift">
                <ServiceCard
                  name={service.title}
                  description={service.description}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- ABOUT ---------------- */}
        <section ref={aboutRef} className="mt-32">
  <h2 className="section-title">About</h2>

  <p
    className="
      mt-6
      text-lg laptop:text-2xl
      leading-relaxed
      dark:text-black/80 text-white/80
      w-full laptop:w-3/5
    "
  >
    {data.aboutpara}
  </p>
</section>


        {/* ---------------- EDIT BUTTON ---------------- */}
        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/edit">
          <button
  className="
    px-6 py-3 rounded-xl font-semibold
    transition-all duration-300 ease-out
    backdrop-blur-md

    /* Light mode → Dark button */
    dark:bg-black/90 dark:text-white
    dark:hover:bg-black dark:hover:scale-[1.03]

    /* Dark mode → Light button */
    bg-white/90 text-black
    hover:bg-white hover:scale-[1.03]

    shadow-lg hover:shadow-2xl
    active:scale-95
  "
>
  Edit Data
</button>


          </Link>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  try {
    const protocol = req.headers.host.includes("localhost")
      ? "http"
      : "https";
    const baseUrl = `${protocol}://${req.headers.host}`;

    const res = await fetch(`${baseUrl}/api/portfolio`);
    const data = await res.json();

    // Return data if it exists (even empty object)
    if (data) {
      return { props: { data } };
    }
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
  }

  return { props: { data: null } };
}
