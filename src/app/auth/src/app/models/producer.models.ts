import mongoose from "mongoose"

const producerModel = new mongoose.Schema({
    manager: { type: String, required: true },
    cnpj: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    corporateName: { type: String, required: true },
    isPhoneVerified: { type: Boolean, required: true, default: false },
    isEmailVerified: { type: Boolean, required: true, default: false },
    eventsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
})

export default mongoose.model("Producer", producerModel)

export interface ProducerType {
    id?: string
    manager: string
    cnpj: string
    email: string
    password: string | undefined
    phoneNumber: string
    corporateName: string
    isPhoneVerified: boolean
    isEmailVerified: boolean
}