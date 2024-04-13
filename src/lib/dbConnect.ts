import { connect } from "mongoose"

type ConnectionObject = { isConnected?: number }

const connection: ConnectionObject = {}

const dbConnect = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log('Already connected to DB')
        return
    }
    try {
        const db = await connect(process.env.MONGO_URI)
        connection.isConnected = db.connections[0].readyState
        console.log('Connected to DB')
    } catch (err) {
        console.log('Connection to DB failed', err)
        process.exit(1)
    }
}

export default dbConnect