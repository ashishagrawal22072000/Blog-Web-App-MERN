import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import Navbar from "./Navbar";
export default function MyAccount() {
  const [presentuser, setpresentuser] = useState({});
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();

  const updateprofile = async (e) => {
    e.preventDefault();
    const { username, email, userimage } = presentuser;
    const res = await fetch("/user/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, userimage }),
    });

    const data = await res.json();
    console.log(data);
    if (res.status === 200) {
      toast.success(data.message);
    } else {
      toast.error(data.error[0].msg);
    }
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
      setpresentuser(data);

      if (!res.status === 200) {
        const err = new Error(data.error);
        throw err;
      }
    } catch (err) {
      console.log(err);
      navigate("/login", { replace: true });
    }
  };

  const deleteaccount = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete");
    if (confirmation) {
      const res = await fetch("/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      const data = await res.json();
      if (res.status === 200) {
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
        setpresentuser({ ...presentuser, userimage: res.data.url });
        setDisable(false);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const file = () => {
    setDisable(true);
  };

  useEffect(() => {
    calldata();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container p-5 mt-5">
        <div className="container p-5 mt-5 d-flex justify-content-center">
          <div className="container">
            <img src={presentuser.userimage} height="550px" width="550px" />
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg,image/jpg"
              className="form-control  w-100"
              onChange={(e) => uploadImage(e.target.files[0])}
              onClick={file}
            />
          </div>

          <div className="container p-5 d-flex flex-column border border-5">
            <form method="PATCH">
              <h1 className="text-center mb-5">Update Profile</h1>
              <div class="mb-5">
                <label htmlFor="exampleInputEmail1" class="form-label fw-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  class="form-control border border-2"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  value={presentuser.username}
                  onChange={(e) =>
                    setpresentuser({ ...presentuser, username: e.target.value })
                  }
                />
              </div>
              <div class="mb-5">
                <label htmlFor="exampleInputEmail1" class="form-label fw-bold">
                  Email address
                </label>
                <input
                  type="email"
                  class="form-control border border-2"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  value={presentuser.email}
                  onChange={(e) =>
                    setpresentuser({ ...presentuser, email: e.target.value })
                  }
                />
              </div>
              <div className="container d-flex">
                <button
                  disabled={disable}
                  type="submit"
                  class="btn btn-dark fw-bold w-100"
                  onClick={updateprofile}
                >
                  Update Profile
                </button>
              </div>
            </form>
            <div className="container d-flex my-3">
              <button
                type="submit"
                class="btn btn-danger fw-bold w-100"
                onClick={() => deleteaccount(presentuser._id)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
