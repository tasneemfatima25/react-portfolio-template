import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { stagger } from "../../animations";
import Button from "../../components/Button";
import Cursor from "../../components/Cursor";
import Header from "../../components/Header";
import { ISOToDate, useIsomorphicLayoutEffect } from "../../utils";
import { getAllPosts } from "../../utils/api";
const Blog = ({ posts, data }) => {
  const text = useRef();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const showBlog = useRef(data?.showBlog);

  useIsomorphicLayoutEffect(() => {
    if (text.current) {
      stagger(
        [text.current],
        { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
        { y: 0, x: 0, transform: "scale(1)" }
      );
      if (showBlog.current) stagger([text.current], { y: 30 }, { y: 0 });
      else router.push("/");
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle missing data
  if (!data) {
    return <div>Loading...</div>;
  }

  const createBlog = () => {
    fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      router.reload(window.location.pathname);
    }).catch((error) => {
      console.error("Error creating blog:", error);
    });
  };

  const deleteBlog = (slug) => {
    fetch("/api/blog", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug,
      }),
    }).then(() => {
      router.reload(window.location.pathname);
    }).catch((error) => {
      console.error("Error deleting blog:", error);
    });
  };
  return (
    showBlog.current && (
      <>
        {data.showCursor && <Cursor />}
        <Head>
          <title>Blog</title>
        </Head>
        <div
          className={`container mx-auto mb-10 ${
            data.showCursor && "cursor-none"
          }`}
        >
          <Header isBlog={true}></Header>
          <div className="mt-10">
            <h1
              ref={text}
              className="mx-auto mob:p-2 text-bold text-6xl laptop:text-8xl w-full"
            >
              Blog.
            </h1>
            <div className="mt-10 grid grid-cols-1 mob:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 justify-between gap-10">
              {posts &&
                posts.map((post) => (
                  <div
                    className="cursor-pointer relative"
                    key={post.slug}
                    onClick={() => Router.push(`/blog/${post.slug}`)}
                  >
                    <img
                      className="w-full h-60 rounded-lg shadow-lg object-cover"
                      src={post.image}
                      alt={post.title}
                    ></img>
                    <h2 className="mt-5 text-4xl">{post.title}</h2>
                    <p className="mt-2 opacity-50 text-lg">{post.preview}</p>
                    <span className="text-sm mt-5 opacity-25">
                      {ISOToDate(post.date)}
                    </span>
                    {mounted && (
                      <div className="absolute top-0 right-0">
                        <Button
                          onClick={(e) => {
                            deleteBlog(post.slug);
                            e.stopPropagation();
                          }}
                          type={"primary"}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {mounted && (
          <div className="fixed bottom-6 right-6">
            <Button onClick={createBlog} type={"primary"}>
              Add New Post +{" "}
            </Button>
          </div>
        )}
      </>
    )
  );
};

export async function getServerSideProps({ req }) {
  const posts = getAllPosts([
    "slug",
    "title",
    "image",
    "preview",
    "author",
    "date",
  ]);

  try {
    const protocol = req.headers.host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${req.headers.host}`;

    const res = await fetch(`${baseUrl}/api/portfolio`);
    const data = await res.json();

    if (data && Object.keys(data).length > 1) {
      return {
        props: {
          posts: [...posts],
          data,
        },
      };
    }
  } catch (error) {
    console.log('Using default data:', error.message);
  }

  const defaultData = await import('../../data/portfolio.json');
  return {
    props: {
      posts: [...posts],
      data: defaultData.default,
    },
  };
}

export default Blog;
