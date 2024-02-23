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
            Logger.log(user.id, 'Surfer.addUserListener.Closed')
            Surfer.users.forEach((e,i) => {
                if (e.id != user.id)
                    return

                Surfer.users.splice(i,1)
            })
        })
    },

    createNewUser() {
        let uid = UUID.v4()
        Logger.log(uid, 'Surfer.createNewUser')
        return uid
    },

    getNextUser() {
        if (!Config.user.data)
            return Surfer.createNewUser()

        let chance = Config.user.createChance
        let percent = Math.random() * 100
        if (percent < chance) {
            return Surfer.createNewUser()
        }

        let users = fs.readdirSync(Config.user.data)
        let usable = []

        this.users.forEach(e => {
            let index = users.indexOf(e.id)
            if (index > -1)
                users.splice(index,1)
        })

        if (!users.length)
            return Surfer.createNewUser()

        let index = Math.floor(Math.random() * users.length)
        let uid = users[index]
        Logger.log(uid, 'Surfer.getNextUser: ' + uid)
        return uid
    },

    async navigate() {
        // expected realtime
        let now = (new Date()).getHours()
        let realtime = Config.navigator.realtime[now] ?? 1

        if (Surfer.users.length >= realtime)
            return setTimeout(Surfer.navigate, 5000)

        Logger.log('MAIN', 'Surfer.navigate.Realtime: ' + Surfer.users.length + '/' + realtime)

        let userId = Surfer.getNextUser()
        let user = await User.get(userId)
        Surfer.addUserListener(user)
        Surfer.users.push(user)
        Navigator.navigate(user)

        setTimeout(Surfer.navigate, 5000)
    },

    async init() {
        Surfer.navigate()
    }
}

module.exports = Surfer
