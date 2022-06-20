import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ForgetPassword from "../Component/ForgetPassword";
import Contact from "../Component/Contact";
import CreateBlog from "../Component/CreateBlog";
import Education from "../Component/Education";
import Fitness from "../Component/Fitness";
import Fashion from "../Component/Fashion";
import Food from "../Component/Food";
import Sports from "../Component/Sports";
import Technology from "../Component/Technology";
import Travel from "../Component/Travel";
import Error from "../Component/Error";
import Home from "../Component/Home";
import Login from "../Component/Login";
import MyAccount from "../Component/MyAccount";
import Movie from "../Component/Movie";
import MyBlog from "../Component/MyBlog";
import ReadMore from "../Component/ReadMore";
import Register from "../Component/Register";
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
          <Route path="forget" element={<ForgetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
