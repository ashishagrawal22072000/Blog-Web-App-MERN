import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import signup from "../../Images/signup.jpg";
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
  const emailregex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
  const passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  const navigate = useNavigate();

  const registeruser = async (e) => {
    e.preventDefault();

    const { username, email, password, userimage } = register;
    if (!emailregex.test(register.email)) {
      toast.error("Invalid Email");
    } else if (!passregex.test(register.password)) {
      toast.error(
        "Password must contain Minimum eight characters, at least one letter, one number and one special character:"
      );
    } else {
      const res = await fetch("/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, userimage }),
      });

      const data = await res.json();
      if (res.status === 422 || !data) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        navigate("/login", { replace: true });
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
        setregister({ ...register, userimage: res.data.url });
        setDisable(false);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const file = () => {
    setDisable(true);
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
                htmlFor="exampleInputEmail1"
                className="form-label fw-bold text-light"
              >
                User Name
              </label>
              <input
                type="text"
                className="form-control border-bottom border-3 rounded-0"
                id="exampleInputEmail1"
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
              <label
                htmlFor="exampleInputEmail1"
                className="form-label fw-bold text-light"
              >
                Email address
              </label>
              <input
                type="email"
                className="form-control border-bottom border-3 rounded-0"
                id="exampleInputEmail1"
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
                htmlFor="exampleInputPassword1"
                className="form-label fw-bold text-light"
              >
                Password
              </label>
              <input
                type="password"
                className="form-control border-bottom border-3 rounded-0"
                id="exampleInputPassword1"
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
              <input
                type="file"
                id="image"
                accept="image/png, image/jpeg,image/jpg"
                className="form-control  w-100"
                onChange={(e) => uploadImage(e.target.files[0])}
                onClick={file}
              />
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
