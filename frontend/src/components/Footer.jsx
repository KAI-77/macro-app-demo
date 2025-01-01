import React from "react";
import { Box,  Center,  Text, useColorModeValue } from "@chakra-ui/react";
export default function Footer() {


    const bgColor = useColorModeValue("gray.100", "09090B");
        const textColor = useColorModeValue("gray.900", "FAFAFA");
     

    return (
        <Box
        bg={bgColor}
        color={textColor}
        py={4}
        mt="auto"
        
      >
         <Center>   
          <Text fontSize="sm" fontStyle="italic">© 2025 VitaScan. All rights reserved.</Text>
          </Center>
         
      
     </Box>
    )



}