const fs = require('node:fs')

const UUID = require('uuid')

const Config = require('./Config.js')
const Logger = require('./Logger.js')
const Navigator = require('./Navigator.js')
const User = require('./User.js')

const Surfer = {
    users: [],

    addUserListener(user) {
        user.browser.on('disconnected', () => {
            Logger.log(user.id, 'User.Browser.Closed')
            Surfer.users.forEach((e,i) => {
                if (e.id != user.id)
                    return

                Surfer.users.splice(i,1)
            })
        })
    },

    getNextUser() {
        if (!Config.user.data)
            return UUID.v4()

        let chance = Config.user.createChance
        let percent = Math.random() * 100
        if (percent < chance) {
            return UUID.v4()
        }

        let users = fs.readdirSync(Config.user.data)
        let usable = []

        this.users.forEach(e => {
            let index = users.indexOf(e.id)
            if (index > -1)
                users.splice(index,1)
        })

        if (!users.length)
            return UUID.v4()

        let index = Math.floor(Math.random() * users.length)
        return users[index]
    },

    async navigate() {
        setTimeout(Surfer.navigate, 3000)

        // expected realtime
        let now = (new Date()).getHours()
        let realtime = Config.navigator.realtime[now] ?? 1

        if (Surfer.users.length >= realtime)
            return

        let userId = Surfer.getNextUser()
        let user = await User.get(userId)
        Surfer.addUserListener(user)
        Surfer.users.push(user)
        Navigator.navigate(user)
    },

    init() {
        Surfer.navigate()
    }
}

module.exports = Surfer
