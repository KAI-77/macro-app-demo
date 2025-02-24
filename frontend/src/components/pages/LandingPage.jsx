import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    VStack,
    Container,
    Icon,
    SimpleGrid,
    useColorModeValue,
    Highlight
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaRobot, FaCamera, FaChartBar } from "react-icons/fa";


const MotionBox = motion(Box);
const MotionFlex = motion(Flex);


const Feature = ({ icon, title, description }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');


    return (
        <MotionBox
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            p={6}
            bg={bgColor}
            borderRadius="xl"
            boxShadow="lg"
            border="1px"
            borderColor={borderColor}
            _hover={{ boxShadow: "2xl" }}
        >
            <VStack spacing={4}>
                <Icon as={icon} w={10} h={10} color="blue.400" />
                <Text fontWeight="bold" fontSize="xl">{title}</Text>
                <Text color={useColorModeValue('gray.600', 'gray.400')} textAlign="center">
                    {description}
                </Text>
            </VStack>
        </MotionBox>
    );
};

export default function LandingPage() {
    const navigate = useNavigate();
    const bgGradient = useColorModeValue(
        'linear(to-b, blue.50, white)',
        'linear(to-b, gray.900, gray.800)'
    );
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const highlightColor = useColorModeValue('blue.500', 'blue.300');


    return (
        <Box bgGradient={bgGradient} minH="100vh">
            <Container maxW="container.xl" pt={20} pb={20}>
                {/* Hero Section */}
                <MotionFlex
                    direction="column"
                    align="center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <VStack spacing={8} textAlign="center" mb={16} mt={6}>
                        <Heading
                            size="5xl"
                            bgGradient="linear(to-r, blue.400, purple.500)"
                            bgClip="text"
                            lineHeight="1.2"
                            fontSize={{ base: "6xl", md: "7xl", lg: "8xl" }}

                        >
                            VitaScan
                            <Text fontSize="2xl" color={textColor}>
                                Powered by Gemini AI
                            </Text>
                        </Heading>

                        <Text
                            fontSize={{ base: "lg", md: "xl" }}
                            color={textColor}
                            maxW="800px"
                            px={4}
                        >
                            <Highlight
                                query={["Analyze", "Health"]}
                                styles={{ color: highlightColor, fontWeight: "bold" }}
                            >
                                Analyze Recipes, Empower Health with Advanced AI Technology for your Daily Macronutrients.
                            </Highlight>
                        </Text>


                            <Button
                                as={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                size="sm"
                                borderRadius="full"
                                colorScheme="blue"
                                fontSize="md"
                                h={12}
                                px={8}
                                onClick={() => navigate("/login")}
                                bgGradient="linear(to-r, blue.400, purple.500)"
                                _hover={{
                                    bgGradient: "linear(to-r, blue.500, purple.600)",
                                    boxShadow: "xl"
                                }}
                            >
                                Get Started Now
                            </Button>

                    </VStack>

                    {/* Features Grid */}
                    <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 4 }}
                        spacing={8}
                        w="full"
                        mt={8}
                    >
                        <Feature
                            icon={FaCamera}
                            title="Smart Detection"
                            description="Instantly analyze food items from your camera"
                        />
                        <Feature
                            icon={FaChartBar}
                            title="Nutritional Insights"
                            description="Get detailed macro and micronutrient breakdowns for better dietary choices"
                        />
                        <Feature
                            icon={FaShieldAlt}
                            title="Secure Platform"
                            description="Your data is protected with enterprise-grade security measures"
                        />
                        <Feature
                            icon={FaRobot}
                            title="AI Powered"
                            description="Leveraging Gemini AI for accurate and reliable analysis"
                        />
                    </SimpleGrid>

                    {/* Call to Action */}
                    <Box
                        mt={20}
                        p={8}
                        borderRadius="2xl"
                        bg={useColorModeValue('blue.50', 'gray.700')}
                        textAlign="center"
                    >
                        <Heading size="lg" mb={4}>
                            Discover Your Recipe's True Nutritional Value
                        </Heading>
                        <Text fontSize="lg" mb={6} color={textColor}>
                            Join the community of food enthusiasts using AI-powered analysis to unlock the
                            macros and nutritional content of any recipe. From calories to protein,
                            get precise measurements instantly.

                        </Text>

                            <Button
                                colorScheme="blue"
                                size="lg"
                                borderRadius="full"
                                onClick={() => navigate("/register")}
                                _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: "lg",
                                }}
                            >
                                Start Your Journey
                            </Button>
                    </Box>
                </MotionFlex>
            </Container>
        </Box>
    );
}