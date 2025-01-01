import React, { useState, useRef } from 'react';
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
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Image,
    IconButton,
    useToast,
    Link
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function ImageUpload() {

    // Theme toggling using chakra ui

    const bgColor = useColorModeValue("gray.100", "09090B");
    const cardBg = useColorModeValue("gray.100", "#18181B");
    const textColor = useColorModeValue("gray.800", "FAFAFA");
    const secondaryTextColor = useColorModeValue("gray.600", "A1A1AA");
    const borderColor = useColorModeValue("gray.200", "#27272A");




    const [selectedFile, setSelectedFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const toast = useToast();

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            toast({
                title: 'Camera Error',
                description: 'Unable to access camera. Please check permissions.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
            setPreview(URL.createObjectURL(blob));
            stopCamera();
        }, 'image/jpeg');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
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
            toast({
                title: 'Success',
                description: 'Image analyzed successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to analyze image. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Error analyzing image:', error);
        }
        setLoading(false);
    };

    const clearImage = () => {
        setSelectedFile(null);
        setPreview(null);
        setAnalysis(null);
    };



    return (
        <Box minH="100vh" bg={bgColor} py={8}>
            <Container maxW="4xl">
                <Card bg={cardBg} borderColor={borderColor}>
                    <CardHeader>
                        <VStack spacing={2} align="stretch">
                           
                            
                            <Heading size="md" mt={4} color={textColor}>
                                Reach your health goals with VitaScan
                            </Heading>
                            <Text color="A1A1AA">
                                Your personal nutrition tracking app powered by AI
                            </Text>
                        </VStack>
                    </CardHeader>

                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <Tabs isFitted variant="enclosed" colorScheme="blue">
                                <TabList mb="1em">
                                    <Tab color={textColor}>Upload Image</Tab>
                                    <Tab color={textColor}>Use Camera</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            variant="filled"
                                            p={1}
                                        />
                                    </TabPanel>
                                    <TabPanel>
                                        <Box position="relative" width="100%" height="300px" bg="black" borderRadius="md">
                                            {stream ? (
                                                <>
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <Button
                                                        position="absolute"
                                                        bottom="4"
                                                        left="50%"
                                                        transform="translateX(-50%)"
                                                        onClick={captureImage}
                                                        colorScheme="blue"
                                                    >
                                                        Capture
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    position="absolute"
                                                    top="50%"
                                                    left="50%"
                                                    transform="translate(-50%, -50%)"
                                                    onClick={startCamera}
                                                    colorScheme="blue"
                                                >
                                                    Start Camera
                                                </Button>
                                            )}
                                        </Box>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>

                            {preview && (
                                <Box position="relative">
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        borderRadius="md"
                                        maxH="300px"
                                        w="100%"
                                        objectFit="cover"
                                    />
                                    <IconButton
                                        aria-label="Clear image"
                                        icon={<Text>x</Text>}
                                        position="absolute"
                                        top={2}
                                        right={2}
                                        onClick={clearImage}
                                        colorScheme="red"
                                        size="sm"
                                    />
                                </Box>
                            )}

                            <Button
                                
                                onClick={handleUpload}
                                isDisabled={!selectedFile || loading}
                                colorScheme="blue"
                                isLoading={loading}
                                loadingText="Analyzing"
                            >
                                Analyze Image
                            </Button>
                            <Text fontSize="sm" mt={2}> By uploading an image, you agree to our{' '}
                                <Link as={RouterLink} to="/privacy" color="blue.500">
                                Privacy Policy
                                </Link>
                                .
                                </Text>




                            {analysis && (
                                <Box mt={6}>
                                    <Heading size="sm" mb={2} color={textColor}>Analysis Results:</Heading>
                                    <Box 
                                        bg={bgColor} 
                                        p={4} 
                                        borderRadius="md"
                                        whiteSpace="pre-wrap"
                                        color={secondaryTextColor}
                                        borderColor={borderColor}
                                        borderWidth="1px"
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