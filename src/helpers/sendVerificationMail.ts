import { resend } from "@/lib/resend"
import { ApiResponse } from "@/types/ApiResponse"
import Verification from "../../emails/Verification"

const sendVerificationMail = async (
    mail: string,
    username: string,
    otp: string
): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: `onboarding@resend.dev`,
            to: mail,
            subject: 'Verification Code to complete Registration',
            react: Verification({ username, otp })
        })
        return { success: true, msg: 'Verification email Sent' }
    } catch (err) {
        console.log('Error sending verification email', err)
        return { success: false, msg: 'Failed to send verification email' }
    }
}

export default sendVerificationMail