const https = require('node:https')
const tcpp = require('tcp-ping')

const Proxy = {
    findEachProxy(proxies, cb) {
        if (!proxies.length)
            return cb(null)

        let proxy = proxies.shift()
        let prox = proxy.split(':')

        tcpp.probe(prox[0], prox[1], (e,success) => {
            if (success)
                return cb(proxy)

            Proxy.findEachProxy(proxies, cb)
        })
    },

    async findUsableProxy(proxies) {
        return new Promise(res => {
            Proxy.findEachProxy(proxies, res)
        })
    },

    async getAllProxies() {
        let url = 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=yes&anonymity=all'

        return new Promise(res => {
            let req = https.request(url, resp => {
                resp.setEncoding('utf8')
                resp.on('data', data => {
                    let lines = data.split("\r\n")
                    let result = []
                    lines.forEach(e => {
                        e = e.trim()
                        if (!e)
                            return

                        result.push(e)
                    })

                    res(result)
                })
            })

            req.end()
        })
    },

    async random() {
        let proxies = await Proxy.getAllProxies()
        let result = await Proxy.findUsableProxy(proxies)
        return result
    }
}

module.exports = Proxy
