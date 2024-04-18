import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import { Types } from 'mongoose'
import { getServerSession, User } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"

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
        const id = new Types.ObjectId(user._id)
        const foundUser = await UserModel.aggregate([
            { $match: { _id: id } },
            { $unwind: '$msgs' },
            { $sort: { 'msgs.createdAt': -1 } },
            {
                $group: {
                    _id: '$_id',
                    msgs: { $push: '$msgs' }
                }
            }
        ])
        if (!foundUser || foundUser.length === 0) return Response.json({
            success: false,
            msg: 'User not found'
        },
            { status: 404 }
        )
        return Response.json({
            success: true,
            msgs: foundUser[0].msgs
        },
            { status: 200 }
        )
    } catch (err) {
        console.log('Error getting msgs', err)
        return Response.json({
            success: false,
            msg: 'Error getting msgs'
        },
            { status: 500 }
        )
    }
}