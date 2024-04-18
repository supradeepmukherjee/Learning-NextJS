import dbConnect from "@/lib/dbConnect"
import UserModel, { Message } from "@/models/User"

export async function PUT(request: Request) {
    await dbConnect()
    try {
        const { uName, content } = await request.json()
        const user = await UserModel.findOne({ uName })
        if (!user) return Response.json({
            success: false,
            msg: 'User not found'
        },
            { status: 404 }
        )
        if (!user.isAcceptingMsg) return Response.json({
            success: false,
            msg: 'User doesn\'t accept msgs'
        },
            { status: 403 }
        )
        const newMsg = {
            content,
            createdAt: new Date()
        }
        user.msgs.push(newMsg as Message)
        await user.save()
        return Response.json({
            success: true,
            msg: 'Msg sent successfully'
        },
            { status: 200 }
        )
    } catch (err) {
        console.log('Error sending msg', err)
        return Response.json({
            success: false,
            msg: 'Error sending msg'
        },
            { status: 500 }
        )
    }
}