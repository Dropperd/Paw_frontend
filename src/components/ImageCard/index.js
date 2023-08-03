import React, { useState, useEffect } from "react";
import {
  Card,
  Image,
  Text,
  Group,
  Button,
  Modal,
  Textarea,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { closeModal } from "@mantine/modals";

const API_URL = process.env.REACT_APP_API_DOMAIN;

const ImageCard = (revimage) => {
  const [showDetails, setShowDetails] = useState(false); // State to track whether details are shown
  const [feedbackCount, setFeedbackCount] = useState(0);
  const imageDataUrl = `data:image/png;base64,${revimage.image.image}`;
  const token = sessionStorage.getItem("token");
  const [userType, setUserType] = useState(0);
  const isLoggedIn = token !== null;
  const [UpdateDescription, setUpdateDescription] = useState(false);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleShowDetails = () => {
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  function handleShowFeedback() {
    navigate("/feedback/" + revimage.image.id);
  }

  async function DeleteImage() {
    const url = API_URL + "/image/" + revimage.image.id;

    try {
      const response = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      revimage.updateImages();
      handleCloseDetails();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    FeedbackCount();
    getUserType();
  }, [FeedbackCount]);

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

  async function FeedbackCount() {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/image/" + revimage.image.id + "/count";

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setFeedbackCount(response.data.count);
    } catch (error) {
      console.log(error);
    }
  }

  function ChangeDescriptionToggle() {
    setUpdateDescription(!UpdateDescription);
  }

  async function UpdateImageDescription() {
    const url = API_URL + "/image/" + revimage.image.id;
    const data = {
      description: description,
      body_position: revimage.image.body_position,
      user_id: revimage.image.user_id,
    };

    try {
      const response = await axios.put(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      handleCloseDetails();
      revimage.updateImages();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Card withBorder radius="md" p="md">
        <Card.Section>
          <Image src={imageDataUrl} height={180} />
        </Card.Section>
        <Card.Section mt="md">
          <Text >
            User Id: {revimage.image.user_id}
          </Text>
          <Text fz="md" mt="xs">
            Description: {revimage.image.description}
          </Text>
        </Card.Section>

        <Card.Section>
          <Group spacing={7} mt={5}>
            <Text fz="sm">Body Position: {revimage.image.body_position}</Text>
          </Group>
          <Text fz="md" mt="xs">
            Date: {new Date(revimage.image.updated_at).toLocaleDateString()}
          </Text>
          <Group spacing={7} mt={5}>
            <Text fz="sm">Feedback: {feedbackCount}</Text>
          </Group>
        </Card.Section>

        <Group mt="xs">
          <Button radius="md" style={{ flex: 1 }} onClick={handleShowDetails}>
            Show details
          </Button>
          <Button
            radius="md"
            color="green"
            style={{ flex: 1 }}
            onClick={handleShowFeedback}
          >
            Show Feedback
          </Button>
        </Group>
      </Card>

      <Modal opened={showDetails} onClose={handleCloseDetails}>
        <Image src={imageDataUrl} />
        <Modal.Body>
          <Text fz="md" mt="xs">
            Description: {revimage.image.description}
          </Text>
          <Text fz="md" mt="xs">
            Body Position: {revimage.image.body_position}
          </Text>
          <Text fz="md" mt="xs">
            Date : {new Date(revimage.image.updated_at).toLocaleDateString()}
          </Text>
          <div>
            {userType !== 1 && (
              <>
                <Button onClick={DeleteImage} color="red">
                  Delete
                </Button>
                <Button onClick={ChangeDescriptionToggle} color="yellow">
                  Update
                </Button>
                {UpdateDescription && (
                  <div>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button onClick={UpdateImageDescription} color="green">
                      Update Description
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImageCard;
