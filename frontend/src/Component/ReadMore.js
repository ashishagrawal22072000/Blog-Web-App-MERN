import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { MdCreate } from "react-icons/md";
import { BsCalendar2DateFill } from "react-icons/bs";
import Comment from "./Comment";
export default function ReadMore() {
  const [blog, setblog] = useState({});

  const { id } = useParams();

  const currentBlog = async () => {
    try {
      const res = await fetch(`/blog/${id}`, {
        method: "GET",
        headers: {
          Accept: "appllication/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setblog(data);
      if (!res.status === 200) {
        const err = new Error(data.error);
        throw err;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    currentBlog();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container-fluid mt-5 p-5">
        <div className="row p-2">
          {/* <div className="d-flex justify-content-between">
            
            <p className="text-secondary">{blog.publishDate?.slice(0, 10)}</p>
          </div> */}
          <div className="col-md-12 shadow-lg">
            <img src={blog.imgurl} height="800px" width="100%" />
          </div>
          <div className="container d-flex justify-start my-3">
            <h5 className="text-secondary">
              <MdCreate /> {blog.publisher}
            </h5>
            <h5 className="text-secondary mx-5">
              <BsCalendar2DateFill /> {blog.publishDate?.slice(0, 10)}
            </h5>
          </div>
          <div className="container">
            <h1 style={{ fontFamily: "'Fjalla One', sans-serif" }}>
              {blog.title}
            </h1>
          </div>
        </div>
        <div className="row my-2">
          <div className="col-md-12">
            {/* <p className="fw-bold text-success">{blog.catagory}</p> */}
            {/* <p className="text-secondary">
              Author :{" "}
              <span className="text-danger fw-bold">{blog.publisher}</span>
            </p> */}

            <div>
              <span
                style={{
                  fontFamily: "'Alfa Slab One', cursive",
                  fontSize: "50px",
                }}
              >
                {blog.content?.charAt(0).toUpperCase()}
              </span>
              <span style={{ fontFamilt: "'Fredoka One', cursive;" }}>
                {blog.content?.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Comment data={blog} />
    </>
  );
}
