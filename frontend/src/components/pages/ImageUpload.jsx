import  { useState, useRef } from 'react';
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
    Link, Center, HStack, Flex, Divider
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'motion/react';

export default function ImageUpload() {


    const [selectedFile, setSelectedFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const toast = useToast();


    const MotionBox = motion(Box);

    // Theme toggling using chakra ui

    const bgColor = useColorModeValue("gray.50", "#121212");
    const cardBg = useColorModeValue("white", "#1E1E1E");
    const textColor = useColorModeValue("gray.800", "#FFFFFF");
    const secondaryTextColor = useColorModeValue("gray.600", "#B0B0B0");
    const borderColor = useColorModeValue("gray.200", "#333333");
    const buttonBg = useColorModeValue("blue.500", "blue.400");
    const buttonHoverBg = useColorModeValue("blue.600", "blue.500");


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
            const response = await axios.post('http://localhost:5000/api/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')

                },
            });
            setAnalysis(response.data.results);
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
        <Box bg={bgColor} minH="100vh" py={12}>
            <Container maxW="4xl">
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card
                        bg={cardBg}
                        borderColor={borderColor}
                        borderWidth="1px"
                        borderRadius="xl"
                        overflow="hidden"
                        boxShadow="xl"
                    >
                        <CardHeader pb={0}>
                            <Heading
                                size="lg"
                                color={textColor}
                                textAlign="center"
                                mb={4}
                            >
                                Recipe Analysis Tool
                            </Heading>
                            <Text
                                color={secondaryTextColor}
                                textAlign="center"
                                mb={6}
                            >
                                Upload or capture an image of a recipe and get a detailed list of ingredients and procedures.
                            </Text>
                        </CardHeader>

                        <CardBody>
                            <Tabs isFitted variant="soft-rounded" colorScheme="blue">
                                <TabList mb={4}>
                                    <Tab>Upload Image</Tab>
                                    <Tab>Take Photo</Tab>
                                </TabList>

                                <TabPanels>
                                    <TabPanel>
                                        <VStack spacing={6}>
                                            <Center
                                                w="full"
                                                h="300px"
                                                borderRadius="lg"
                                                borderWidth="2px"
                                                borderStyle="dashed"
                                                borderColor={borderColor}
                                                bg={useColorModeValue("gray.50", "gray.900")}
                                                position="relative"
                                                overflow="hidden"
                                            >
                                                {preview ? (
                                                    <Image
                                                        src={preview}
                                                        alt="Preview"
                                                        maxH="100%"
                                                        objectFit="contain"
                                                    />
                                                ) : (
                                                    <VStack spacing={3}>
                                                        <Text color={secondaryTextColor}>
                                                            Drag and drop your image here or
                                                        </Text>
                                                        <Button
                                                            as="label"
                                                            htmlFor="file-upload"
                                                            bg={buttonBg}
                                                            color="white"
                                                            _hover={{ bg: buttonHoverBg }}
                                                            cursor="pointer"
                                                        >
                                                            Browse Files
                                                            <Input
                                                                id="file-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                                display="none"
                                                            />
                                                        </Button>
                                                    </VStack>
                                                )}
                                            </Center>

                                            <HStack spacing={4} w="full" justify="center">
                                                <Button
                                                    onClick={handleUpload}
                                                    isLoading={loading}
                                                    bg={buttonBg}
                                                    color="white"
                                                    _hover={{ bg: buttonHoverBg }}
                                                    isDisabled={!selectedFile}
                                                    px={8}
                                                >
                                                    Analyze Image
                                                </Button>
                                                {selectedFile && (
                                                    <Button
                                                        onClick={clearImage}
                                                        variant="ghost"
                                                        colorScheme="red"
                                                    >
                                                        Clear
                                                    </Button>
                                                )}
                                            </HStack>
                                        </VStack>
                                    </TabPanel>

                                    <TabPanel>
                                        <VStack spacing={6}>
                                            <Center
                                                w="full"
                                                h="300px"
                                                borderRadius="lg"
                                                borderWidth="2px"
                                                overflow="hidden"
                                                position="relative"
                                            >
                                                {stream ? (
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <Button
                                                        onClick={startCamera}
                                                        bg={buttonBg}
                                                        color="white"
                                                        _hover={{ bg: buttonHoverBg }}
                                                    >
                                                        Start Camera
                                                    </Button>
                                                )}
                                            </Center>

                                            {stream && (
                                                <HStack spacing={4}>
                                                    <Button
                                                        onClick={captureImage}
                                                        bg={buttonBg}
                                                        color="white"
                                                        _hover={{ bg: buttonHoverBg }}
                                                    >
                                                        Capture Photo
                                                    </Button>
                                                    <Button
                                                        onClick={stopCamera}
                                                        variant="ghost"
                                                        colorScheme="red"
                                                    >
                                                        Stop Camera
                                                    </Button>
                                                </HStack>
                                            )}
                                        </VStack>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>

                            {analysis && (
                                <Box
                                    mt={8}
                                    p={6}
                                    borderRadius="lg"
                                    bg={useColorModeValue("gray.50", "gray.900")}
                                >
                                    <Heading size="md" mb={4} color={textColor}>
                                        Analysis Results
                                    </Heading>
                                    <Text color={secondaryTextColor}>
                                        {analysis}
                                    </Text>
                                </Box>
                            )}
                        </CardBody>
                    </Card>
                </MotionBox>
            </Container>
        </Box>
    );

}