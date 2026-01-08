import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cursor from "../components/Cursor";
import Header from "../components/Header";
import ProjectResume from "../components/ProjectResume";
import Socials from "../components/Socials";
import Button from "../components/Button";
import { useTheme } from "next-themes";

const Resume = ({ data }) => {
  const router = useRouter();
  const theme = useTheme();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
    if (data && !data.showResume) {
      router.push("/");
    }
  }, [data, router]);

  // Handle missing data
  if (!data) {
    // return <div>Loading...</div>;
  }

  const { name, showResume, resume } = data;
  return (
    <>
      {/* {process.env.NODE_ENV === "development" && ( */}
        <div className="fixed bottom-6 right-6">
          <button 
          onClick={() => router.push("/edit")}
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
  Edit Resume
</button>
        </div>
      {/* )} */}
      {data.showCursor && <Cursor />}
      <div
        className={`container mx-auto mb-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog />
        {mount && (
          <div className="mt-10 w-full flex flex-col items-center">
            <div
              className={`w-full bg-transparent  ${
                mount && theme.theme === "dark"
                ? "border-2 border-neutral-700"
                : "border border-neutral-300"
              
              } max-w-4xl p-20 mob:p-5 desktop:p-20 rounded-lg shadow-sm`}
            >
              <h1 className="text-3xl font-bold">{name}</h1>
              <h2 className="text-xl mt-5">{resume.tagline}</h2>
              <h2 className="w-4/5 text-xl mt-5 opacity-50">
                {resume.description}
              </h2>
              <div className="mt-2">
                <Socials />
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Experience</h1>

                {resume?.experiences?.map(
                  ({ id, dates, type, position, bullets }) => (
                    <ProjectResume
                      key={id}
                      dates={dates}
                      type={type}
                      position={position}
                      bullets={bullets}
                    ></ProjectResume>
                  )
                )}
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Education</h1>
                <div className="mt-2">
                  <h2 className="text-lg">{resume.education.universityName}</h2>
                  <h3 className="text-sm opacity-75">
                    {resume.education.universityDate}
                  </h3>
                  <p className="text-sm mt-2 opacity-50">
                    {resume.education.universityPara}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Skills</h1>
                <div className="flex mob:flex-col desktop:flex-row justify-between">
                  {resume.languages && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Languages</h2>
                      <ul className="list-disc">
                        {resume?.languages?.map((language, index) => (
                          <li key={index} className="ml-5 py-2">
                            {language}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.frameworks && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Frameworks</h2>
                      <ul className="list-disc">
                        {resume?.frameworks?.map((framework, index) => (
                          <li key={index} className="ml-5 py-2">
                            {framework}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.others && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Others</h2>
                      <ul className="list-disc">
                        {resume?.others?.map((other, index) => (
                          <li key={index} className="ml-5 py-2">
                            {other}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps({ req }) {
  try {
    const protocol = req.headers.host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${req.headers.host}`;

    const res = await fetch(`${baseUrl}/api/portfolio`);
    const data = await res.json();

    // Return data if it exists
    if (data) {
      return { props: { data } };
    }
  } catch (error) {
    console.error('Error fetching portfolio data:', error.message);
  }

  return { props: { data: null } };
}

export default Resume;
