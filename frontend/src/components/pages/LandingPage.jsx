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
  Highlight,
  Image,
  HStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaRobot, FaCamera, FaChartBar } from "react-icons/fa";
import { spacing, fontSizes } from "../../theme/constants";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Feature = ({ icon, title, description }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
        <Text fontWeight="bold" fontSize="xl">
          {title}
        </Text>
        <Text
          color={useColorModeValue("gray.600", "gray.400")}
          textAlign="center"
        >
          {description}
        </Text>
      </VStack>
    </MotionBox>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    "linear(to-b, blue.50, white)",
    "linear(to-b, gray.900, gray.800)"
  );
  const textColor = useColorModeValue("gray.600", "gray.300");
  const highlightColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Box bgGradient={bgGradient} minH="100vh">
      <Container
        maxW="container.xl"
        px={spacing.container}
        py={spacing.section}
      >
        <MotionFlex
          direction={{ base: "column", lg: "row" }}
          align={{ base: "center", lg: "flex-start" }}
          justify="space-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          gap={{ base: 8, lg: 12 }}
          pt={{ base: 0, lg: "4rem" }}
        >
          {/* Left Content */}
          <VStack
            spacing={spacing.stack}
            align={{ base: "center", lg: "start" }}
            textAlign={{ base: "center", lg: "left" }}
            flex="1"
            maxW={{ base: "100%", lg: "550px" }}
            mt={{ base: 0, lg: "-2rem" }}
          >
            <VStack spacing={3} align="inherit">
              <Heading
                fontSize={fontSizes.hero}
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
                lineHeight={1.1}
              >
                VitaScan
              </Heading>
              <Text
                fontSize={fontSizes.subheading}
                color={textColor}
                fontWeight="medium"
              >
                Powered by Gemini AI
              </Text>
            </VStack>

            <Text
              fontSize={fontSizes.body}
              color={textColor}
              maxW={{ base: "90%", md: "100%" }}
              lineHeight="tall"
            >
              <Highlight
                query={["Analyze", "Health"]}
                styles={{ color: highlightColor, fontWeight: "bold" }}
              >
                Analyze Recipes, Empower Health with Advanced AI Technology for
                your Daily Macronutrients.
              </Highlight>
            </Text>
            <HStack spacing={4} justify={{ base: "center", lg: "flex-start" }}>
              <Button
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                size="sm"
                height="50px"
                px="6"
                fontSize={fontSizes.body}
                borderRadius="full"
                bgGradient="linear(to-r, blue.400, purple.500)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, blue.500, purple.600)",
                  boxShadow: "md",
                }}
                onClick={() => navigate("/register")}
              >
                Get Started Now
              </Button>

              <Button
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                size="sm"
                height="50px"
                px="6"
                fontSize={fontSizes.body}
                borderRadius="full"
                bgGradient="linear(to-r, blue.400, purple.500)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, blue.500, purple.600)",
                  boxShadow: "md",
                }}
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
            </HStack>
          </VStack>

          {/* Right Content - Mobile Mockup */}
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            flex="1"
            display={{ base: "none", lg: "block" }}
            position="relative"
            mt={{ lg: "-11rem" }}
            alignSelf="center"
          >
            <Image
              src="/images/ip-14.png"
              alt="VitaScan Mobile App"
              w="auto"
              h={{ lg: "570px" }}
              objectFit="contain"
              mx="auto"
              filter={useColorModeValue("none", "brightness(0.9)")}
              _hover={{
                transform: "translateY(-8px)",
                transition: "transform 0.3s ease-in-out",
              }}
              position="relative"
              zIndex="1"
            />
          </Box>
        </MotionFlex>

        {/* Features Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={{ base: 6, md: 8 }}
          w="full"
          mt={spacing.section}
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
          mt={spacing.section}
          p={{ base: 6, md: 8, lg: 10 }}
          borderRadius="2xl"
          bg={useColorModeValue("blue.50", "gray.800")}
          textAlign="center"
          maxW="4xl"
          mx="auto"
        >
          <VStack spacing={6}>
            <Heading
              size="lg"
              lineHeight="tall"
              fontSize={fontSizes.subheading}
            >
              Discover Your Recipe's True Nutritional Value
            </Heading>
            <Text
              fontSize={fontSizes.body}
              color={textColor}
              maxW="2xl"
              lineHeight="tall"
            >
              Join the community of food enthusiasts using AI-powered analysis
              to unlock the macros and nutritional content of any recipe. From
              calories to protein, get precise measurements instantly.
            </Text>
            <Button
              size="lg"
              height="56px"
              px="8"
              fontSize={fontSizes.body}
              borderRadius="full"
              colorScheme="blue"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={() => navigate("/info")}
            >
              Application Guide
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
