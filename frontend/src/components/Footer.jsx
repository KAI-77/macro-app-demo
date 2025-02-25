import React from "react";
import { Box,  Center,  Text, useColorModeValue } from "@chakra-ui/react";
export default function Footer() {


    const bgGradient = useColorModeValue(
        'linear(to-b, blue.50, white)',
        'linear(to-b, gray.900, gray.800)'
    );
        const textColor = useColorModeValue("gray.900", "FAFAFA");
     

    return (
        <Box
        bg={bgGradient}
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