import { Message } from '@/models/User'

export interface ApiResponse {
    success: boolean
    msg: string
    accept?: boolean
    msgs?: Array<Message>
}