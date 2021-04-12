const users = []
module.exports.setuser = function(user) {
    users.push(user);
}
module.exports.getuser = function() {
    return users;
}