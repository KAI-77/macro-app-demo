import React from "react";
import { Link } from "react-router-dom";
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
    DrawerCloseButton,
    useDisclosure,
    VStack,
    HStack,
    
} from "@chakra-ui/react";
import { FaSun, FaMoon, FaBars, FaHome, FaInfoCircle, FaCameraRetro } from "react-icons/fa";
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
    const bg = useColorModeValue("white", "gray.800");
    const color = useColorModeValue("gray.600", "white");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    return (
        <Box 
            as="nav" 
            bg={bg} 
            boxShadow="sm"
            position="sticky"
            top="0"
            zIndex="sticky"
            borderBottom="1px"
            borderColor={borderColor}
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
                                    color="blue.500"
                                >
                                    AI Powered- VitaScan
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
                                color={color}
                                _hover={{ color: "blue.500" }}
                            >
                                Home
                            </Button>
                        </Link>
                        <Link to="/info">
                            <Button
                                leftIcon={<FaInfoCircle />}
                                variant="ghost"
                                color={color}
                                _hover={{ color: "blue.500" }}
                            >
                                Guide
                            </Button>
                        </Link>
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
                                Guide to use the app
                            </MotionButton>
                        </Link>
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
            </DrawerContent>
        </Drawer>
                </Flex>
            </Container>
        </Box>
    );
}