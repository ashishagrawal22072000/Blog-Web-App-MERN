import React from "react";
import "bootstrap/dist/css/bootstrap.css";
export default function Loader({ loading }) {
  return (
    <>
      {loading ? (
        <>
          <div className="container d-flex justify-content-center align-item-center mt-5">
            <div className="container d-flex justify-content-center align-item-center mt-5">
              <div
                class="spinner-border mt-5"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
