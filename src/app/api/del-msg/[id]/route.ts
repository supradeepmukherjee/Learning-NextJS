import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import { getServerSession, User } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect()
    try {
        const id = params.id
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if (!session || !user) return Response.json({
            success: false,
            msg: 'Not Authenticated'
        },
            { status: 401 }
        )
        const updatedRes = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { msgs: { _id: id } } }
        )
        if (updatedRes.modifiedCount) return Response.json({
            success: false,
            msg: 'Message not found or already deleted'
        },
            { status: 404 }
        )
        return Response.json({
            success: true,
            msg: 'Message Deleted Successfully'
        },
            { status: 200 }
        )
    } catch (err) {
        console.log('Error Deleting Msg', err)
        return Response.json({
            success: false,
            msg: 'Failed to Delete Message'
        },
            { status: 500 }
        )
    }
}