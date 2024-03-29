const { KnownDevices } = require('puppeteer-core')

const Device = {
    random() {
        let devices = []
        for (let k in KnownDevices) {
            if (k.includes('landscape'))
                continue
            if (k.includes('Kindle'))
                continue
            devices.push(k)
        }

        devices.sort(e => Math.random() - .5)

        return KnownDevices[devices[0]]
    }
}

module.exports = Device
