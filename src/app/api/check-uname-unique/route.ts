import { z } from 'zod'
import { uNameValidation } from '@/schemas/signUp'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'

const uNameQuerySchema = z.object({ uName: uNameValidation })

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = { uName: searchParams.get('uName') }
        const { success, error, data } = uNameQuerySchema.safeParse(queryParam)
        if (!success) {
            const uNameErrors = error.format().uName?._errors || []
            return Response.json({
                success: false,
                msg: uNameErrors.length > 0 ? uNameErrors.join(', ') : 'Invalid Query Parameters'
            },
                { status: 400 }
            )
        }
        const { uName } = data
        const existingVerifiedUser = await UserModel.findOne({ uName, isVerified: true })
        if (existingVerifiedUser) return Response.json({
            success: false,
            msg: 'Username is already taken'
        },
            { status: 400 }
        )
        return Response.json({
            success: true,
            msg: 'Username is available'
        },
            { status: 200 }
        )
    } catch (err) {
        console.log('Error Checking username', err)
        return Response.json({
            success: false,
            msg: 'Error Checking username'
        },
            { status: 500 }
        )
    }
}