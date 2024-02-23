const path = require('node:path')
const fs = require('node:fs')

const puppeteer = require('puppeteer-core')

const Chrome = require('./Chrome.js')
const Config = require('./Config.js')
const Device = require('./Device.js')
const Logger = require('./Logger.js')
const Proxeh = require('./Proxy.js')
const Surfer = require('./Surfer.js')

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

        opts.ignoreHTTPSErrors = true

        if (!opts.args)
            opts.args = []
        // opts.args.push('--no-sandbox')
        // opts.args.push('--disabled-setupid-sandbox')
        // opts.args.push('--disable-features=site-per-process')

        // let proxy = await Proxeh.random()
        // if (proxy){
        //     Logger.log(this.id, 'User.initBrowser.setProxy: ' + proxy)
        //     opts.args.push(`--proxy-server=${proxy}`)
        // }

        Logger.log(this.id, 'User.initBrowser.Launch')
        this.browser = await puppeteer.launch(opts)

        let pages = await this.browser.pages()
        this.page = pages[0]
        this.page.setDefaultNavigationTimeout(0)
        if (this.device)
            await this.page.emulate(this.getDevice())
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
        Logger.log(this.id, 'User.setDevice: ' + dev.name)
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
