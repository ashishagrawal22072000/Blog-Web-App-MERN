import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OptionCatagory from "./OptionCatagory";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
export default function CreateBlog() {
  const [activeuser, setactiveuser] = useState();
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const date = new Date();

  const [contentlength, setcontentlength] = useState(0);
  const [blog, setblog] = useState({
    title: "",
    content: "",
    catagory: "",
    imgurl: "",
  });
  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "m5nzhuoo");
    axios
      .post("http://api.cloudinary.com/v1_1/cldashish12/image/upload", formData)
      .then((res) => {
        setblog({ ...blog, imgurl: res.data.url });
        setDisable(false);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const calldata = async () => {
    try {
      const res = await fetch("/user", {
        method: "GET",
        headers: {
          Accept: "appllication/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setactiveuser(data);
      if (!data.status === 200) {
        const err = new Error(data.error);
        throw err;
      }
    } catch (err) {
      console.log(err);
      navigate("/login", { replace: true });
    }
  };

  const publish = async (e) => {
    e.preventDefault();

    const { title, content, catagory, imgurl } = blog;
    const res = await fetch("/blog/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid: activeuser._id,
        publisher: activeuser.username,
        date: date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear(),
        title,
        content,
        catagory,
        imgurl,
      }),
    });

    const data = await res.json();
    if (res.status === 200) {
      toast.success(data.message);
      setcontentlength(0);
      setblog({
        title: "",
        content: "",
        catagory: "",
        imgurl: "",
      });
    } else {
      toast.error(data.error[0].msg);
    }
  };

  const file = () => {
    setDisable(true);
    setLoading(true);
  };

  useEffect(() => {
    calldata();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container-fluid p-5">
        <section className="mb-4">
          <h2 className="h1-responsive font-weight-bold text-center my-2">
            Create A Blog
          </h2>

          <div className="row p-5">
            <div className="col-md-12 mb-md-0 mb-5">
              <form id="contact-form" name="contact-form" method="POST">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between">
                    <div className="md-form mb-5">
                      <label htmlFor="name">
                        <h1>Title</h1>{" "}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control border-bottom border-3 rounded-0"
                        style={{
                          width: "500px",
                          backgroundColor: "transparent",
                          outline: "none",
                          border: 0,
                        }}
                        value={blog.title}
                        onChange={(e) =>
                          setblog({ ...blog, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="md-form mb-5">
                      <select
                        className="p-3 bg-dark text-light fw-bold"
                        onChange={(e) =>
                          setblog({ ...blog, catagory: e.target.value })
                        }
                        value={blog.catagory}
                      >
                        <OptionCatagory />
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="md-form">
                      <label
                        htmlFor="message"
                        className="container-fluid d-flex justify-content-between"
                      >
                        <h1>Your Content</h1>
                        <h4>Letters : {contentlength}</h4>
                      </label>
                      <textarea
                        type="text"
                        id="message"
                        name="message"
                        rows="10"
                        className="form-control md-textarea w-100"
                        value={blog.content}
                        onKeyUp={() => setcontentlength(blog.content.length)}
                        onChange={(e) =>
                          setblog({ ...blog, content: e.target.value })
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="md-form">
                      <label htmlFor="message">
                        <h1>Upload Image</h1>
                      </label>
                      <span className="d-flex">
                        <input
                          type="file"
                          id="message"
                          accept="image/png, image/jpeg,image/jpg"
                          className="form-control  w-100"
                          onChange={(e) => uploadImage(e.target.files[0])}
                          onClick={file}
                        />
                        {loading ? (
                          <>
                            <div
                              className="spinner-border mt-2 mx-2"
                              style={{ width: "1rem", height: "1rem" }}
                              role="status"
                            >
                              <span className="sr-only"></span>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="container d-flex justify-content-center">
            <button
              className="btn btn-primary fw-bold p-3  rounded text-center"
              disabled={disable}
              onClick={publish}
            >
              Publish
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
