import React, { useState } from 'react';
import axios from 'axios';
import {
 Box,
 Button,
 Card,
 CardBody,
 CardHeader,
 Container,
 Heading,
 Input,
 Text,
 VStack,
} from '@chakra-ui/react';

export default function ImageUpload() {
   const [selectedFile, setSelectedFile] = useState(null);
   const [analysis, setAnalysis] = useState(null);
   const [loading, setLoading] = useState(false);

   const handleFileChange = (e) => {
       setSelectedFile(e.target.files[0]);
   };

   const handleUpload = async () => {
       if (!selectedFile) return;
       
       const formData = new FormData();
       formData.append('image', selectedFile);
       setLoading(true);

       try {
           const response = await axios.post('http://localhost:5000/analyze', formData, {
               headers: {
                   'Content-Type': 'multipart/form-data',
               },
           });
           setAnalysis(response.data);
       } catch (error) {
           console.error('Error analyzing image:', error);
       }
       setLoading(false);
   };

   return (
       <Box minH="100vh" bg="gray.900" py={8}>
           <Container maxW="md">
               <Card bg="gray.800" borderColor="gray.700">
                   <CardHeader>
                       <VStack spacing={2} align="stretch">
                           <Heading size="lg" color="white">AI Powered- Nutriva</Heading>
                           <Text color="gray.400">Nutrition Tracking App</Text>
                           
                           <Heading size="md" mt={4} color="white">
                               Reach your health goals with Nutriva
                           </Heading>
                           <Text color="gray.400">
                               Your personal nutrition tracking app powered by AI
                           </Text>
                       </VStack>
                   </CardHeader>

                   <CardBody>
                       <VStack spacing={4} align="stretch">
                           <Heading size="md" color="white">Analyze Food Image</Heading>
                           <Input
                               type="file"
                               onChange={handleFileChange}
                               accept="image/*"
                               variant="filled"
                               p={1}
                           />
                           <Button
                               onClick={handleUpload}
                               isDisabled={!selectedFile || loading}
                               colorScheme="blue"
                               isLoading={loading}
                               loadingText="Analyzing"
                           >
                               Analyze Image
                           </Button>

                           {analysis && (
                               <Box mt={6}>
                                   <Heading size="sm" mb={2} color="white">Analysis Results:</Heading>
                                   <Box 
                                       bg="gray.900" 
                                       p={4} 
                                       borderRadius="md"
                                       whiteSpace="pre-wrap"
                                       color="gray.300"
                                   >
                                       {analysis.results}
                                   </Box>
                               </Box>
                           )}
                       </VStack>
                   </CardBody>
               </Card>
           </Container>
       </Box>
   );
}