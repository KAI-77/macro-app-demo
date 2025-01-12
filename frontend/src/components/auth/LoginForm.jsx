import { FormControl, Heading, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { VStack, Container, Box, FormLabel, Button, Input, Text, Link as ChakraLink } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
export default function LoginForm () {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

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
                }
            })

            const data= response.data

            if (response.status === 200) {
                localStorage.setItem('userToken', data.token);
                toast({
                    title: 'Login Successful',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                })
                navigate('/upload')
            } else {
            toast({
                title: "Error",
                description: error.response.data.message || 'Invalid credentials',
                status: 'error',
                duration: 3000,
                isClosable: true
            })    
               
            }

            
        } catch (error) {
            toast({
                title: "Error",
                description: error.response ? error.response.data.message : 'Network error, please try again',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        } finally {
            setIsLoading(false)
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
                         </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
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