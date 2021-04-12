const bcrypt = require("bcrypt")

let userPassword;
function encryptedPwd(pwd) {
    userPassword = pwd;
}

module.exports.EncryptionPassword = (password) => {
    return new Promise((res, rej) => {
        bcrypt.genSalt(10, function (error, salt) {
            if(error) {
                throw(error)
            } else {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        console.log("Error in Encrypting Password", err);
                        rej(err);
                    }
                    encryptedPwd(hash);
                    res(userPassword)
                });
            }
        });
    })
}