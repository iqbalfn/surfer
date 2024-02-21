const User = require('./User.js')
const Proxy = require('./Proxy.js')

const Surfer = {
    async init() {
        await User.get('user-1')
        await User.get('user-2')
        await User.get('user-3')
        await User.get('user-4')
        await User.get('user-5')
    }
}

module.exports = Surfer
