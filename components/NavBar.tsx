import React from 'react'
import { Box, Flex, Text, Button } from '@chakra-ui/react'
import Link from 'next/link'

export default function NavBar() {
  return (
    <Box as='nav' backgroundColor='teal.500' color='white' p={4}>
      <Flex justifyContent='space-between'>
        <Text fontSize='lg' fontWeight='bold'>
          FairPlay
        </Text>

        <Flex gap={2}>
          <Link href={'/login'}>
            <Button textColor={'white'} colorScheme='teal' variant='solid'>
              Log In
            </Button>
          </Link>
          <Link href={'/signup'}>
            <Button textColor={'white'} colorScheme='teal' variant='solid'>
              Sign Up
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Box>
  )
}
