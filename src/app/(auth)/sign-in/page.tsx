/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { loginSchema } from '@/schemas/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true)
    const res = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: false
    })
    if (res?.error) {
      if (res.error === 'CredentialsSignin') {
        toast({
          title: 'Login failed',
          description: 'Incorrect username or password',
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Login failed',
          description: res.error,
          variant: 'destructive'
        })
      }
    }
    if (res?.url) {
      router.replace('/dashboard')
    }
    setIsSubmitting(false)
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6 lg:text-5xl">
            Anonymous Messaging
          </h1>
          <p className="mb-4">
            Sign in to message anonymously
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='identifier'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email/Username
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter Email ID/Username' />
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
                'Sign In'}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p>
            Not joined yet?
            <Link href={'/sign-up'} className='text-blue-600 hover:text-blue-800 ml-1'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page