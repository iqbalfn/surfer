const Config = require('./Config.js')
const Logger = require('./Logger.js')

const Navigator = {
    closeSessionTimer(user) {
        let cnf = Config.navigator.session
        let time = Math.round(Math.random() * (cnf.max - cnf.min) + cnf.min)
        time = 14
        Logger.log(user.id, 'User.Browser.Timeout: ' + time + 's')
        setTimeout(u => {
            Logger.log(u.id, 'User.Browser.ExitRequest')
            u.requestClose = true
        }, time * 1000, user)
    },

    async firstPage(user) {
        let pages = Config.navigator.pages
        let page = pages[Math.floor(Math.random()*pages.length)]

        Logger.log(user.id, 'User.Browser.Goto: ' + page)
        user.page.goto(page)
        Navigator.nextPage(user)
    },

    async nextPage(user) {
        if (user.requestClose)
            return user.browser.close()

        let cnf = Config.navigator.inpage
        let selector = cnf.next.selector
        let timer = cnf.reading
        let time = Math.round(Math.random() * (timer.max - timer.min) + timer.min)
        time = 3

        Logger.log(user.id, 'User.Browser.Reading: ' + time + 's')

        await user.page.waitForSelector(selector)

        setTimeout(async (u) => {
            if (u.requestClose)
                return u.browser.close()

            let els = await u.page.$$(selector)
            let el = els[Math.floor(Math.random()*els.length)]

            Logger.log(user.id, 'User.Browser.Click')
            el.click()
            Navigator.nextPage(u)
        }, time * 1000, user)
    },

    navigate(user) {
        Navigator.closeSessionTimer(user)
        Navigator.firstPage(user)
    }
}

module.exports = Navigator
