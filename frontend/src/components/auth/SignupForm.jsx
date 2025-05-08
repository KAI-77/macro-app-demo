import {
  Container,
  FormControl,
  FormLabel,
  VStack,
  Input,
  Box,
  Button,
  useToast,
  Heading,
  Text,
  Link as ChakraLink,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form data:", {
      name: formData.name,
      email: formData.email,
      password: formData.password.length, // log length only for security
    });

    setIsLoading(true);

    // Create a new object with only the required fields
    const registrationData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        registrationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (response.status === 201) {
        localStorage.setItem("userToken", data.token);
        toast({
          title: "Account created.",
          description: "Successfully created your account",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error.response || error);

      if (error.response){
        const status = error.response.status;
        const errorMessage = error.response.data.message;
      }

      if (error.response) {
    const status = error.response.status;
    const errorMessage = error.response.data.message;

    if (status === 409) {
      toast({
        title: "Registration Failed",
        description: errorMessage || "User already exists",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (error.response.data.errors) {
      // Handle validation errors
      setErrors(
        error.response.data.errors.reduce((acc, err) => {
          acc[err.path] = err.msg;
          return acc;
        }, {})
      );
    } else {
      toast({
        title: "Error",
        description: errorMessage || "Registration failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  } else if (error.request) {
    toast({
      title: "Connection Error",
      description: "No response from server. Please check your connection.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  } else {
    toast({
      title: "Error",
      description: "Failed to send request",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
    } finally {
      setIsLoading(false);
    }
  };

  // Add these color mode values
  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, blue.50)",
    "linear(to-br, gray.900, blue.900)"
  );
  const boxBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      py={12}
      px={4}
      bgGradient={bgGradient}
    >
      <Container maxW="md" py={8}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={2} textAlign="center">
            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="extrabold"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              letterSpacing="tight"
            >
              Create an Account
            </Heading>
            <Text color={textColor} fontSize="md">
              Join us to get started
            </Text>
          </VStack>

          <Box
            bg={boxBg}
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            boxShadow="xl"
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
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel
                    fontWeight="medium"
                    color={labelColor}
                    fontSize="sm"
                  >
                    Full Name
                  </FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    bg={inputBg}
                    border="2px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    fontSize="md"
                    h="50px"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "blue.400",
                      bg: boxBg,
                      boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                    }}
                    transition="all 0.2s"
                  />
                  {errors.name && (
                    <Text
                      fontSize="xs"
                      color="red.500"
                      mt={1}
                      fontWeight="medium"
                    >
                      {errors.name}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontWeight="medium"
                    color={labelColor}
                    fontSize="sm"
                  >
                    Email Address
                  </FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="johndoe@example.com"
                    bg={inputBg}
                    border="2px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    fontSize="md"
                    h="50px"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "blue.400",
                      bg: boxBg,
                      boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                    }}
                    transition="all 0.2s"
                  />
                  {errors.email && (
                    <Text
                      fontSize="xs"
                      color="red.500"
                      mt={1}
                      fontWeight="medium"
                    >
                      {errors.email}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontWeight="medium"
                    color={labelColor}
                    fontSize="sm"
                  >
                    Password
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      bg={inputBg}
                      border="2px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      fontSize="md"
                      h="50px"
                      _hover={{ borderColor: "gray.300" }}
                      _focus={{
                        borderColor: "blue.400",
                        bg: boxBg,
                        boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                      }}
                      transition="all 0.2s"
                    />
                    <InputRightElement h="50px" pr={2}>
                      <IconButton
                        aria-label={
                          showPassword ? "Hide Password" : "Show Password"
                        }
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword((prev) => !prev);
                        }}
                        variant="ghost"
                        color="gray.400"
                        _hover={{ color: "blue.500", bg: "transparent" }}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && (
                    <Text
                      fontSize="xs"
                      color="red.500"
                      mt={1}
                      fontWeight="medium"
                    >
                      {errors.password}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontWeight="medium"
                    color={labelColor}
                    fontSize="sm"
                  >
                    Confirm Password
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      bg={inputBg}
                      border="2px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      fontSize="md"
                      h="50px"
                      _hover={{ borderColor: "gray.300" }}
                      _focus={{
                        borderColor: "blue.400",
                        bg: boxBg,
                        boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                      }}
                      transition="all 0.2s"
                    />
                    <InputRightElement h="50px" pr={2}>
                      <IconButton
                        aria-label={
                          showConfirmPassword
                            ? "Hide Password"
                            : "Show Password"
                        }
                        icon={
                          showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setShowConfirmPassword((prev) => !prev);
                        }}
                        variant="ghost"
                        color="gray.400"
                        _hover={{ color: "blue.500", bg: "transparent" }}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.confirmPassword && (
                    <Text
                      fontSize="xs"
                      color="red.500"
                      mt={1}
                      fontWeight="medium"
                    >
                      {errors.confirmPassword}
                    </Text>
                  )}
                </FormControl>

                <Button
                  colorScheme="blue"
                  width="100%"
                  type="submit"
                  isLoading={isLoading}
                  size="lg"
                  h="50px"
                  fontWeight="semibold"
                  fontSize="md"
                  borderRadius="lg"
                  bgGradient="linear(to-r, blue.400, blue.500)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, blue.600)",
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  _active={{
                    bgGradient: "linear(to-r, blue.600, blue.700)",
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s cubic-bezier(0.08, 0.52, 0.52, 1)"
                  boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                >
                  Create Account
                </Button>

                <Box mt={4} textAlign="center">
                  <Text fontSize="sm" color={textColor}>
                    Already have an account?{" "}
                    <ChakraLink
                      as={Link}
                      to="/login"
                      color="blue.500"
                      fontWeight="semibold"
                      position="relative"
                      _hover={{
                        color: "blue.600",
                        _after: {
                          width: "100%",
                        },
                      }}
                      _after={{
                        content: '""',
                        position: "absolute",
                        left: 0,
                        bottom: "-2px",
                        width: "0%",
                        height: "2px",
                        bg: "blue.500",
                        transition: "width 0.3s ease",
                      }}
                      transition="color 0.2s ease"
                    >
                      Sign in
                    </ChakraLink>
                  </Text>
                </Box>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
