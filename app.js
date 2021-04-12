const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors")
const dbHelper = require("./dbHelper/connecter")
const app = express();
// const port = 8500;
const port = process.env.PORT || 8500
const dbUserHelper = require("./module/users/userModel")
const passwordEncryption = require("./module/encriptionPassword/EncryptionPassword")
const dbMessageHelper = require("./module/messegs/messageModel");
const { Socket } = require("socket.io");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.set('views', './view');
app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'Hello from secret Key',
    resave: false,
    saveUninitialized: true
}))
let userName;
app.get("/", (req, res) => {
    if (!req.session.isLoggedIn) {
        res.redirect("/login");
        return;
    }
    res.render("chat", { userName: userName });
})

app.get("/login", (req, res) => {
    res.render("login")
})
app.post("/login", (req, res) => {
    let savedUser = { Email: req.body.email, Password: req.body.password }
    passwordEncryption.EncryptionPassword(savedUser.Password)
        .then(EncryptedPassword => {
            savedUser.Password = EncryptedPassword
            return dbUserHelper.loginUser(savedUser)
                .then(success => {
                    res.render("chat", { userName: success.Name })
                    req.session.isLoggedIn = true
                })
                .catch(err => {
                    console.log("Error In finding user ", err)
                    res.redirect("/sign-in");
                })
        })
})
app.get("/sign-in", (req, res) => {
    res.render("signin");
})
app.post("/sign-in", (req, res) => {
    req.session.userName = req.body.fName
    let userData = { Name: req.body.fName, Email: req.body.email, Password: req.body.password };
    passwordEncryption.EncryptionPassword(userData.Password)
        .then(EncryptedPassword => {
            userData.Password = EncryptedPassword
            return dbUserHelper.saveNewUser(userData)
                .then(success => {
                    res.render("chat", { userName: req.session.userName })
                    req.session.isLoggedIn = true
                })
        })
        .catch(err => {
            console.log("SomeThing went Wrong please try Again", err)
        })
})
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login")
})

let server = app.listen(port, err => {
    if (err) {
        console.log("Server Running with " + err);
        return;
    }
    console.log("Server Running Successfully")
    dbHelper.getConnectionWithDb();
})
const socket = require("socket.io")(server)
socket.on("connection", (socket) => {
    console.log("Client Connected");
    socket.on("SEND_MSG_VALUE", data => {
        dbMessageHelper.saveMessage(data)
            .then(success => {
                socket.broadcast.emit("GET_ALL_MASSAGE", data);
            })
            .catch(err => {
                console.log("Unable to save Message in DB", err)
            })
    })
    socket.on("GET_ALL_MESSAGE_FROM_DB", data => {
        console.log("Refresh Req from ", data)
        dbMessageHelper.getAllMessage()
            .then(message => {
                socket.emit("Received_All_Messages_From_DB", message)
            }).catch(err => {
                console.log("Error in fetching messages", err)
            })
    })
})
