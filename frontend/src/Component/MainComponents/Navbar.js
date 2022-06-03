import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link, useNavigate } from "react-router-dom";
export default function Navbar() {
  const [presentuser, setpresentuser] = useState();

  const navigate = useNavigate();

  const fetchauthuser = async () => {
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
      console.log(data);
      console.log(presentuser);

      if (!res.status === 200) {
        const err = new Error(data.error);
        throw err;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchauthuser();
  }, []);

  const logout = () => {
    fetch("/user/logout", {
      method: "GET",
      headers: {
        Accept: "appllication/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        navigate("/login", { replace: true });
        if (!res.status === 200) {
          const err = new Error(res.error);
          throw err;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light p-3 d-flex flex-column">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <h1>Blog.com</h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto ms-auto mb-2 mb-lg-0 fw-bold">
                <li class="nav-item">
                  <Link class="nav-link" aria-current="page" to="/">
                    Home
                  </Link>
                </li>

                <li class="nav-item">
                  <Link className="nav-link" to="/create">
                    Create
                  </Link>
                </li>
                <li class="nav-item">
                  <Link className="nav-link" to="/myblog">
                    myBlog
                  </Link>
                </li>

                <li class="nav-item">
                  <Link class="nav-link" to="/contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            {!presentuser ? (
              <>
                <ul className="navbar-nav ms-auto mx-5 mb-2 mb-lg-0">
                  <Link to="/login">
                    <button className="btn btn-dark fw-bold mx-3">Login</button>
                  </Link>
                  <Link to="/register">
                    <button className="btn btn-dark fw-bold">Register</button>
                  </Link>
                </ul>
              </>
            ) : (
              <>
                <ul className="navbar-nav ms-auto mx-5 mb-2 mb-lg-0">
                  <div className="dropdown">
                    <button
                      className="btn btn-dark dropdown-toggle rounded-circle"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      height="25"
                      width="50"
                    >
                      <img
                        src={presentuser.userimage}
                        height="50"
                        width="25"
                        className="rounded circle"
                      />
                    </button>
                    <ul
                      className="dropdown-menu p-3 mt-3"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <p className="text-center fw-bold">
                        Hello, {presentuser.username}
                      </p>
                      <li className="mt-3">
                        <Link className="dropdown-item" to="/account">
                          Account
                        </Link>
                      </li>
                      <div className="container">
                        <li className="mt-3">
                          <button
                            className="btn btn-dark w-100"
                            onClick={logout}
                          >
                            Logout
                          </button>
                        </li>
                      </div>
                    </ul>
                  </div>
                </ul>
              </>
            )}
          </div>
        </div>
        <div>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav fw-bold">
              <li class="nav-item mx-5">
                <Link class="nav-link" aria-current="page" to="/">
                  All
                </Link>
              </li>

              <li class="nav-item mx-5">
                <Link className="nav-link" to="/education">
                  Education
                </Link>
              </li>
              <li class="nav-item mx-5">
                <Link className="nav-link" to="/fashion">
                  Fashion
                </Link>
              </li>

              <li class="nav-item mx-5">
                <Link class="nav-link" to="/fitness">
                  Fitness
                </Link>
              </li>
              <li class="nav-item mx-5">
                <Link class="nav-link" aria-current="page" to="/food">
                  Food
                </Link>
              </li>

              <li class="nav-item mx-5">
                <Link className="nav-link" to="/sport">
                  Sport
                </Link>
              </li>
              <li class="nav-item mx-5">
                <Link className="nav-link" to="/technology">
                  Technology
                </Link>
              </li>

              <li class="nav-item mx-5">
                <Link class="nav-link" to="/travel">
                  Travel
                </Link>
              </li>
              <li class="nav-item mx-5">
                <Link class="nav-link" to="/movie">
                  Movie
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
