import { useState, useRef } from "react";
import axios from "axios";
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
  CardFooter,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "motion/react";
import { FaCalculator, FaCameraRetro } from "react-icons/fa";
import { MdRestartAlt, MdRestaurant } from "react-icons/md";

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
    calories: "",
    protein: "",
    carbohydrates: "",
    fat: "",
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const MotionBox = motion(Box);

  // Enhanced theme colors
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardShadow = useColorModeValue(
    "0 4px 6px rgba(160, 174, 192, 0.6)",
    "0 4px 6px rgba(9, 17, 28, 0.9)"
  );

  const imageContainerStyles = {
    maxW: "400px", // Standardized max width
    mx: "auto",
    position: "relative",
    width: "100%",
    height: "300px", // Fixed height for consistency
    overflow: "hidden",
    borderRadius: "xl",
    shadow: "lg",
    border: "1px solid",
    borderColor: borderColor,
  };

  const mediaStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "auto",
    objectFit: "contain",
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        setStream(null);
      }
    }
  };

  // Handle camera capture
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setPreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle image capture from camera
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        setSelectedFile(blob);
        setPreview(URL.createObjectURL(blob));
        // Stop the camera stream
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
          setStream(null);
        }
      }, "image/jpeg");
    }
  };

  // Reset function
  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setAnalysis(null);
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Function to parse ingredients from analysis
  const extractIngredients = (analysisText) => {
    const sections = analysisText.split("PROCEDURE:");
    const ingredientSection = sections[0].replace("INGREDIENTS:", "").trim();
    return ingredientSection
      .split("\n")
      .map((item) => item.trim().replace(/^-\s*/, ""))
      .filter((item) => item.length > 0);
  };

  // Handle image upload and analysis
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        "https://vitascan-backend.onrender.com/api/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("userToken"),
          },
        }
      );
      setAnalysis(response.data.analysis.fullResults);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        status: "error",
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
      const response = await axios.post(
        "https://vitascan-backend.onrender.com/api/recipe",
        { ingredients },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
          },
        }
      );

      const totalMacros = response.data.totalMacros;
      const calories = totalMacros.match(/calories:?\s*(\d+)/i)?.[1] || "";
      const protein = totalMacros.match(/protein:?\s*(\d+)/i)?.[1] || "";
      const carbohydrates =
        totalMacros.match(/carbohydrates:?\s*(\d+)/i)?.[1] || "";
      const fat = totalMacros.match(/fat:?\s*(\d+)\s*g/i)?.[1] || "";

      setMacros({
        calories,
        protein,
        carbohydrates,
        fat,
      });
      setIsModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate macros. Please try again.",
        status: "error",
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
      py={"5"}
      shadow="xl"
      border={"1px solid"}
      borderColor={borderColor}
      rounded={"lg"}
      bg={cardBg}
    >
      <StatLabel fontWeight={"medium"} isTruncated>
        {label}
      </StatLabel>
      <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
        {value || "0"} {unit}
      </StatNumber>
      <StatHelpText>
        <Badge colorScheme={color} variant="subtle">
          {label === "Calories" ? "kcal" : "Per Serving"}
        </Badge>
      </StatHelpText>
    </Stat>
  );

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={8}>
      <Container maxW="container.md">
        {" "}
        {/* Reduced container width */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            bg={cardBg}
            shadow="xl"
            borderRadius="2xl"
            overflow="hidden"
            borderWidth="1px"
            borderColor={borderColor}
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: "-1px",
              left: "-1px",
              right: "-1px",
              height: "6px",
              bgGradient: "linear(to-r, blue.400, purple.500)",
              borderTopLeftRadius: "xl",
              borderTopRightRadius: "xl",
            }}
          >
            <CardHeader p={6}>
              <Heading
                size="lg"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
                letterSpacing="tight"
              >
                Recipe Image Analysis
              </Heading>
            </CardHeader>
            <CardBody p={6}>
              <Tabs isFitted variant="soft-rounded" colorScheme="purple">
                <TabList mb={6}>
                  <Tab _selected={{ bg: "purple.500", color: "white" }}>
                    Upload Image
                  </Tab>
                  <Tab _selected={{ bg: "purple.500", color: "white" }}>
                    Take Photo
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={6}>
                      <label htmlFor="file-upload" style={{ width: "100%" }}>
                        <Box
                          {...imageContainerStyles}
                          h="200px"
                          border="2px"
                          borderStyle="dashed"
                          cursor="pointer"
                          _hover={{ borderColor: "purple.500" }}
                          onClick={() =>
                            document.getElementById("file-upload").click()
                          }
                        >
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            display="none"
                            id="file-upload"
                          />
                          <VStack
                            spacing={4}
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            alignItems="center"
                          >
                            <MdRestaurant
                              size="40px"
                              style={{ color: "currentColor", opacity: 0.6 }}
                            />
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="medium"
                              textAlign="center"
                            >
                              Click or drag image here
                            </Text>
                          </VStack>
                        </Box>
                      </label>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack spacing={6}>
                      {!stream ? (
                        <Button
                          size="lg"
                          leftIcon={<FaCameraRetro />}
                          onClick={startCamera}
                          bgGradient="linear(to-r, blue.400, purple.500)"
                          color="white"
                          _hover={{
                            bgGradient: "linear(to-r, blue.500, purple.600)",
                          }}
                        >
                          Start Camera
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          colorScheme="purple"
                          onClick={captureImage}
                        >
                          Capture Image
                        </Button>
                      )}
                      <Box {...imageContainerStyles}>
                        <video
                          ref={videoRef}
                          autoPlay
                          style={{
                            display: stream ? "block" : "none",
                            ...mediaStyles,
                            backgroundColor: "black",
                          }}
                        />
                      </Box>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              {preview && (
                <MotionBox
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  mt={6}
                >
                  <Box {...imageContainerStyles}>
                    <Image
                      src={preview}
                      alt="Preview"
                      sx={mediaStyles}
                      bg={cardBg}
                    />
                  </Box>
                  <HStack justify="center" mt={6} spacing={4}>
                    <Button
                      onClick={handleUpload}
                      isLoading={loading}
                      size="lg"
                      bgGradient="linear(to-r, blue.400, purple.500)"
                      color="white"
                      _hover={{
                        bgGradient: "linear(to-r, blue.500, purple.600)",
                      }}
                    >
                      Analyze Recipe
                    </Button>
                    <IconButton
                      icon={<MdRestartAlt />}
                      onClick={handleReset}
                      aria-label="Reset"
                      size="lg"
                      variant="outline"
                      colorScheme="purple"
                    />
                  </HStack>
                </MotionBox>
              )}

              {analysis && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  mt={6}
                >
                  <Card bg={cardBg} shadow="md" borderRadius="xl">
                    <CardHeader>
                      <Heading size="md" color={textColor}>
                        Analysis Results
                      </Heading>
                    </CardHeader>
                    <CardBody maxH="300px" overflowY="auto">
                      {" "}
                      {/* Limit analysis text height */}
                      <Text whiteSpace="pre-wrap" color={textColor}>
                        {analysis}
                      </Text>
                      <Button
                        leftIcon={<FaCalculator />}
                        mt={6}
                        onClick={calculateMacros}
                        isLoading={isCalculating}
                        size="lg"
                        bgGradient="linear(to-r, blue.400, purple.500)"
                        color="white"
                        _hover={{
                          bgGradient: "linear(to-r, blue.500, purple.600)",
                        }}
                      >
                        Calculate Macros
                      </Button>
                    </CardBody>
                  </Card>
                </MotionBox>
              )}
            </CardBody>
          </Card>
        </MotionBox>
        {/* Enhanced Modal with consistent sizing */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="xl" // Changed from xl to lg
        >
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent bg={cardBg} borderRadius="1xl" shadow="2xl" mx={4}>
            <ModalHeader
              bgGradient="linear(to-r, blue.400, purple.500)"
              color="white"
              borderTopRadius="1xl"
              p={4}
            >
              Nutritional Information
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={8}>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
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
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
