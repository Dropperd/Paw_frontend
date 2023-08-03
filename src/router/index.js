import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import MyImages from "../pages/MyImages";
import Register from "../pages/Register";
import UploadImage from "../pages/UploadImage";
import ClinicalFeed from "../pages/ClinicalFeed";
import FeedbackViewer from "../pages/FeedbackViewer";
import Share from "../pages/ShareImage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="my-images" element={<MyImages />} />
        <Route path="register" element={<Register />} />
        <Route path="upload-images" element={<UploadImage />} />
        <Route path="clinical-feed" element={<ClinicalFeed />} />
        <Route path="feedback/:id" element={<FeedbackViewer />} />
        <Route path="share" element={<Share />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;