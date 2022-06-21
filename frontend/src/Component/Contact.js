import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import contact from "../Images/contact.jpg";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Contact() {
  const [data, setData] = useState({
    username: "",
    email: "",
    message: "",
  });

  const sendMessage = async (e) => {
    e.preventDefault();
    const { username, email, message } = data;
    const res = await fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, message }),
    });

    const response = await res.json();
    setData({ username: "", email: "", message: "" });
    console.log("contact data", response);
    if (res.status === 400 || !response) {
      toast.error(response.error[0].msg);
      toast.error(response.error);
    } else {
      toast.success(response.message);
      // navigate("/", { replace: true });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container w-lg-100 w-md-50 p-5 mt-5 d-flex justify-content-center">
        <div className="container border border-5">
          <img src={contact} height="100%" width="100%" />
        </div>

        <div className="container p-5 d-flex flex-column border border-5">
          <form method="POST">
            <h1 className="text-center mb-5">Connect With Us</h1>
            <div className="mb-5">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label fw-bold"
              >
                Full Name
              </label>
              <input
                type="text"
                className="form-control border border-2"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="username"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label fw-bold"
              >
                Email address
              </label>
              <input
                type="email"
                className="form-control border border-2"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="user_email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div className="mb-5">
              <label htmlFor="exampleInput" className="form-label fw-bold">
                Message
              </label>
              <textarea
                rows="5"
                className="form-control border border-2"
                id="exampleInput"
                aria-describedby="emailHelp"
                name="message"
                value={data.message}
                onChange={(e) => setData({ ...data, message: e.target.value })}
              />
            </div>

            <div className="container d-flex">
              <button
                type="submit"
                className="btn btn-dark fw-bold w-100"
                onClick={sendMessage}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
