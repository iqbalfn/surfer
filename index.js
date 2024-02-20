const puppeteer = require('puppeteer-core')
const { KnownDevices } = require('puppeteer-core')
const { exec } = require('child_process')
const config = require('./config.js')
const fs = require('node:fs/promises')

const Finder = {
    device: {
        get() {
            return new Promise(res => {
                let devices = []
                for (let k in KnownDevices) {
                    if (!k.includes('landscape'))
                        devices.push(k)
                }

                devices.sort(e => Math.random() - .5)

                res(KnownDevices[devices[0]])
            })
        }
    },
    chrome: {
        bin() {
            return new Promise((res,rej) => {
                if (config.chrome.bin)
                    return res(config.chrome.bin)

                exec('which google-chrome', (e, bin) => {
                    bin = bin.trim()
                    if (!bin)
                        return rej('Can\'t find installed google chrome binary')

                    res(bin)
                })
            })
        }
    }
}

class Surfer {
    constructor(id) {
        this.timeStart = Date.now()
        this.user = {id}

        // setTimeout(e => {
        //     this.browser.close()
        // }, 30000)
    }

    async setUserDevice() {
        if (!this.user.data)
            return await Finder.device.get()

        let file = this.user.data + '/device'

        try {
            let exists = await fs.access(file, fs.constants.R_OK)
        } catch (e) {
            let device = await Finder.device.get()
            fs.writeFile(file, JSON.stringify(device))
        }

        let device = await fs.readFile(file, { encoding: 'utf8' })
        this.user.device = JSON.parse(device)
    }

    async setUserData() {
        if (config.puppeteer.user.data)
            this.user.data = config.puppeteer.user.data + '/' + this.user.id

        if (!this.user.data)
            return

        try {
            let exists = await fs.access(this.user.data, fs.constants.R_OK)
        } catch (e) {
            await fs.mkdir(this.user.data)
        }
    }

    async start() {
        await this.setUserData()
        await this.setUserDevice()

        let opts = config.puppeteer.launch
        opts.executablePath = await Finder.chrome.bin()
        if (this.user.data)
            opts.userDataDir = this.user.data
        this.browser = await puppeteer.launch(opts)

        let pages = await this.browser.pages()
        this.page = pages[0]

        if (this.user.device)
            await this.page.emulate(this.user.device)

        this.page.goto('https://www.google.com/')
    }
}

let user = 'user-1'
let surf1 = new Surfer(user)
surf1.start()

// let surf2 = new Surfer()
// surf2.start()
