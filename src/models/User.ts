import mongoose, { Schema, Document, models, Model, model } from "mongoose"

export interface Message extends Document {
    content: string
    createdAt: Date
}

export interface User extends Document {
    uName: string
    email: string
    password: string
    verifyCode: string
    verifyCodeExpiry: Date
    isVerified: boolean
    isAcceptingMsg: boolean
    msgs: Message[]
}

const MsgSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
})

const UserSchema: Schema<User> = new Schema({
    uName: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email ID is not valid']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verification Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verification Code Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMsg: {
        type: Boolean,
        default: true
    },
    msgs: [MsgSchema],
})

const UserModel = models.NextUser as Model<User> || model<User>('NextUser', UserSchema)

export default UserModel