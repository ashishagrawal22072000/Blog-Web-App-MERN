import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdCreate } from "react-icons/md";
import { BsCalendar2DateFill } from "react-icons/bs";
import { FaCommentDots } from "react-icons/fa";
export default function Card({ data }) {
  return (
    <div>
      <div className="container-fluid  p-5 mt-5">
        <div className="container-fluid d-flex justify-content-center align-items-center">
          <div className="row mx-5">
            {data.map((ele) => {
              return (
                <>
                  <div
                    className="card mx-3 my-3 shadow-lg border border-5 p-3"
                    style={{ width: "30rem", height: "40rem" }}
                    key={ele._id}
                  >
                    <div className="hover">
                      <Link to={`/blog/${ele._id}`}>
                        <img
                          className="card-img-top"
                          src={ele.imgurl}
                          alt={ele.title}
                          height="250px"
                        />
                      </Link>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <div>
                        <h4 className="card-title text-center">{ele.title}</h4>
                      </div>
                      <div className="container d-flex justify-content-around my-3">
                        <h5 className="text-secondary">
                          <MdCreate /> {ele.publisher}
                        </h5>
                        <h5 className="text-secondary">
                          <BsCalendar2DateFill /> {ele.publishDate.slice(0, 10)}
                        </h5>
                      </div>
                      <div
                        style={{
                          height: "200px",
                          overflow: "hidden",
                          lineHeight: "28px",
                        }}
                      >
                        <p className="card-text text-center text-secondary">
                          {ele.content.slice(0, 700)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
