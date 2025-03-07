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
    useToast, MenuButton, MenuItem, MenuList, Menu, Divider

} from "@chakra-ui/react";
import {
    FaSun,
    FaMoon,
    FaBars,
    FaHome,
    FaInfoCircle,
    FaCameraRetro,
    FaExpeditedssl,
    FaDoorOpen,
    FaChevronDown
} from "react-icons/fa";
import { motion } from "framer-motion";
import {useAuth} from "../context/AuthContext.jsx";
import {
    HiMiniUserCircle,
    HiOutlineArrowLeftEndOnRectangle, HiOutlineArrowRightEndOnRectangle,
    HiOutlineCamera, HiOutlineHome
} from "react-icons/hi2";
import {HiOutlineBookOpen} from "react-icons/hi";

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
    const bgColor = useColorModeValue("gray.100", "gray.900");
    const textColor = useColorModeValue("gray.800", "FAFAFA");
    const borderColor = useColorModeValue("gray.200", "#27272A");
    const navigate = useNavigate();
    const toast = useToast();
    const {user, logout, login} = useAuth();
    const bgGradient = useColorModeValue(
        'linear(to-b, blue.50, white)',
        'linear(to-b, gray.900, gray.800)'
    );

    return (
        <Box
            as="nav"
            position="sticky" // Change from -webkit-sticky to fixed
            top="0"
            left="0"
            right="0"
            boxShadow="sm"
            zIndex="dropdown"
            backdropFilter="blur(10px)"
            bgGradient={bgGradient}
            transition="all 0.3s"

        >
            <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
                <Flex justify="space-between" h="16" align="center">
                    {/* Logo and Brand */}
                    <Flex align="center">
                        <Link to="/upload">
                            <HStack spacing={2}>
                                <Box as={HiOutlineCamera} size="24px" color="blue.500" />
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

                        {!user && (
                            <Link to="/">
                                <Button
                                    leftIcon={<HiOutlineHome size={22} />}
                                    variant="ghost"
                                    color={textColor}
                                    _hover={{ color: "blue.500" }}
                                >
                                    Home
                                </Button>
                            </Link>
                        )}
                        {!user && (
                            <Link to="/info">
                                <Button
                                    leftIcon={<HiOutlineBookOpen size={23} />}
                                    variant="ghost"
                                    color={textColor}
                                    _hover={{ color: "blue.500" }}
                                >
                                    Guide
                                </Button>
                            </Link>
                        )}
                        { user ? (
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rightIcon={<HiMiniUserCircle  size={22}/>
                                    }
                                    fontSize="md"
                                    variant="ghost"
                                    color={textColor}
                                    _hover={{ color: "blue.500" }}
                                    >
                                    {user.name}
                                </MenuButton>
                                <Divider
                                    orientation="vertical"
                                    height="20px"
                                    borderColor={textColor}
                                    opacity={5}
                                    thickness="1px"
                                />
                                <MenuList>
                                    <MenuItem
                                        icon={<HiOutlineArrowLeftEndOnRectangle size={22}/>}
                                        fontSize="md"
                                        fontWeight="medium"
                                        onClick={logout}
                                    >
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                ) : (
                    <Link to="/login">
                        <Button leftIcon={<HiOutlineArrowRightEndOnRectangle size={23}/>} variant="ghost" color={textColor} _hover={{ color: "blue.500" }} >
                            Login
                        </Button>
                    </Link>
                )}
                        
                        <IconButton
                            icon={colorMode === "light" ? <FaMoon size={20} /> : <FaSun size={20}/>}
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
                    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Menu</DrawerHeader>

                <DrawerBody>
                    { user && (
                        <Box mb={4} p={2} borderRadius="md" bg={useColorModeValue("gray.50", "gray.700")}>
                            <Text fontSize="md" fontWeight="medium">
                                Welcome! {user.name}
                            </Text>
                        </Box>
                    )}
                    <MotionVStack
                        spacing={4}
                        align="stretch"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {!user && (
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
                        )}
                        {!user && (
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
                <DrawerFooter
                    justifyContent="flex-start"
                >
                    { user ? (
                        <MotionButton variants={itemVariants} onClick={() => {
                            logout();
                            onClose();
                        }} leftIcon={<HiOutlineArrowLeftEndOnRectangle />} variant="ghost" color={textColor} _hover={{ color: "blue.500" }} w="full" justifyContent="flex-start">
                            Logout
                        </MotionButton>
                    ) : (
                        <Link to="/login" onClick={onClose}>
                            <MotionButton variants={itemVariants} leftIcon={<HiOutlineArrowRightEndOnRectangle size={23}/>} variant="ghost" color={textColor} _hover={{ color: "blue.500" }} w="full" justifyContent="flex-start">
                                Login
                            </MotionButton>
                        </Link>
                    )}
                </DrawerFooter>
            </DrawerContent>

        </Drawer>
                </Flex>
            </Container>
        </Box>
    );
}