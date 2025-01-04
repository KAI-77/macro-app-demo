import { FormControl, Heading, useToast } from "@chakra-ui/react";
import React, { useState } from "react";


import { useNavigate } from "react-router-dom";

export default function LoginForm () {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)


        try {
            const response = await axios.post('http://localhost:5000/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data= await response.json()

            if (response.ok) {
                localStorage.setItem('userToken', data.token);
                toast({
                    title: 'Login Successful',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                })
                navigate('/')
            } else {
                throw new Error(data.message || 'Invalid credentials')
            }




            
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
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
            </Box>









            </VStack>






















        </Container>





















    )




















}