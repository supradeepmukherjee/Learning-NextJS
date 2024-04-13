import { Message } from '@/models/User'

export interface ApiResponse {
    success: boolean
    msg: string
    isAcceptingMsgs?: boolean
    msgs?: Array<Message>
}