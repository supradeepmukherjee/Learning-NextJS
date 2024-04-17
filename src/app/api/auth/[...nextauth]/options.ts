import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },
            async authorize(credentials): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ]
                    })
                    if (!user) throw new Error('No user found with this email/username')
                    if (!user.isVerified) throw new Error('Please verify your account before logging in')
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) return user
                    else throw new Error('Incorrect Password')
                } catch (err: any) {
                    console.log(err)
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMsg = token.isAcceptingMsg
                session.user.uName = token.uName
            }
            return session
        },
        async jwt({ user, token }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMsg = user.isAcceptingMsg
                token.uName = user.uName
            }
            return token
        },
    },
    pages: { signIn: '/sign-in' },
    session: { strategy: 'jwt' },
    secret: process.env.NEXT_AUTH_SECRET,
}