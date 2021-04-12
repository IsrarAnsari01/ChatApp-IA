const date = new Date();
let currentHour = date.getHours();
let formatter = "AM"
if (date.getHours() > 12) {
    currentHour -= 12
    formatter = "PM"
}
let currentTimeIn12HrFormat = `${currentHour}:${date.getMinutes()}:${date.getSeconds()} ${formatter}`
const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    MessageValue: String,
    UserName: String,
    DeliverdTime: { type: String, default: currentTimeIn12HrFormat }
})


const MessageModel = new mongoose.model("Message", MessageSchema)



module.exports.saveMessage = (messageData) => {
    let messageDataComeFromUser = new MessageModel(messageData)
    return new Promise((res, rej) => {
        messageDataComeFromUser.save((err, doc) => {
            if (err) {
                rej(err)
                return
            }
            res(doc)
        })
    })
}
module.exports.getAllMessage = (query = {}) => {
    return new Promise((res, rej) => {
        MessageModel.find(query, (err, doc) => {
            if (err) {
                rej(err)
            } else {
                res(doc)
            }
        })
    })
}