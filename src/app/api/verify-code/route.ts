import { z } from 'zod'
import { uNameValidation } from '@/schemas/signUp'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'

export async function PUT(request: Request) {
    await dbConnect()
    try {
        const { uName, code } = await request.json()
        const decodedUname = decodeURIComponent(uName)
        const user = await UserModel.findOne({ uName: decodedUname })
        if (!user) return Response.json({
            success: false,
            msg: 'User not found'
        },
            { status: 404 }
        )
        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date() > new Date(user.verifyCode)
        if (!isCodeValid) return Response.json({
            success: false,
            msg: 'Invalid OTP'
        },
            { status: 400 }
        )
        else if (isCodeExpired) return Response.json({
            success: false,
            msg: 'OTP has expired. Please signup again to get a new OTP'
        },
            { status: 400 }
        )
        else if (isCodeValid && !isCodeExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                msg: 'Verification Successful'
            },
                { status: 200 }
            )
        }
    } catch (err) {
        console.log('Error verifying user', err)
        return Response.json({
            success: false,
            msg: 'Error verifying user'
        },
            { status: 500 }
        )
    }
}