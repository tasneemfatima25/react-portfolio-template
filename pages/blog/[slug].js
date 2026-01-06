import React, { useRef, useState } from "react";
import Header from "../../components/Header";
import ContentSection from "../../components/ContentSection";
import Footer from "../../components/Footer";
import Head from "next/head";
import { useIsomorphicLayoutEffect } from "../../utils";
import { stagger } from "../../animations";
import Button from "../../components/Button";
import BlogEditor from "../../components/BlogEditor";
import { useRouter } from "next/router";
import Cursor from "../../components/Cursor";

const BlogPost = ({ post, data }) => {
  const [showEditor, setShowEditor] = useState(false);
  const textOne = useRef();
  const textTwo = useRef();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    if (textOne.current && textTwo.current) {
      try {
        stagger([textOne.current, textTwo.current], { y: 30 }, { y: 0 });
      } catch (error) {
        console.error("Animation error:", error);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>{"Blog - " + post.title}</title>
        <meta name="description" content={post.preview} />
      </Head>
      {data.showCursor && <Cursor />}

      <div
        className={`container mx-auto mt-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog={true} />
        <div className="mt-10 flex flex-col">
          <img
            className="w-full h-96 rounded-lg shadow-lg object-cover"
            src={post.image}
            alt={post.title}
          ></img>
          <h1
            ref={textOne}
            className="mt-10 text-4xl mob:text-2xl laptop:text-6xl text-bold"
          >
            {post.title}
          </h1>
          <h2
            ref={textTwo}
            className="mt-2 text-xl max-w-4xl text-darkgray opacity-50"
          >
            {post.tagline}
          </h2>
        </div>
        <ContentSection content={post.content}></ContentSection>
        <Footer />
      </div>
      {/* {process.env.NODE_ENV === "development" && ( */}
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => setShowEditor(true)} type={"primary"}>
            Edit this blog
          </Button>
        </div>
      {/* )} */}

      {showEditor && (
        <BlogEditor
          post={post}
          close={() => setShowEditor(false)}
          refresh={() => router.reload(window.location.pathname)}
        />
      )}
    </>
  );
};

export async function getServerSideProps({ params, req }) {
  try {
    const protocol = req.headers.host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${req.headers.host}`;

    // Fetch portfolio data and blog posts from database
    const [portfolioRes, postsRes] = await Promise.all([
      fetch(`${baseUrl}/api/portfolio`),
      fetch(`${baseUrl}/api/blog/posts`)
    ]);

    const data = await portfolioRes.json();
    const postsData = await postsRes.json();

    // Find the specific post by slug
    const post = postsData.posts?.find(p => p.slug === params.slug);

    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post,
        data: data || {},
      },
    };
  } catch (error) {
    console.error('Error fetching blog post:', error.message);
    return {
      notFound: true,
    };
  }
}
export default BlogPost;
