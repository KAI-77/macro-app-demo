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

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password != formData.confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                status: 'error',
                duration: '3000',
                isClosable: true
            })
            return;
        }
        setIsLoading(true);

        try {
            const response = await axios.post('api/auth/register', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data= response.data

            if (response.ok) {
                localStorage.setItem('userToken', data.token);
                toast({
                    title: 'Account created.',
                    description: 'Successfully created your account',
                    status: "success",
                    duration: 3000,
                    isClosable: true
                });
                navigate('/')
            } else {
                throw new Error(data.message || 'Something went wrong')
            }




        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: error,
                duration: 3000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false)
        }

    };


    return  (
        <Container maxW= "container.sm" py={10}>
            <VStack spacing={8}>
                <Heading>
                    Create an account
                </Heading>
                <Box w="100%" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
                    <form onSubmit= {handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Name</FormLabel>
                                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name"/>
                               
                            </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                        <Input name= "email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email"/>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password"            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>
                                Confirm Password
                            </FormLabel>
                            <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password"            />
                        </FormControl>
                        <Button colorScheme="blue" width="100%" type="submit" isLoading={isLoading}>
                            Sign up
                        </Button>

                        </VStack>



                    </form>
                        <Text mt={6} fontSize="sm" className="text-gray-600" textAlign="center">
                            Already have an account?{'  '}
                            <ChakraLink as={Link} to="/login" color="blue.500" _hover={{ textDecoration: "underline"}}>
                                    Login
                            </ChakraLink>
                        </Text>
                </Box>

            </VStack>
        </Container>
            
        
    )

}