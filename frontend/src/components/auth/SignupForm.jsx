import { Container, FormControl, FormLabel, VStack, Input, Box, Button, useToast, Heading, Text, Link as ChakraLink} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import {useNavigate, Link } from 'react-router-dom'

export default function SignupForm () {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast();
    const navigate = useNavigate()
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Submitting form data:', {
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
            confirmPassword: formData.confirmPassword
        };

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', registrationData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            if (response.status === 201) {
                localStorage.setItem('userToken', data.token);
                toast({
                    title: 'Account created.',
                    description: 'Successfully created your account',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error.response || error);

            if (error.response && error.response.data.errors){
                if (Array.isArray(error.response.data.errors)) {
                    setErrors(error.response.data.errors.reduce((acc, err) => {
                        acc[err.path] = err.msg; // Use 'path' instead of 'param'
                        return acc;
                    }, {}));
                }
            }
            else if (error.response) {
                const errorMessage = error.response.data.message;
                toast({
                    title: 'Error',
                    description: errorMessage || 'Registration failed',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } else if (error.request) {
                toast({
                    title: 'Error',
                    description: 'No response from server. Please check your connection.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to send request',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.sm" py={10}>
            <VStack spacing={8}>
                <Heading>
                    Create an account
                </Heading>
                <Box w="100%" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                />
                                {errors.name && <Text fontSize='xs' color="red">{errors.name}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="johndoe@example.com"
                                />
                                {errors.email && <Text fontSize='xs' color="red">{errors.email}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                />
                                {errors.password && <Text fontSize="xs" color="red">{errors.password}</Text>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>Confirm Password</FormLabel>
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && <Text fontSize='xs' color="red">{errors.confirmPassword}</Text>}
                            </FormControl>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                width="full"
                                isLoading={isLoading}
                            >
                                Sign Up
                            </Button>
                            <Text mt={0} fontSize="sm" className="text-gray-600" textAlign="center">
                                Already have an account? {'  '}
                                <ChakraLink as={Link} to="/login" color="blue.500" _hover={{ textDecoration: "underline" }}>
                                    Login
                                </ChakraLink>

                            </Text>
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </Container>
    );
}