import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Contact from "../Component/MainComponents/Contact";
import CreateBlog from "../Component/MainComponents/CreateBlog";
import Education from "../Component/MainComponents/Education";
import Fitness from "../Component/MainComponents/Fitness";
import Fashion from "../Component/MainComponents/Fashion";
import Food from "../Component/MainComponents/Food";
import Sports from "../Component/MainComponents/Sports";
import Technology from "../Component/MainComponents/Technology";
import Travel from "../Component/MainComponents/Travel";
import Error from "../Component/MainComponents/Error";
import Home from "../Component/MainComponents/Home";
import Login from "../Component/MainComponents/Login";
import MyAccount from "../Component/MainComponents/MyAccount";
import Movie from "../Component/MainComponents/Movie";
import MyBlog from "../Component/MainComponents/MyBlog";
import ReadMore from "../Component/MainComponents/ReadMore";
import Register from "../Component/MainComponents/Register";
export default function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Error />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/myblog" element={<MyBlog />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog/:id" element={<ReadMore />} />
          <Route path="/education" element={<Education />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/food" element={<Food />} />
          <Route path="/sport" element={<Sports />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/movie" element={<Movie />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
