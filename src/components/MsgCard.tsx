import { Message } from "@/models/User"
import { ApiResponse } from "@/types/ApiResponse"
import axios from "axios"
import { X } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { useToast } from "./ui/use-toast"

type MsgCardProps = {
  msg: Message,
  onMsgDel: (id: string) => void
}

const MsgCard = ({ msg, onMsgDel }: MsgCardProps) => {
  const { toast } = useToast()
  const delConfirmHandler = async () => {
    const res = await axios.delete<ApiResponse>(`/api/del-msg/${msg._id}`)
    toast({
      title: res.data.msg,
    })
    onMsgDel(msg._id)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>

        </CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action can&apos;t be undone. This will permanently delete your account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={delConfirmHandler}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardDescription>

        </CardDescription>
      </CardHeader>
      <CardContent>
        <p></p>
      </CardContent>
    </Card>
  )
}

export default MsgCard