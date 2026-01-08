import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { stagger } from "../../animations";
import Button from "../../components/Button";
import Cursor from "../../components/Cursor";
import Header from "../../components/Header";
import { ISOToDate, useIsomorphicLayoutEffect } from "../../utils";
const Blog = ({ posts: initialPosts, data }) => {
  const [posts, setPosts] = useState(initialPosts);
  const text = useRef();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (data && text.current) {
      try {
        stagger(
          [text.current],
          { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
          { y: 0, x: 0, transform: "scale(1)" }
        );
        if (data.showBlog) {
          stagger([text.current], { y: 30 }, { y: 0 });
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Animation error:", error);
      }
    } else if (data && !data.showBlog) {
      router.push("/");
    }
  }, [router, data]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const refreshPosts = () => {
    fetch("/api/blog/posts")
      .then(res => res.json())
      .then(data => {
        if (data.posts) {
          setPosts(data.posts);
        }
      })
      .catch(error => console.error("Error fetching posts:", error));
  };

  const createBlog = () => {
    fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      refreshPosts();
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
      refreshPosts();
    }).catch((error) => {
      console.error("Error deleting blog:", error);
    });
  };

  if (!data) {
    // return <div>Loading...</div>;
  }

  return (
    data.showBlog && (
      <>
        {data.showCursor && <Cursor />}
        <Head>
          <title className="section-tittle">Blog</title>
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
              className="section-title mb-6 mx-auto mob:p-2 text-bold text-6xl laptop:text-8xl w-full"
            >
              Blog
            </h1>
            <div className="mt-10 grid grid-cols-1 mob:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 justify-between gap-10">
              {posts &&
                posts?.map((post) => (
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
                          type="primary"
                          classes=""
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

    // Return data if it exists
    if (data) {
      return {
        props: {
          posts: postsData.posts || [],
          data,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

  return {
    props: {
      posts: [],
      data: null,
    },
  };
}

export default Blog;
