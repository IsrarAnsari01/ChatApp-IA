const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    Name: String,
    Email: { type: String, unique: true },
    Password: String,
    Date: { type: Date, default: new Date() }
})

const UserModel = new mongoose.model("Users", UserSchema)


module.exports.saveNewUser = function (userInfo) {
    let newUser = new UserModel(userInfo)
    return new Promise((resolve, reject) => {
        newUser.save((err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc)
            }
        })
    })
}

module.exports.loginUser = function (userInfo) { 
    return new Promise((resolve, reject) => {
        UserModel.findOne({Email: userInfo.Email}, (err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc)
            }
        })
    })
}