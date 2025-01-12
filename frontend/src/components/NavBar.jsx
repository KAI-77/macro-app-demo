import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Flex,
    Text,
    Button,
    IconButton,
    useColorMode,
    useColorModeValue,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerFooter,
    DrawerCloseButton,
    useDisclosure,
    VStack,
    HStack,
    useToast
    
} from "@chakra-ui/react";
import { FaSun, FaMoon, FaBars, FaHome, FaInfoCircle, FaCameraRetro, FaExpeditedssl, FaUserSecret, FaDoorOpen } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionVStack = motion(VStack);
const MotionButton = motion(Button);

const containerVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition  : {
            delayChildren: 0.3,
            staggerChildren: 0.1
    }

}}

const itemVariants = {
    hidden: {x: -20, opacity: 0},
    visible: {
        x: 0,
        opacity: 1
    }
}



export default function NavBar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    // const bg = useColorModeValue("white", "gray.800");
    // const color = useColorModeValue("gray.600", "white");
    // const borderColor = useColorModeValue("gray.200", "gray.700");
    const bgColor = useColorModeValue("gray.100", "gray.900");
    const textColor = useColorModeValue("gray.800", "FAFAFA");
    const borderColor = useColorModeValue("gray.200", "#27272A");
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('userToken');

        if (token) {
            setIsLoggedIn(true);
    } else {
            setIsLoggedIn(false);
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        toast({
            title: 'Logged out',
            status: 'success',
            duration: 3000,
            isClosable: true
        })
        navigate('/login');
     
    }

    return (
        <Box 
            as="nav" 
           
            boxShadow="sm"
            position="sticky"
            top="0"
            zIndex="sticky"
            borderBottom="1px"
            
        >
            <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
                <Flex justify="space-between" h="16" align="center">
                    {/* Logo and Brand */}
                    <Flex align="center">
                        <Link to="/">
                            <HStack spacing={2}>
                                <Box as={FaCameraRetro} size="24px" color="blue.500" />
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                    VitaScan
                                </Text>
                            </HStack>
                        </Link>
                    </Flex>

                    {/* Desktop Navigation */}
                    <HStack spacing={4} display={{ base: "none", md: "flex" }}>
                        <Link to="/">
                            <Button
                                leftIcon={<FaHome />}
                                variant="ghost"
                                color={textColor}
                                _hover={{ color: "blue.500" }}
                            >
                                Home
                            </Button>
                        </Link>
                        <Link to="/info">
                            <Button
                                leftIcon={<FaInfoCircle />}
                                variant="ghost"
                                color={textColor}
                                _hover={{ color: "blue.500" }}
                            >
                                Guide
                            </Button>
                        </Link>
                        {isLoggedIn ? (
                    <Button onClick={handleLogout} leftIcon={<FaDoorOpen />} variant="ghost" color="gray.700" _hover={{ color: "blue.500" }}>
                        Logout
                    </Button>
                ) : (
                    <Link to="/login">
                        <Button leftIcon={<FaExpeditedssl />} variant="ghost" color="gray.700" _hover={{ color: "blue.500" }}>
                            Login
                        </Button>
                    </Link>
                )}
                        
                        <IconButton
                            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            aria-label="Toggle color mode"
                        />
                    </HStack>

                    {/* Mobile Menu Button */}
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        onClick={onOpen}
                        icon={<FaBars />}
                        variant="ghost"
                        aria-label="Open menu"
                    />

                    {/* Mobile Menu Drawer */}
                    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Menu</DrawerHeader>

                <DrawerBody>
                    <MotionVStack
                        spacing={4}
                        align="stretch"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Link to="/" onClick={onClose}>
                            <MotionButton
                                variants={itemVariants}
                                leftIcon={<FaHome />}
                                variant="ghost"
                                w="full"
                                justifyContent="flex-start"
                            >
                                Home
                            </MotionButton>
                        </Link>
                        <Link to="/info" onClick={onClose}>
                            <MotionButton
                                variants={itemVariants}
                                leftIcon={<FaInfoCircle />}
                                variant="ghost"
                                w="full"
                                justifyContent="flex-start"
                            >
                                Guide
                            </MotionButton>
                        </Link>
                        {isLoggedIn ? (
                    <Button onClick={handleLogout} leftIcon={<FaDoorOpen />} variant="ghost" color="gray.700" _hover={{ color: "blue.500" }}>
                        Logout
                    </Button>
                ) : (
                    <Link to="/login">
                        <Button leftIcon={<FaExpeditedssl />} variant="ghost" color="gray.700" _hover={{ color: "blue.500" }}>
                            Login
                        </Button>
                    </Link>
                )}
                       
                        <MotionButton
                            variants={itemVariants}
                            leftIcon={colorMode === "light" ? <FaMoon /> : <FaSun />}
                            onClick={() => {
                                toggleColorMode();
                                onClose();
                            }}
                            variant="ghost"
                            w="full"
                            justifyContent="flex-start"
                        >
                            {colorMode === "light" ? "Dark Mode" : "Light Mode"}
                        </MotionButton>
                    </MotionVStack>
                </DrawerBody>
                        <DrawerFooter>
                            <MotionButton
                                variants={itemVariants}
                                leftIcon={<FaDoorOpen />}
                                variant="ghost"
                                w="full"
                                justifyContent="flex-start"
                                onClick={handleLogout}
                                >
                                    Logout
                            </MotionButton>

                            

                        </DrawerFooter>


            </DrawerContent>
        </Drawer>
                </Flex>
            </Container>
        </Box>
    );
}