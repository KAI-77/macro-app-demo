import {
  FormControl,
  Heading,
  IconButton,
  InputGroup,
  InputRightElement,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  VStack,
  Container,
  Box,
  FormLabel,
  Button,
  Input,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaGithub } from "react-icons/fa";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { setUser, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, blue.50)",
    "linear(to-br, gray.900, blue.900)"
  );
  const boxBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const labelColor = useColorModeValue("gray.700", "gray.200");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const id = params.get("id");

    if (token && id) {
      console.log("OAuth Success");
      login(token, { id });

      toast({
        title: "OAuth login successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear token from URL and navigate to upload page
      navigate("/upload", { replace: true });
    }
  }, [navigate, setUser, toast]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://vitascan-backend.onrender.com/api/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { user, token, message } = response.data;

      if (response.status === 200) {
        localStorage.setItem("userToken", token);

        setUser(user);
        toast({
          title: message || "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/upload");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const status = error.response.status;

        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          setErrors(
            error.response.data.errors.reduce((acc, err) => {
              acc[err.path] = err.msg;
              return acc;
            }, {})
          );
        }

        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          "Invalid Credentials";

        if (status === 429) {
          // Handle too many requests
          toast({
            title: "Too Many Requests",
            description: message || "Please try again in 5 minutes.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else if (
          status === 401 ||
          (status === 400 &&
            error.response.data.message === "Invalid credentials")
        ) {
          // Handle invalid credentials
          toast({
            title: "Invalid Credentials",
            description: message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          // Handle other errors
          toast({
            title: "Error",
            description: message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        // Handle network or unknown error
        toast({
          title: "Network Error",
          description: "Something went wrong. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = () => {
    setIsGithubLoading(true);
    window.location.href = "https://vitascan-backend.onrender.com/auth/github";
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      py={12}
      px={4}
      className="bg-gradient-to-br"
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
              Welcome Back
            </Heading>
            <Text color={textColor} fontSize="md">
              Sign in to access your account
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
                    Email Address
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      bg={inputBg}
                      border="2px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      fontSize="md"
                      h="50px"
                      _hover={{
                        borderColor: useColorModeValue("gray.300", "gray.500"),
                      }}
                      _focus={{
                        borderColor: "blue.400",
                        bg: boxBg,
                        boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                      }}
                      transition="all 0.2s"
                    />
                  </InputGroup>
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
                      placeholder="Enter your password"
                      bg={inputBg}
                      border="2px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      fontSize="md"
                      h="50px"
                      _hover={{
                        borderColor: useColorModeValue("gray.300", "gray.500"),
                      }}
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
                  <Box textAlign="right" mt={2}>
                    <ChakraLink
                      as={Link}
                      to="/forgot-password"
                      color="blue.500"
                      fontSize="xs"
                      fontWeight="small"
                      _hover={{
                        color: "blue.600",
                        textDecoration: "underline",
                      }}
                    >
                      Forgot Password?
                    </ChakraLink>
                  </Box>
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
                  Sign In
                </Button>

                <Text
                  fontSize="sm"
                  color={textColor}
                  textAlign="center"
                  w="full"
                >
                  or continue with
                </Text>

                <Button
                  leftIcon={<FaGithub size={20} />}
                  variant="outline"
                  width="100%"
                  onClick={handleGithubLogin}
                  isLoading={isGithubLoading}
                  size="lg"
                  h="50px"
                  fontWeight="medium"
                  fontSize="md"
                  borderRadius="lg"
                  borderWidth="2px"
                  borderColor={borderColor}
                  color={labelColor}
                  bg={boxBg}
                  _hover={{
                    bg: inputBg,
                    borderColor: useColorModeValue("gray.300", "gray.500"),
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  _active={{
                    bg: "gray.100",
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s cubic-bezier(0.08, 0.52, 0.52, 1)"
                >
                  Sign in with Github
                </Button>
              </VStack>
            </form>

            <Box mt={8} textAlign="center">
              <Text fontSize="sm" color={textColor}>
                Don't have an account?{" "}
                <ChakraLink
                  as={Link}
                  to="/register"
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
                  Create an account
                </ChakraLink>
              </Text>

              <Text mt={4} fontSize="xs" color={textColor}>
                By using this app, you agree to the{" "}
                <ChakraLink
                  as={Link}
                  to="/terms"
                  color="blue.500"
                  fontWeight="medium"
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
                    bottom: "-1px",
                    width: "0%",
                    height: "1px",
                    bg: "blue.500",
                    transition: "width 0.3s ease",
                  }}
                  transition="color 0.2s ease"
                >
                  Terms and Conditions
                </ChakraLink>
              </Text>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
