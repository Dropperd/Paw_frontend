import React, { useState }from "react";
import { Text, rem, Box, Image } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';

const UploadImageCard = ({onImageUpload}) => {

    const [uploadedImage, setUploadedImage] = useState(null);

  const handleDrop = (files) => {
    // Assuming only one image is uploaded
    const uploadedFile = files[0];
    setUploadedImage(uploadedFile);
    onImageUpload(uploadedFile);
    // You can perform further actions with the uploaded image file, such as sending it to a server or displaying a preview.
  };

  return (
<>
<Box component="form" maw={500} mx="auto">
        <Dropzone
            accept={IMAGE_MIME_TYPE}
            onDrop={handleDrop}
            style={{ width: '100%', height: '100%' }}
        >
            <Text align="center" style={{ marginTop: rem(100) }}>
                Drop image here or click to select
            </Text>
        </Dropzone>
    </Box>
    
    {uploadedImage && (
        <Box maw={700} mx="auto">
          <h2>Uploaded Image:</h2>
          <Image src={URL.createObjectURL(uploadedImage)} alt="Uploaded" />
        </Box>
      )}
</>
    
  );
};

export default UploadImageCard;