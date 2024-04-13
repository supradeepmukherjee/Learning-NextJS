import sendVerificationMail from "@/helpers/sendVerificationMail"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    await dbConnect()
    try {
        const { uName, email, password } = await req.json()
        const existingUserVerifiedByUname = await UserModel.findOne({ uName, isVerified: true })
        if (existingUserVerifiedByUname) return Response.json({
            success: false,
            msg: 'Username is already taken'
        }, { status: 400 })
        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) return Response.json({
                success: false,
                msg: 'User already exists with this Email ID'
            }, { status: 400 })
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const verifyCodeExpiry = new Date()
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)
            const newUser = await UserModel.create({ uName, email, password: hashedPassword, verifyCode, verifyCodeExpiry, msgs: [] })
        }
        const emailRes = await sendVerificationMail('', uName, verifyCode)
        if (!emailRes.success) return Response.json({
            success: false,
            msg: emailRes.msg
        }, { status: 500 })
        return Response.json({
            success: true,
            msg: 'User Registered. A verification code has been sent to your Email ID to verify it.'
        }, { status: 200 })
    } catch (err) {
        console.log('Error registering user', err)
        return Response.json({ success: false, msg: 'Registration failed' }, { status: 500 })
    }
}