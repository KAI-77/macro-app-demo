import { Box, VStack, Heading, Text, List, ListItem } from "@chakra-ui/react";
import React from "react";

export default function InfoPage() {
    return (
        <Box p={4} maxWidth="600px" mx="auto" mt={6}>
            <VStack spacing={6} align="start">
                {/* Instructions Section */}
                <Box
                    w="full"
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    border="1px"
                    borderColor="gray.200"
                >
                    <Heading size="md" mb={4} color="blue.600">
                        How to use the app
                    </Heading>

                    <List spacing={3}>
                        <ListItem>1. Simply upload an image of the food you want to analyze</ListItem>
                        <ListItem>2. Click the "Analyze" button</ListItem>
                        <ListItem>3. The app will provide you with an estimate of the food's nutritional information and its macronutrients.</ListItem>
                        <ListItem>4. Always verify with a professional for accurate nutritional information</ListItem>
                    </List>
                </Box>

                {/* Disclaimer Section */}
                <Box
                    w="full"
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    border="1px"
                    borderColor="gray.200"
                >
                    <Heading size="md" mb={2} color="blue.600">
                        Disclaimer
                    </Heading>
                    <Text>
                        The nutritional information provided by this app is an estimate
                        and may not be completely accurate. Use this information as a guide
                        and consult a nutritionist or an expert for precise advice.
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
}