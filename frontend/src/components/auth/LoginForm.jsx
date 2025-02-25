import { FormControl, Heading, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { VStack, Container, Box, FormLabel, Button, Input, Text, Link as ChakraLink } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {useAuth} from "../../context/AuthContext"

export default function LoginForm () {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()
    const {setUser} = useAuth()

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)


        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const {user, token, message} = response.data;

            if (response.status === 200) {
                localStorage.setItem('userToken', token);

                setUser(user);
                toast({
                    title: message || "Login successful",
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
                navigate('/upload');
            }

        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || "Please try again later.";

                if (status === 429) {
                    // Handle too many requests
                    toast({
                        title: "Too Many Requests",
                        description: message || "Please try again in 5 minutes.",
                        status: 'error',
                        duration: 5000,
                        isClosable: true
                    });
                } else if (status === 401) {
                    // Handle invalid credentials
                    toast({
                        title: "Invalid Credentials",
                        description: message || "Please check your email and password.",
                        status: 'error',
                        duration: 3000,
                        isClosable: true
                    });
                } else {
                    // Handle other errors
                    toast({
                        title: "Error",
                        description: message,
                        status: 'error',
                        duration: 3000,
                        isClosable: true
                    });
                }
            } else {
                // Handle network or unknown error
                toast({
                    title: "Network Error",
                    description: "Something went wrong. Please try again.",
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                });
            }
        } finally {
            setIsLoading(false);
        }

    }

        return (
        <Container maxW= "container.sm" py={10}>
            <VStack spacing={8}>
            <Heading>Login to your account</Heading>
            <Box w="100%" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email"  />
                            {errors.email && <Text color="red">{errors.email}</Text>}
                         </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
                            {errors.password && <Text color="red">{errors.password}</Text>}
                        </FormControl>
                        <Button colorScheme= "blue" width="100%" type="submit" isLoading={isLoading}>
                            Login
                        </Button>
                    </VStack>
                </form>
                        <Text mt={6} fontSize="sm" className="text-gray-600" textAlign="center">
                            Don't have an account? {'  '}
                        <ChakraLink as={Link} to="/register" color="blue.500" _hover={{ textDecoration: "underline" }}>
                            Sign up
                        </ChakraLink>

                        </Text>

                        <Text mt={4} fontSize="sm" textAlign="center" className="text-gray-600">
                            By using this app, you agree to the{'  '}
                        <ChakraLink as={Link} to="/terms" color="blue.500" _hover={{ textDecoration: "underline"}}>
                                Terms and Conditions
                            </ChakraLink>    
                        </Text>
            </Box>
            </VStack>
        </Container>





















    )




















}