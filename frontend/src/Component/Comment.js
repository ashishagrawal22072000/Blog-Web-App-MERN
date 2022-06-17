import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function Comment({ data }) {
  const [addComments, setAddComments] = useState({
    comment: "",
  });
  const navigate = useNavigate();
  const [getComments, setGetComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const { id } = useParams();
  const postComment = async (e) => {
    e.preventDefault();
    calldata();
    const { comment } = addComments;
    const res = await fetch("/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, comment }),
    });

    const data = await res.json();

    if (res.status === 200) {
      toast.success(data.message);
      setLoading(true);
      setAddComments({
        comment: "",
      });
      fetchComments();
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/comment/${id}`, {
        method: "GET",
        headers: {
          Accept: "appllication/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setGetComments(data);
      setLoading(false);
      if (!res.status === 200) {
        const err = new Error(data.error);
        throw err;
      }
    } catch (err) {
      console.log(err);
    }
  };

  function handleFocus() {
    setDisplay(true);
  }
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
      // setactiveuser(data);
      if (!data.status === 200) {
        const err = new Error(data.error);
        throw err;
      }
    } catch (err) {
      console.log(err);
      navigate("/login", { replace: true });
    }
  };
  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div>
      <div className="container-fluid my-3 p-5">
        <div className="container-fluid my-5">
          <h3>{getComments?.length} Comments</h3>

          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control w-100"
                id="comment"
                aria-describedby="emailHelp"
                style={{
                  borderTop: 0,
                  borderLeft: 0,
                  borderRight: 0,
                  borderBottom: "2px solid",
                  outline: "none",
                  borderRadius: 0,
                }}
                placeholder="Add a comment..."
                value={addComments.comment}
                onChange={(e) => setAddComments({ comment: e.target.value })}
                onFocus={handleFocus}
              />
            </div>
            {display ? (
              <>
                <div>
                  <button
                    type="submit"
                    className={`btn btn-danger  ${
                      addComments?.comment?.length > 0 ? "" : "disabled"
                    }`}
                    onClick={postComment}
                  >
                    Post Comment
                  </button>
                  <button
                    className="btn btn-dark mx-3"
                    onClick={() => {
                      setDisplay(false);
                      setAddComments({ comment: "" });
                    }}
                  >
                    cancel
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
          </form>
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
            <div className="container-fluid my-5">
              {getComments?.map((ele) => {
                return (
                  <>
                    <div className="p-3 container-fluid d-flex">
                      <div className="d-flex">
                        <h3
                          className="fw-bold bg-dark text-light p-3"
                          style={{ height: "50px", width: "50px" }}
                        >
                          {ele?.name.slice(0, 1)}
                        </h3>
                      </div>
                      <div>
                        <span className="mx-3 my-3">{ele?.name}</span>
                        <div>
                          <p className="mx-3">{ele?.comment}</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
