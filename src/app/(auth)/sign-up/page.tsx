/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { signupSchema } from '@/schemas/signUp'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDebounceCallback } from 'usehooks-ts'
import * as z from 'zod'

const page = () => {
  const [uName, setUname] = useState('')
  const [uNameMsg, setUNameMsg] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUname, 600)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      uName: '',
      email: '',
      password: ''
    }
  })
  useEffect(() => {
    const checkUnameUnique = async () => {
      if (uName) {
        setIsChecking(true)
        setUNameMsg('')
        try {
          const { data } = await axios.get(`/api/check-uname-unique?uName=${uName}`)
          setUNameMsg(data.msg)
        } catch (err) {
          console.log(err)
          const { response } = err as AxiosError<ApiResponse>
          setUNameMsg(response?.data.msg ?? 'Error checking username')
        } finally {
          setIsChecking(false)
        }
      }
    }
    checkUnameUnique()
  }, [uName])
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await axios.post<ApiResponse>(`/api/sign-up`, data)
      toast({
        title: 'Success',
        description: res.data.msg
      })
      router.replace(`/verify/${uName}`)
    } catch (err) {
      console.log(err)
      const { response } = err as AxiosError<ApiResponse>
      toast({
        title: 'Sign Up failed',
        description: response?.data.msg,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6 lg:text-5xl">
            Join Anonymous Messaging
          </h1>
          <p className="mb-4">
            Sign up to start anonymous messaging
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='uName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter Username'
                      onChange={e => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isChecking && <Loader className='animate-spin' />}
                  <p className={`text-sm ${uNameMsg === 'Username is available' ? 'text-green-600' : 'text-red-600'}`}>
                    test {uNameMsg}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter Email ID' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter Password' type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ?
                <>
                  <Loader className='mr-2 h-4 w-4 animate-spin' />Please wait...
                </>
                :
                'Sign Up'}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p>
            Already a Member?
            <Link href={'/sign-in'} className='text-blue-600 hover:text-blue-800 ml-1'>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page