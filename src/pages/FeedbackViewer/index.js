import React, { useState, useEffect } from "react";
import HeaderUI from "../../components/Header";
import { useParams } from "react-router-dom";
import Comment from "../../components/Comment";
import axios from "axios";
import { Container, Image, Text, Group, Textarea, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_DOMAIN;

const FeedbackViewer = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [clinicalData, setClinicalData] = useState([]);
  const [userType, setUserType] = useState("");
  const { id } = useParams();
  const imageDataUrl = `data:image/png;base64,${imageData.image}`;
  const [feedback, setValue] = useState("");
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    getImageData();
    getUserType();
  }, []);

  async function getUserType() {
    if (token !== null) {
      const url = API_URL + "/user/token";

      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        setUserType(response.data.user.user_type);
      } catch (error) {}
    }
  }

  function getImageFeedback() {
    const token = sessionStorage.getItem("token");
    const url = `${API_URL}/image/${id}/feedback`;
    axios
      .get(url, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.feedbacks);
        setFeedbacks(response.data.feedbacks);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getImageData() {
    const token = sessionStorage.getItem("token");
    const url = `${API_URL}/image/${id}`;
    axios
      .get(url, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setImageData(response.data.image);
        getImageFeedback();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function uploadFeedback() {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/feedback/ ";

    const data = {
      feedback,
      user_id: imageData.user_id,
      image_id: imageData.id,
    };
    try {
      await axios.post(url, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      navigate("/clinical-feed");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <HeaderUI pageTitle="FeedbackViewer" />
      <Container size="xs" px="xs">
        <Image src={imageDataUrl}> </Image>
        <Group spacing={7} mt={5}>
          <Text fz="lg">Body Position:{imageData.body_position}</Text>
        </Group>
        <Group spacing={7} mt={5}>
          <Text fz="md">Description:{imageData.description}</Text>
        </Group>

        <Text fw={700} fz="md">
          Feedbacks:
        </Text>
        {userType == "1" && (
          <>
            <Textarea
              placeholder="Your Feedback"
              autosize
              minRows={2}
              maxRows={7}
              value={feedback}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
            <Button onClick={uploadFeedback} type="submit">
              Submit
            </Button>
          </>
        )}
        <Group spacing={7} mt={5}>
          {feedbacks && (
            <>
              {feedbacks.map((feedback) => (
                <><>
                </><Comment
                    key={feedback.id}
                    body={feedback.feedback}
                    author={feedback.id_clinical}
                    postedAt={feedback.updated_at} /></>
                
              ))}
            </>
          )}
        </Group>
      </Container>
    </>
  );
};

export default FeedbackViewer;
