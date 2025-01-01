import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
export default function PrivacyPolicy() {

return (
    <Box p={4} maxWidth="600px" mx="auto" mt={6}>
    


    <Heading size="lg" mb={2}>Privacy Policy</Heading>
    <Text mb={3}>
      This Privacy Policy explains how our app handles your data.
    </Text>
    <Heading size="md" mt={2}>1. Data Collection</Heading>
    <Text mb={3}>
      When you upload an image, it is sent to our servers for analysis.
      We do not collect any personal information apart from the images you upload.
    </Text>
    <Heading size="md" mt={2}>2. Data Usage</Heading>
    <Text mb={3}>
      Uploaded images are used solely for the purpose of providing nutritional analysis.
      We do not use the images for any other purpose or share them with third parties.
    </Text>
    <Heading size="md" mt={2}>3. Data Retention</Heading>
    <Text mb={3}>
      Uploaded images are processed in real-time and deleted immediately after analysis.
      We do not store your images on our servers.
    </Text>
    <Heading size="md" mt={2}>4. User Consent</Heading>
    <Text mb={3}>
      By using this app, you consent to the processing of your images as described in this policy.
    </Text>
    <Heading size="md" mt={2}>5. Security</Heading>
    <Text mb={3}>
      We implement reasonable security measures to protect your data during transmission and processing.
    </Text> 

  </Box>

)














}