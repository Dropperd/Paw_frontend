import React, { useState, useEffect } from "react";
import HeaderUI from "../../components/Header";
import UploadImageCard from "../../components/InsertImage";
import { Button, Select, Textarea } from "@mantine/core";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_DOMAIN;

const UploadImage = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [bodyPos, setBodyPos] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedBodyPos, setSelectedBodyPos] = useState("");

  useEffect(() => {
    getBodyPos();
  }, []);

  const handleBodyPosChange = (value) => {
    //find the body position object from the array
    const bodyPosObj = bodyPos.find((pos) => pos.id === value);
    setSelectedBodyPos(bodyPosObj.membro);
  };

  const handleImageUpload = (image) => {
    setUploadedImage(image);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  async function getBodyPos() {
    var token = sessionStorage.getItem("token");
    var url = API_URL + "/bodyposition/";
    //use axios to get data from api with token

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      setBodyPos(response.data.bodyPos);
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadImage() {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/image/";

    const formData = new FormData();
    formData.append("imageOut", uploadedImage);
    formData.append("body_position", selectedBodyPos);
    formData.append("description", description);

    try {
      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      toast.success("Upload Image successful!", {
        position: toast.POSITION.TOP_RIGHT,
      });

      navigate("/my-images");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  return (
    <>
      <HeaderUI pageTitle={"Upload Image"} />

      {bodyPos && (
        <Select
          data={bodyPos.map((pos) => ({
            value: pos.id,
            label: pos.membro,
            key: pos.id, // Add unique key prop
          }))}
          label="Body Position"
          placeholder="Select Body Position"
          required
          style={{ width: "100%" }}
          onChange={handleBodyPosChange}
        />
      )}
      <Textarea
        placeholder="Input your Description"
        label="Description"
        withAsterisk
        value={description}
        onChange={handleDescriptionChange}
      />

      <UploadImageCard onImageUpload={handleImageUpload} />

      <Button onClick={uploadImage}>Upload Image</Button>
      <ToastContainer />
    </>
  );
};

export default UploadImage;
