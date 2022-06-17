import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import signup from "../Images/signup.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
export default function Register() {
  const [register, setregister] = useState({
    username: "",
    email: "",
    password: "",
    userimage: "",
  });
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const registeruser = async (e) => {
    e.preventDefault();

    const { username, email, password, userimage } = register;

    const res = await fetch("/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, userimage }),
    });

    const data = await res.json();
    if (res.status === 400 || !data) {
      toast.error(data.error[0].msg);
    } else {
      toast.success(data.message);
      navigate("/login", { replace: true });
    }
  };
  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "m5nzhuoo");
    axios
      .post("http://api.cloudinary.com/v1_1/cldashish12/image/upload", formData)
      .then((res) => {
        setregister({ ...register, userimage: res.data.url });
        setDisable(false);
        setLoading(true);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const file = () => {
    setDisable(true);
    setLoading(true);
  };
  return (
    <>
      <div className="container p-5 mt-5 d-flex justify-content-center ">
        <div className="container border border-5">
          <img src={signup} alt="Signup" height="100%" width="100%" />
        </div>
        <div
          className="container p-3 border"
          style={{ backgroundColor: "#FD4F5A" }}
        >
          <h1 className="text-center mt-3 text-light">Register YourSelf</h1>
          <form className="p-5" method="POST">
            <div className="mb-5">
              <label
                htmlFor="username"
                className="form-label fw-bold text-light"
              >
                User Name
              </label>
              <input
                type="text"
                className="form-control border-bottom border-3 rounded-0"
                id="username"
                aria-describedby="emailHelp"
                style={{
                  backgroundColor: "transparent",
                  outline: "none",
                  border: 0,
                }}
                value={register.username}
                onChange={(e) =>
                  setregister({ ...register, username: e.target.value })
                }
                name="username"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="form-label fw-bold text-light">
                Email address
              </label>
              <input
                type="email"
                className="form-control border-bottom border-3 rounded-0"
                id="email"
                aria-describedby="emailHelp"
                style={{
                  backgroundColor: "transparent",
                  outline: "none",
                  border: 0,
                }}
                name="email"
                value={register.email}
                onChange={(e) =>
                  setregister({ ...register, email: e.target.value })
                }
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="form-label fw-bold text-light"
              >
                Password
              </label>
              <input
                type="password"
                className="form-control border-bottom border-3 rounded-0"
                id="password"
                style={{
                  backgroundColor: "transparent",
                  outline: "none",
                  border: 0,
                }}
                name="password"
                value={register.password}
                onChange={(e) =>
                  setregister({ ...register, password: e.target.value })
                }
              />
            </div>
            <div className="mb-5">
              <label htmlFor="image" className="form-label fw-bold text-light">
                Upload Image
              </label>
              <span className="d-flex">
                <input
                  type="file"
                  id="image"
                  accept="image/png, image/jpeg,image/jpg"
                  className="form-control  w-100"
                  onChange={(e) => uploadImage(e.target.files[0])}
                  onClick={file}
                />
                {loading ? (
                  <>
                    <div
                      className="spinner-border mt-2 mx-3"
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

            <button
              type="submit"
              className="btn btn-dark"
              onClick={registeruser}
              disabled={disable}
            >
              Register
            </button>
            <div>
              <p className="fw-bold mt-3 text-center ">
                Already Have An Account ?{" "}
                <Link to="/login" className="text-light text-decoration-none">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
