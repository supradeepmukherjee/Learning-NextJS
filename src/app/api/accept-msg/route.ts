import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import { getServerSession, User } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"

export async function PUT(request: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if (!session || !user) return Response.json({
            success: false,
            msg: 'Not Authenticated'
        },
            { status: 401 }
        )
        const { _id } = user
        const { accept } = await request.json()
        const updatedUser = await UserModel.findByIdAndUpdate(
            _id,
            { isAcceptingMsg: accept },
            { new: true }
        )
        if (!updatedUser) return Response.json({
            success: false,
            msg: 'User not found'
        },
            { status: 404 }
        )
        return Response.json({
            success: true,
            msg: 'Msg acceptance status updated successfully',
            updatedUser
        },
            { status: 200 }
        )
    } catch (err) {
        console.log('Failed to update user to accept msgs', err)
        return Response.json({
            success: false,
            msg: 'Failed to update user to accept msgs'
        },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if (!session || !user) return Response.json({
            success: false,
            msg: 'Not Authenticated'
        },
            { status: 401 }
        )
        const { _id } = user
        const foundUser = await UserModel.findById(_id)
        if (!foundUser) return Response.json({
            success: false,
            msg: 'User not found'
        },
            { status: 404 }
        )
        return Response.json({
            success: true,
            accept: foundUser.isAcceptingMsg
        },
            { status: 200 }
        )
    } catch (err) {
        console.log('Error in getting msg acceptance status', err)
        return Response.json({
            success: false,
            msg: 'Error in getting msg acceptance status'
        },
            { status: 500 }
        )
    }
}