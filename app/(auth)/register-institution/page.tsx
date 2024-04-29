'use client'
import {
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  VStack
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { createClient } from "@/lib/supabase/client";

// const supabase = createClient()
const schema = yup.object().shape({
  institutionName: yup
    .string()
    .required('Institution name is required')
    .min(2, 'Institution name must be at least 2 characters'),
  institutionEmail: yup.string().email('Invalid email').required('Email is required'),
  institutionPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      'Must contain one uppercase, one number, and one symbol'
    )
})

export default function RegisterInstitutionPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const onSubmit = (formData: any) => {
    setIsLoading(true)
    console.log(formData)
    setIsLoading(false)
  }

  return (
    <VStack spacing={8} pb={8} maxW={'400px'} mx={'auto'}>
      <Center>
        <Text fontSize={'4xl'} fontWeight={'bold'}>
          Register Institution
        </Text>
      </Center>

      <VStack as={'form'} onSubmit={handleSubmit(onSubmit)} spacing={4} w={'100%'} noValidate>
        <FormControl isRequired>
          <FormLabel htmlFor='institutionName'>Institution Name</FormLabel>
          <Input id='institutionName' type={'text'} {...register('institutionName')} />
          <FormHelperText color={'red.500'} textAlign={'left'}>
            {errors.institutionName?.message}
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor='institutionEmail'>Email</FormLabel>
          <Input id='institutionEmail' type={'email'} {...register('institutionEmail')} />
          <FormHelperText color={'red.500'} textAlign={'left'}>
            {errors.institutionEmail?.message}
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor='institutionPassword'>Password</FormLabel>
          <Input id='institutionPassword' type={'password'} {...register('institutionPassword')} />
          <FormHelperText color={'red.500'} textAlign={'left'}>
            {errors.institutionPassword?.message}
          </FormHelperText>
        </FormControl>

        <Button type={'submit'} colorScheme={'teal'} w={'100%'} isLoading={isLoading}>
          Register
        </Button>
      </VStack>
    </VStack>
  )
}
