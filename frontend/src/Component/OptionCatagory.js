import React from "react";

export default function OptionCatagory() {
    const catagory_options = [
        "Travel",
        "Fashion",
        "Fitness",
        "Sports",
        "Food",
        "Technology",
        "Education",
        "Movie"
      ];
  return (
    <>
      <option>Please Select Catagory</option>
      {catagory_options.map((ele, i) => {
        return (
          <>
            <option value={ele || ""} key={ele + i} className="text-light">
              {ele}
            </option>
          </>
        );
      })}
    </>
  );
}
