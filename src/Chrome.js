const Config = require('./Config.js')
const proc = require('child_process')

const Chrome = {
    binary() {
        if (Config.chrome.bin)
            return Config.chrome.bin
        let bin

        try {
            bin = proc.execSync('which google-chrome', {encoding:'utf8'})
        } catch(e) {
            throw Error('Can\'t find installed google chrome binary')
        }

        return bin.trim()
    }
}

module.exports = Chrome
