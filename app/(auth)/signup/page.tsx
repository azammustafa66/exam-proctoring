'use client'
import {
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Text,
  VStack
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      'Must contain one uppercase, one number, and one symbol'
    ),
  userType: yup
    .string()
    .required('Please select a user type')
    .test('is-selected', 'Please select a user type', (value) => {
      return value !== ''
    }),
  institutionName: yup
    .string()
    .required('Institution name is required')
    .min(2, 'Institution name must be at least 2 characters')
})

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })
  const [isLoading, setLoading] = useState<boolean>(false)

  const onSubmit = async (formData: any) => {
    setLoading(true)
    try {
      const { firstName, lastName, email, password, userType, institutionName } = formData
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password
      })
      if (signUpError) {
        throw signUpError
      }

      const { data: institutionData, error } = await supabase
        .from('institutions')
        .select('id')
        .eq('name', institutionName)

      if (error) {
        throw error
      }

      const { error: insertError } = await supabase.from(userType).insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          institution_id: institutionData?.[0]?.id || 1
        }
      ])

      if (insertError) {
        throw insertError
      }
    } catch (error: any) {
      console.error('Error signing up:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <VStack spacing={8} pb={8} maxW='400px' mx={'auto'}>
      <Center>
        <Text fontSize='5xl' fontWeight='bold'>
          Register
        </Text>
      </Center>

      <VStack as='form' onSubmit={handleSubmit(onSubmit)} spacing={4} w='100%' noValidate>
        <FormControl isRequired>
          <FormLabel htmlFor='firstName'>First Name</FormLabel>
          <Input id='firstName' type='text' {...register('firstName')} />
          <FormHelperText color='red.500' textAlign='left'>
            {errors.firstName?.message}
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor='lastName'>Last Name</FormLabel>
          <Input id='lastName' type='text' {...register('lastName')} />
          <FormHelperText color='red.500' textAlign='left'>
            {errors.lastName?.message}
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor='email'>Email</FormLabel>
          <Input id='email' type='email' {...register('email')} />
          <FormHelperText color='red.500' textAlign='left'>
            {errors.email?.message}
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input id='password' type='password' {...register('password')} />
          <FormHelperText color='red.500' textAlign='left'>
            {errors.password?.message}
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>User Type</FormLabel>
          <RadioGroup defaultValue='student' name='userType'>
            <HStack spacing={2} align='stretch'>
              <Radio value='student' {...register('userType')}>
                Student
              </Radio>
              <Radio value='proctor' {...register('userType')}>
                Proctor
              </Radio>
            </HStack>
          </RadioGroup>
          <FormHelperText color='red.500' textAlign='left'>
            {errors.userType?.message}
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor='institutionName'>Institution Name</FormLabel>
          <Input id='institutionName' type='text' {...register('institutionName')} />
          <FormHelperText color='red.500' textAlign='left'>
            {errors.institutionName?.message}
          </FormHelperText>
        </FormControl>

        <Button type='submit' colorScheme='teal' w='100%' isLoading={isLoading}>
          Sign Up
        </Button>

        <Link href={'/register-institution'} style={{ width: '100%' }}>
          <Button variant='solid' w='100%'>
            Register Institution
          </Button>
        </Link>
      </VStack>
    </VStack>
  )
}
