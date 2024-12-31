import React from "react";
import { Box,  Center,  Text, useColorModeValue } from "@chakra-ui/react";
export default function Footer() {

    return (
        <Box
        bg={useColorModeValue("gray.50", "gray.900")}
        color={useColorModeValue("gray.700", "gray.200")}
        
      >
         <Center>   
          <Text>© 2024 Nutriva. All rights reserved</Text>
          </Center>
         
      
     </Box>
    )



}