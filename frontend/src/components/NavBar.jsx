import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Flex, Text, Button } from "@chakra-ui/react";

export default function NavBar() {
    return (
       <Box as="nav" bg="white" boxShadow="sm">
        <Container maxW= "7xl" px= {{base: 4, sm: 6, lg: 8}}>
            <Flex justify= "space-between" h="16" align="center">
                <Flex align="center">
                    <Link to='/'>
                    <Text fontSize= "2xl"
                    fontWeight="bold"
                    color="blue.500"
                    >
                        AI Powered- VitaScan
                    </Text>
                    </Link>
                </Flex>
                <Flex align="center">
                    <Button colorScheme="blue"
                    size="md"
                    borderRadius="full">
                        Sign Up
                    </Button>
                </Flex>
            </Flex>
            <Flex>
                
            </Flex>
        </Container>

       </Box>
    )

























}