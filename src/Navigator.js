const Config = require('./Config.js')
const Logger = require('./Logger.js')

const Navigator = {
    closeSessionTimer(user) {
        let cnf = Config.navigator.session
        let time = Math.round(Math.random() * (cnf.max - cnf.min) + cnf.min)
        // time = 14
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

    async nextPageHandler(user) {
        let cnf = Config.navigator.inpage

        if (user.requestClose)
            return user.browser.close()

        let clickables = []
        let selector = cnf.next.selector
        let host = cnf.next.host
        let elements = await user.page.$$(selector)

        if (!elements.length){
            Logger.log(user.id, 'User.Browser.Page.Selector: No node found')
            return Navigator.nextPage(user)
        }

        let element = elements[Math.floor(Math.random()*elements.length)]

        if (host) {
            let ehost = await user.page.evaluate(el => el.hostname, element)
            if (ehost != host){
                Logger.log(user.id, 'User.Browser.Page.Selector: Host not match')
                return Navigator.nextPage(user)
            }
        }

        let visible = await element.isVisible()
        if (!visible){
            Logger.log(user.id, 'User.Browser.Page.Selector: Element not visible')
            return Navigator.nextPage(user)
        }

        element.tap()
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

        try {
            await user.page.waitForSelector(selector)
        } catch(e) {
            Logger.log(user.id, 'User.Browser.Page.Selector: Selector timeout')
        }

        setTimeout(Navigator.nextPageHandler, time * 1000, user)
    },

    navigate(user) {
        Navigator.closeSessionTimer(user)
        Navigator.firstPage(user)
    }
}

module.exports = Navigator
