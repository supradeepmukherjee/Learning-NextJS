/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import MsgCard from "@/components/MsgCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/models/User"
import { acceptMsgsSchema } from "@/schemas/acceptMsg"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const page = () => {
  const [msgs, setMsgs] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const { toast } = useToast()
  const handleDelMsg = (id: string) => setMsgs(msgs.filter(m => m._id !== id))
  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMsgsSchema)
  })
  const { register, watch, setValue } = form
  const accept = watch('accept')
  const fetchAcceptMsg = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const res = await axios.get<ApiResponse>(`/api/accept-msg`)
      setValue('accept', res.data.accept)
    } catch (err) {
      console.log(err)
      const { response } = err as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: response?.data?.msg || 'Failed to fetch message settings',
        variant: 'destructive'
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue, toast])
  const fetchMsgs = useCallback(async (refresh: boolean = false) => {
    setIsLoading(false)
    setIsSwitchLoading(false)//check
    try {
      const res = await axios.get<ApiResponse>('/api/get-msgs')
      setMsgs(res.data.msgs || [])
      if (refresh)
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest Messages',
        })
    } catch (err) {
      console.log(err)
      const { response } = err as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: response?.data?.msg || 'Failed to fetch Messages',
        variant: 'destructive'
      })
    } finally {
      setIsSwitchLoading(false)
      setIsLoading(false)
    }
  }, [toast])
  useEffect(() => {
    if (!session || !session.user) return
    fetchMsgs()
    fetchAcceptMsg()
  }, [session, setValue, fetchAcceptMsg, fetchMsgs])
  const switchChangeHandler = async () => {
    try {
      const res = await axios.post<ApiResponse>(`/api/accept-msg`, { accept: !accept })
      setValue('accept', !accept)
      toast({
        title: res.data.msg,
        // variant: 'default'
      })
    } catch (err) {
      console.log(err)
      const { response } = err as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: response?.data?.msg || 'Failed to change Message Settings',
        variant: 'destructive'
      })
    }
  }
  const { uName } = session?.user as User
  const profileUrl = `${window.location.protocol}//${window.location.host}/u/${uName}`
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: 'Copied',
      description: 'Profile Link has been copied to clipboard'
    })
  }
  if (!session || !session.user) return <div>Please Login first</div>
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded bg-white w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">
        User Dashboard
      </h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Copy your unique link
        </h2>
        <div className="flex items-center">
          <input type="text" disabled className="input w-full p-2 mr-2 " value={profileUrl} />
          <Button onClick={copyToClipboard}>
            Copy
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch
          {...register('accept')}
          checked={accept}
          onCheckedChange={switchChangeHandler}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {accept ? 'Yes' : 'No'}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant='outline'
        onClick={e => {
          e.preventDefault()
          fetchMsgs(true)
        }}
      >
        {isLoading ?
          <Loader className="h-4 w-4" />
          :
          <RefreshCcw className="h-4 w-4 animate-spin" />
        }
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {msgs.length > 0 ?
          msgs.map(m => (
            <MsgCard
              key={m._id}
              msg={m}
              onMsgDel={handleDelMsg}
            />
          ))
          :
          <p>
            No Messages to Display
          </p>
        }
      </div>
    </div>
  )
}

export default page