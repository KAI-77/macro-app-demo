import { useState, useRef } from 'react';
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
    Link,
    Center,
    HStack,
    Flex,
    Divider,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Badge,
    Tooltip,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    SimpleGrid,
    ModalFooter,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaCalculator, FaCameraRetro } from 'react-icons/fa';
import { MdRestartAlt, MdRestaurant } from 'react-icons/md';

export default function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [macros, setMacros] = useState({
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: ''
    });
    const [isCalculating, setIsCalculating] = useState(false);

    const MotionBox = motion(Box);

    // Theme toggling using chakra ui
    const bgColor = useColorModeValue("gray.50", "#121212");
    const cardBg = useColorModeValue("white", "#1E1E1E");
    const textColor = useColorModeValue("gray.800", "#FFFFFF");
    const secondaryTextColor = useColorModeValue("gray.600", "#B0B0B0");
    const borderColor = useColorModeValue("gray.200", "#333333");
    const buttonBg = useColorModeValue("blue.500", "blue.400");
    const buttonHoverBg = useColorModeValue("blue.600", "blue.500");

    // Handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                setStream(null);
            }
        }
    };

    // Handle camera capture
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setPreview(null);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error accessing camera:', error);
            toast({
                title: 'Camera Error',
                description: 'Unable to access camera',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Handle image capture from camera
    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0);
            canvas.toBlob((blob) => {
                setSelectedFile(blob);
                setPreview(URL.createObjectURL(blob));
                // Stop the camera stream
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                    setStream(null);
                }
            }, 'image/jpeg');
        }
    };

    // Reset function
    const handleReset = () => {
        setSelectedFile(null);
        setPreview(null);
        setAnalysis(null);
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            setStream(null);
        }
    };

    // Function to parse ingredients from analysis
    const extractIngredients = analysisText => {
        const sections = analysisText.split('PROCEDURE:');
        const ingredientSection = sections[0].replace('INGREDIENTS:', '').trim();
        return ingredientSection.split('\n').map(item => item.trim().replace(/^-\s*/, '')
        ).filter(item => item.length > 0);
    };

    // Handle image upload and analysis
    const handleUpload = async () => {
        if (!selectedFile) {
            toast({
                title: 'No file selected',
                description: 'Please select an image first',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/api/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                }
            });
            setAnalysis(response.data.analysis.fullResults);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to analyze image. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Function to calculate macros
    const calculateMacros = async () => {
        if (!analysis) return;

        setIsCalculating(true);

        try {
            const ingredients = extractIngredients(analysis);
            const response = await axios.post('http://localhost:5000/api/recipe',
                { ingredients },
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                    }
                }
            );

            const totalMacros = response.data.totalMacros;
            const calories = totalMacros.match(/calories:?\s*(\d+)/i)?.[1] || '';
            const protein = totalMacros.match(/protein:?\s*(\d+)/i)?.[1] || '';
            const carbohydrates = totalMacros.match(/carbohydrates:?\s*(\d+)/i)?.[1] || '';
            const fat = totalMacros.match(/fat:?\s*(\d+)\s*g/i)?.[1] || '';

            setMacros({
                calories,
                protein,
                carbohydrates,
                fat
            });
            setIsModalOpen(true);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to calculate macros. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsCalculating(false);
        }
    };

    const MacroCard = ({ label, value, unit, color }) => (
        <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            shadow="xl"
            border={'1px solid'}
            borderColor={borderColor}
            rounded={'lg'}
            bg={cardBg}
        >
            <StatLabel fontWeight={'medium'} isTruncated>
                {label}
            </StatLabel>
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                {value || '0'} {unit}
            </StatNumber>
            <StatHelpText>
                <Badge colorScheme={color} variant="subtle">
                    {label === 'Calories' ? 'kcal' : 'Per Serving'}
                </Badge>
            </StatHelpText>
        </Stat>
    );

    return (
        <Container maxW="container.xl" py={5}>
            <VStack spacing={6} align="stretch">
                <Card bg={cardBg}>
                    <CardHeader>
                        <Heading size="lg" color={textColor}>Recipe Image Analysis</Heading>
                    </CardHeader>
                    <CardBody>
                        <Tabs isFitted variant="enclosed">
                            <TabList mb="1em">
                                <Tab>Upload Image</Tab>
                                <Tab>Take Photo</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <VStack spacing={4}>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            display="none"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload">
                                            <Button as="span" leftIcon={<MdRestaurant />}>
                                                Choose Image
                                            </Button>
                                        </label>
                                    </VStack>
                                </TabPanel>
                                <TabPanel>
                                    <VStack spacing={4}>
                                        {!stream ? (
                                            <Button
                                                leftIcon={<FaCameraRetro />}
                                                onClick={startCamera}
                                            >
                                                Start Camera
                                            </Button>
                                        ) : (
                                            <Button onClick={captureImage}>
                                                Capture Image
                                            </Button>
                                        )}
                                        <Box position="relative" width="100%">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                style={{
                                                    display: stream ? 'block' : 'none',
                                                    maxWidth: '100%',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        </Box>
                                    </VStack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>

                        {/* Preview Section */}
                        {preview && (
                            <Box mt={4}>
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    maxH="400px"
                                    mx="auto"
                                    borderRadius="lg"
                                />
                                <HStack justify="center" mt={4} spacing={4}>
                                    <Button
                                        onClick={handleUpload}
                                        isLoading={loading}
                                        colorScheme="blue"
                                    >
                                        Analyze Recipe
                                    </Button>
                                    <IconButton
                                        icon={<MdRestartAlt />}
                                        onClick={handleReset}
                                        aria-label="Reset"
                                    />
                                </HStack>
                            </Box>
                        )}

                        {/* Analysis Results */}
                        {analysis && (
                            <Card bg={cardBg} mt={4}>
                                <CardHeader>
                                    <Heading size="md">Analysis Results</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Text whiteSpace="pre-wrap">{analysis}</Text>
                                    <Button
                                        leftIcon={<FaCalculator />}
                                        mt={4}
                                        onClick={calculateMacros}
                                        isLoading={isCalculating}
                                        colorScheme="blue"
                                    >
                                        Calculate Macros
                                    </Button>
                                </CardBody>
                            </Card>
                        )}
                    </CardBody>
                </Card>

                {/* Macros Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
                    <ModalOverlay />
                    <ModalContent bg={cardBg}>
                        <ModalHeader color={textColor}>Nutritional Information</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                                <MacroCard
                                    label="Calories"
                                    value={macros.calories}
                                    unit=""
                                    color="red"
                                />
                                <MacroCard
                                    label="Protein"
                                    value={macros.protein}
                                    unit="g"
                                    color="green"
                                />
                                <MacroCard
                                    label="Carbohydrates"
                                    value={macros.carbohydrates}
                                    unit="g"
                                    color="blue"
                                />
                                <MacroCard
                                    label="Fat"
                                    value={macros.fat}
                                    unit="g"
                                    color="yellow"
                                />
                            </SimpleGrid>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </VStack>
        </Container>
    );
}