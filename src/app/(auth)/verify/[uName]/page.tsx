/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verify"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from 'zod'

const page = () => {
    const router = useRouter()
    const params = useParams<{ uName: string }>()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof verifySchema>>({ resolver: zodResolver(verifySchema) })
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const res = await axios.put('/api/verify-code', {
                uName: params.uName,
                code: data.code
            })
            toast({
                title: 'Success',
                description: res.data.msg
            })
            router.replace('/sign-in')
        } catch (err) {
            console.log(err)
            const { response } = err as AxiosError<ApiResponse>
            toast({
                title: 'Verification failed',
                description: response?.data.msg,
                variant: 'destructive'
            })
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-6 lg:text-5xl">
                        Verify your Account
                    </h1>
                    <p className="mb-4">
                        Enter the verification code sent to your Email ID
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Verification Code
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Code" {...field}  />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page