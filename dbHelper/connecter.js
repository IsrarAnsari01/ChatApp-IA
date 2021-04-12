const mongoose = require("mongoose");
module.exports.getConnectionWithDb = function () {
    mongoose.connect("mongodb+srv://######:######@cluster0.e46ff.mongodb.net/chapApp?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;

    db.once("error", err => {
        if (err) {
            console.log("Error in Running DB ", err);
        }
    })
    db.once("open", () => {
        console.log("Connected to DB successfully")
    })


}
