import React from "react";
import { Box, Heading, Text, HStack, VStack } from "@chakra-ui/react";

export default function PrivacyPolicy() {
    return (
        <Box p={4} maxWidth="1200px" mx="auto" mt={6}>
            <HStack
                w="full"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                border="1px"
                borderColor="gray.200"
                align="start"
                spacing={8}
            >
                {/* Left Column */}
                <VStack w="50%" align="start" spacing={4}>
                    <Box w="full">
                        <Heading size="lg" color="blue.600" mb={4}>Privacy Policy</Heading>
                        <Text color="gray.100" mb={6}>
                            This Privacy Policy explains how our app handles your data.
                        </Text>
                    </Box>

                    <Box w="full">
                        <Heading size="md" color="blue.600" mb={2}>1. Data Collection</Heading>
                        <Text color="gray.100" mb={3}>
                            When you upload an image, it is sent to our servers for analysis.
                            We do not collect any personal information apart from the images you upload.
                        </Text>
                    </Box>

                    <Box w="full">
                        <Heading size="md" color="blue.600" mb={2}>2. Data Usage</Heading>
                        <Text color="gray.100" mb={3}>
                            Uploaded images are used solely for the purpose of providing nutritional analysis.
                            We do not use the images for any other purpose or share them with third parties.
                        </Text>
                    </Box>
                </VStack>

                {/* Right Column */}
                <VStack w="50%" align="start" spacing={4}>
                    <Box w="full">
                        <Heading size="md" color="blue.600" mb={2}>3. Data Retention</Heading>
                        <Text color="gray.100" mb={3}>
                            Uploaded images are processed in real-time and deleted immediately after analysis.
                            We do not store your images on our servers.
                        </Text>
                    </Box>

                    <Box w="full">
                        <Heading size="md" color="blue.600" mb={2}>4. User Consent</Heading>
                        <Text color="gray.100" mb={3}>
                            By using this app, you consent to the processing of your images as described in this policy.
                        </Text>
                    </Box>

                    <Box w="full">
                        <Heading size="md" color="blue.600" mb={2}>5. Security</Heading>
                        <Text color="gray.100" mb={3}>
                            We implement reasonable security measures to protect your data during transmission and processing.
                        </Text>
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
}