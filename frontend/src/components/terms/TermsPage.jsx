import { Box, Heading, Text, VStack, Link } from '@chakra-ui/react';

export default function TermsPage () {
  return (
    <Box p={6} maxWidth="800px" mx="auto">
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg" textAlign="center" mb={4}>
          Terms and Conditions
        </Heading>

        <Text fontSize="md" textAlign="justify">
          Welcome to VitaScan. By using the application, you agree to the following terms and conditions. Please read them carefully.
        </Text>

        <VStack spacing={3} align="start" pl={4}>
          <Text>
            <strong>1. Acceptance of Terms</strong>: By using this app, you agree to be bound by these Terms. If you do not agree, please do not use the app.
          </Text>
          <Text>
            <strong>2. Usage Rules</strong>: You are responsible for the content you upload and agree not to upload content that is unlawful, harmful, or violates the rights of others.
          </Text>
          <Text>
            <strong>3. Authentication</strong>: Authentication is used to prevent misuse and ensure fair access for all users.
          </Text>
          <Text>
            <strong>4. Privacy</strong>: We value your privacy. Please read our Privacy Policy in the main page of the app
            to learn how your data is being handled.
          </Text>
          <Text>
            <strong>5. Limitation of Liability</strong>: We are not responsible for any damages or losses resulting from the use of our app.
          </Text>
          <Text>
            <strong>6. Changes to Terms</strong>: We may modify these terms at any time. Updated terms will be posted on this page.
          </Text>
          <Text>
            <strong>7. Contact Us</strong>: If you have any questions, please contact us at{' '}
            <Link href="mailto:umbongshan.dev@gmail.com" color="blue.500" _hover={{ textDecoration: 'underline' }}>
             umbongshan.dev@gmail.com
            </Link>.
          </Text>
        </VStack>

        
      </VStack>
    </Box>
  );
};

