import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
  useColorModeValue,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    // const resetPassword = {
    //   password: formData.password,
    //   confirmPassword: formData.confirmPassword,
    // }

    try {
      const response = await axios.post(
        `https://vitascan-backend.onrender.com/api/auth/reset-password/${token}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // const data = response.data;

      toast({
        title: "Success",
        description: "Password has been reset successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/login");
    } catch (error) {
      console.error("Reset Password Error:", error.response || error);
      if (error.response && error.response.data.errors) {
        if (Array.isArray(error.response.data.errors)) {
          setErrors(
            error.response.data.errors.reduce((acc, err) => {
              acc[err.path] = err.msg;
              return acc;
            }, {})
          );
        }
      } else if (error.response) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to reset password",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description:
            "No response from the server. Please check your connection",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")} py={12}>
      <Container maxW="md">
        <VStack spacing={8}>
          <Heading>Reset Password</Heading>
          <Box
            w="100%"
            bg={useColorModeValue("white", "gray.700")}
            p={8}
            borderRadius="lg"
            boxShadow="lg"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
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
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
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
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={isLoading}
                >
                  Reset Password
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
