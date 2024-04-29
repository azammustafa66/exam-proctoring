'use client'
import {
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Button,
  FormHelperText
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { set, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      'Must contain one uppercase, one number, and one symbol'
    )
})

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      const { email, password } = data
      const { data: userData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.log(error)

      } else {
        console.log('Login successful:', userData)
        setIsLoading(false)
        redirect('/')
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <VStack spacing={8} p={4} maxW='400px' mx='auto'>
      <Center>
        <Text fontSize='5xl' fontWeight='bold'>
          Login
        </Text>
      </Center>

      <VStack as='form' onSubmit={handleSubmit(onSubmit)} spacing={4} w='100%' noValidate>
        <FormControl isRequired>
          <FormLabel htmlFor='email'>Email</FormLabel>
          <Input id='email' type='email' {...register('email')} />
          <FormHelperText color='red.500'>{errors.email?.message}</FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input id='password' type='password' {...register('password')} />
          <FormHelperText color='red.500'>{errors.password?.message}</FormHelperText>
        </FormControl>

        <Button type='submit' colorScheme='teal' w='100%' isLoading={isLoading}>
          Login
        </Button>
      </VStack>
    </VStack>
  )
}
