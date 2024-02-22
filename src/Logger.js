const Logger = {
    log(user, string) {
        let time = (new Date()).toLocaleString()
        console.log(`[${time}] (${user}) ${string}`)
    }
}
module.exports = Logger
