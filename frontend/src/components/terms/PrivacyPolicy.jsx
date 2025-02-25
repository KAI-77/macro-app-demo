import React from "react";
import { Box, Heading, Text, HStack, VStack, useColorModeValue } from "@chakra-ui/react";

export default function PrivacyPolicy() {
    // Add color mode values for text and border
    const textColor = useColorModeValue("gray.900", "gray.200");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const headingColor = useColorModeValue("blue.600", "blue.400");

    return (
        <Box p={4} maxWidth="1200px" mx="auto" mt={6}>
            <HStack
                w="full"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                border="1px"
                borderColor={borderColor}
                align="start"
                spacing={8}
            >
                {/* Left Column */}
                <VStack w="50%" align="start" spacing={4}>
                    <Box w="full">
                        <Heading size="lg" color={headingColor} mb={4}>Privacy Policy</Heading>
                        <Text color={textColor} mb={6}>
                            This Privacy Policy explains how our app handles your data.
                        </Text>
                    </Box>

                    <Box w="full">
                        <Heading size="md" color={headingColor} mb={2}>1. Data Collection</Heading>
                        <Text color={textColor} mb={3}>
                            When you upload an image, it is sent to our servers for analysis.
                            We do not collect any personal information apart from the images you upload.
                        </Text>
                    </Box>

                    <Box w="full">
                        <Heading size="md" color={headingColor} mb={2}>2. Data Usage</Heading>
                        <Text color={textColor} mb={3}>
                            Uploaded images are used solely for the purpose of providing nutritional analysis.
                            We do not use the images for any other purpose or share them with third parties.
                        </Text>
                    </Box>
                </VStack>

                {/* Right Column */}
                <VStack w="50%" align="start" spacing={4}>
                    <Box w="full">
                        <Heading size="md" color={headingColor} mb={2}>3. Data Retention</Heading>
                        <Text color={textColor} mb={3}>
                            Uploaded images are processed in real-time and deleted immediately after analysis.
                            We do not store your images on our servers.
                        </Text>
                    </Box>

                    <Box w="full">
                        <Heading size="md" color={headingColor} mb={2}>4. User Consent</Heading>
                        <Text color={textColor} mb={3}>
                            By using this app, you consent to the processing of your images as described in this policy.
                        </Text>
                    </Box>

                    <Box w="full">
                        <Heading size="md" color={headingColor} mb={2}>5. Security</Heading>
                        <Text color={textColor} mb={3}>
                            We implement reasonable security measures to protect your data during transmission and processing.
                        </Text>
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
}