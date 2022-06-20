import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Forget from "../Images/forget.jpg";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const sendMail = async (e) => {
    e.preventDefault();
    const res = await fetch("/user/forget-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    const data = await res.json();
    if (res.status === 400 || !data) {
      //   toast.error(data.error[0].msg);
      toast.error(data.error);
    } else {
      toast.success(data.message);
      //   navigate("/", { replace: true });
    }
  };

  return (
    <>
      <div className="container p-5 mt-5">
        <div className="container p-5 mt-5 d-flex justify-content-center">
          <div className="container border border-5">
            <img src={Forget} height="550px" width="550px" />
          </div>

          <div className="container p-5 d-flex flex-column border border-5">
            <form method="POST">
              <h1 className="text-center mb-5">Forget Password</h1>
              <div className="mb-5 mt-5">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label fw-bold mt-5"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control border border-2 mb-5"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                />
              </div>

              <div className="container d-flex">
                <button
                  type="submit"
                  className="btn btn-success fw-bold w-50"
                  onClick={sendMail}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
