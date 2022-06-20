import React, { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import Card from "./Card";
import banner from "../Images/Banner.jpg";
import { Link } from "react-router-dom";
export default function Home() {
  const [allblog, setallblog] = useState([]);
  const [loading, setLoading] = useState(true);
  const getuserblog = async () => {
    try {
      const res = await fetch("/blog", {
        method: "GET",
        headers: {
          Accept: "appllication/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setallblog(data);
      setLoading(false);
      if (!res.status === 200) {
        const err = new Error(data.error);
        throw err;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getuserblog();
  }, []);
  return (
    <>
      <Navbar />
      <div className="card bg-dark text-white mt-5">
        <img className="card-img" src={banner} alt="Card image" />
      </div>
      {loading ? (
        <>
          <div className="container d-flex justify-content-center align-item-center mt-5">
            <div className="container d-flex justify-content-center align-item-center mt-5">
              <div
                className="spinner-border mt-5"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              >
                <span className="sr-only"></span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {allblog.length == 0 ? (
            <>
              <h1 className="text-center">No Blog Created</h1>
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
              <div className="container-fluid d-flex justify-content-center">
                <Card data={allblog} />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
