import { Box, Flex, Heading, Text, Button, VStack} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {

    const navigate = useNavigate();
    
  return (
    <Flex direction="column" align="center" p={8}>
      {/* Hero Section */}
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl">VitaScan- Powered by Gemini API</Heading>
        <Text fontSize="lg" color="gray.600" mb={4}>
         Analyze Nutrition, Empower Health
        </Text>
        <Button colorScheme="teal" size="lg" mb={6} onClick={() => navigate("/login")}>
          Get Started
        </Button>
      </VStack>

      {/* Features Section */}
      <Box mt={12} w="full" maxW="800px">
        <Heading size="lg" mb={4} textAlign="center">
          Why Choose VitaScan?
        </Heading>
        <Flex justify="space-between" wrap="wrap" gap={6}>
          <Box textAlign="center" flex="1" minW="200px">
            
            <Text fontWeight="bold">Secure Uploads</Text>
            <Text fontSize="sm" color="gray.500">Your images are safe with us.</Text>
          </Box>
          <Box textAlign="center" flex="1" minW="200px">
            
            <Text fontWeight="bold">AI Optimization</Text>
            <Text fontSize="sm" color="gray.500">Optimize images with cutting-edge AI.</Text>
          </Box>
        </Flex>
      </Box>

      
    </Flex>
  );
}


