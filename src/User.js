const path = require('node:path')
const fs = require('node:fs')

const puppeteer = require('puppeteer-core')

const Chrome = require('./Chrome.js')
const Config = require('./Config.js')
const Device = require('./Device.js')
const Proxeh = require('./Proxy.js')

class UserConstructor {
    constructor(id) {
        this.id = id
    }

    // user browser
    async initBrowser() {
        let opts = Config.puppeteer.launch
        opts.executablePath = Chrome.binary()
        if (this.datadir)
            opts.userDataDir = this.getDataDir()

        if (!opts.args)
            opts.args = []
        opts.args.push('--no-sandbox')
        opts.args.push('--disabled-setupid-sandbox')
        opts.args.push('--disable-features=site-per-process')

        // let proxy = await Proxeh.random()
        // if (proxy)
            // opts.args.push(`--proxy-server=${proxy}`)

        this.browser = await puppeteer.launch(opts)

        let pages = await this.browser.pages()
        this.page = pages[0]
        this.page.setDefaultNavigationTimeout(0)
        if (this.device)
            await this.page.emulate(this.getDevice())

        try {
            this.page.goto('https://whatismyipaddress.com/')
        } catch(e) {
            console.log(this.id + ' Is not work')
        }
    }

    // user data
    getDataDir(suffix) {
        if (!this.datadir)
            return

        if (!suffix)
            return this.datadir

        return path.join(this.datadir, suffix)
    }

    initDataDir() {
        if (!Config.user.data)
            return

        let dir = path.join(Config.user.data, this.id)
        this.setDataDir(dir)
    }

    setDataDir(dir) {
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir)

        this.datadir = dir
    }

    // user device
    initDevice() {
        let file = this.getDataDir('device')
        if (!file)
            return

        if (!fs.existsSync(file)) {
            let dev = Device.random()
            this.setDevice(dev, file)
        } else {
            let dev = fs.readFileSync(file)
            dev = JSON.parse(dev)
            this.setDevice(dev)
        }
    }

    getDevice() {
        return this.device
    }

    setDevice(dev, file) {
        this.device = dev

        if (file)
            fs.writeFileSync(file, JSON.stringify(dev))
    }
}

const User = {
    async get(id) {
        let user = new UserConstructor(id)
        user.initDataDir()
        user.initDevice()
        await user.initBrowser()

        return user
    }
}

module.exports = User
