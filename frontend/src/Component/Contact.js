import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import contact from "../Images/contact.jpg";
import Navbar from "./Navbar";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Contact() {
  const [data, setdata] = useState({
    name: "",
    email: "",
    message: "",
  });

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_dvhv25z",
        "template_rvwodmo",
        e.target,
        emailjs.init("AmJk0_0yLeE7Bbdjg")
      )
      .then((res) => {
        if (res.status == 200) {
          toast.success("Email sent successfully");
          setdata({
            name: "",
            email: "",
            message: "",
          });
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <>
      <Navbar />
      <div className="container w-lg-100 w-md-50 p-5 mt-5 d-flex justify-content-center">
        <div className="container border border-5">
          <img src={contact} height="100%" width="100%" />
        </div>

        <div className="container p-5 d-flex flex-column border border-5">
          <form onSubmit={sendEmail}>
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
                name="name"
                value={data.name}
                onChange={(e) => setdata({ ...data, name: e.target.value })}
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
                onChange={(e) => setdata({ ...data, email: e.target.value })}
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
                onChange={(e) => setdata({ ...data, message: e.target.value })}
              />
            </div>

            <div className="container d-flex">
              <button type="submit" className="btn btn-dark fw-bold w-100">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
