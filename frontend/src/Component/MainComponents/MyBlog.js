import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import OptionCatagory from "./OptionCatagory";
import axios from "axios";
import { Link } from "react-router-dom";
export default function MyBlog() {
  const [userblog, setuserblog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disable, setDisable] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    content: "",
    imgurl: "",
    catagory: "",
  });
  const navigate = useNavigate();

  const calldata = async () => {
    try {
      const res = await fetch("/blog/myblog", {
        method: "GET",
        headers: {
          Accept: "appllication/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setuserblog(data);
      setLoading(false);
      if (!data.status === 200) {
        const err = new Error(data.error);
        throw err;
      }
    } catch (err) {
      console.log(err);
      navigate("/login", { replace: true });
    }
  };

  const editblog = (id) => {
    const editBlog = userblog.filter((ele) => {
      return ele._id == id;
    });
    setEditData({
      id: editBlog[0]._id,
      title: editBlog[0].title,
      content: editBlog[0].content,
      catagory: editBlog[0].catagory,
      imgurl: editBlog[0].imgurl,
    });
    console.log(editBlog[0].title);
    console.log(editData);
  };

  useEffect(() => {
    calldata();
  }, []);

  const deleteblog = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete");
    if (confirmation) {
      const res = await fetch("/blog/myblog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message);
        calldata();
      }
    }
  };

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "m5nzhuoo");
    axios
      .post("http://api.cloudinary.com/v1_1/cldashish12/image/upload", formData)
      .then((res) => {
        setEditData({ ...editData, imgurl: res.data.url });
        console.log(res);
        setDisable(false);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const file = () => {
    setDisable(true);
  };

  const updateBlog = async (e) => {
    e.preventDefault();
    const { id, title, content, catagory, imgurl } = editData;
    const res = await fetch("/blog/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title, content, catagory, imgurl }),
    });

    const data = await res.json();
    console.log(data);
    if (res.status === 200) {
      toast.success(data.message);
      setEditData({
        id: "",
        title: "",
        content: "",
        imgurl: "",
        catagory: "",
      });

      calldata();
    } else {
      toast.error(data.error[0].msg);
    }
  };
  return (
    <>
      <Navbar />
      {loading ? (
        <>
          <div className="container d-flex justify-content-center align-item-center mt-5">
            <div className="container d-flex justify-content-center align-item-center mt-5">
              <div
                class="spinner-border mt-5"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              >
                <span class="sr-only"></span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {userblog.length == 0 ? (
            <>
              <h1 className="text-center">No Blog Found</h1>
              <div className="d-flex justify-content-center align-item-center my-5">
                <button className="btn btn-danger">
                  <Link
                    to="/create"
                    className="text-light fw-bold"
                    style={{ textDecoration: "none" }}
                  >
                    Create Blog
                  </Link>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="container-fluid p-5 mt-5">
                {userblog.map((ele, i) => {
                  return (
                    <>
                      <div className="card mt-5" key={ele._id}>
                        <div className="card-header d-flex justify-content-between">
                          <h1>
                            {i + 1}.{""}
                            {ele.title}
                          </h1>

                          <div>
                            <p className="text-secondary">{ele.publishDate}</p>
                            <p className="fw-bold text-secondary text-center bg-dark p-1">
                              {ele.catagory}
                            </p>
                          </div>
                        </div>
                        <div
                          className="card-body d-flex justify-content-center p-3"
                          style={{ height: "300px", overflow: "hidden" }}
                        >
                          <div className="container w-50">
                            <img
                              className=""
                              src={ele.imgurl}
                              height="300px"
                              width="400px"
                            />
                          </div>
                          <div className="" style={{ overflowY: "scroll" }}>
                            <blockquote className="blockquote mb-0">
                              <p>{ele.content}</p>
                            </blockquote>
                          </div>
                        </div>
                        <div className="container-fluid d-flex justify-content-end p-2">
                          <div className="mt-5 mx-3">
                            <button
                              className="btn btn-dark"
                              onClick={() => deleteblog(ele._id)}
                            >
                              Delete
                            </button>
                          </div>
                          <div className="mt-5">
                            <button
                              className="btn btn-dark"
                              data-toggle="modal"
                              data-target="#exampleModal"
                              onClick={() => editblog(ele._id)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Edit Blog
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="title">Title</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    aria-describedby="emailHelp"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                  />
                </div>
                <div class="form-group">
                  <label for="content">Content</label>
                  <textarea
                    rows="10"
                    class="form-control"
                    id="content"
                    placeholder="Content..."
                    value={editData.content}
                    onChange={(e) =>
                      setEditData({ ...editData, content: e.target.value })
                    }
                  />
                </div>
                <div class="form-group">
                  <label for="content">catagory</label>
                  <select
                    className="p-3 bg-dark text-light fw-bold mx-5"
                    onChange={(e) =>
                      setEditData({ ...editData, catagory: e.target.value })
                    }
                    value={editData.catagory}
                  >
                    <OptionCatagory />
                  </select>
                </div>
                <div class="form-group">
                  <label htmlFor="message">Upload Image</label>
                  <input
                    type="file"
                    id="message"
                    accept="image/png, image/jpeg,image/jpg"
                    className="form-control  w-100"
                    onChange={(e) => uploadImage(e.target.files[0])}
                    onClick={file}
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                disabled={disable}
                onClick={updateBlog}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      )
    </>
  );
}
