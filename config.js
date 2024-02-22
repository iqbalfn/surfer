module.exports = {
    chrome: {
        // the binary path of the google-chrome
        bin: '/usr/bin/google-chrome'
    },
    puppeteer: {
        // forwarded puppeteer launch options
        launch: {
            headless: false
        }
    },
    user: {
        // all users datadir stored
        data: '/home/iqbal/Desktop/surfer',

        // percentage to randomize to create new user
        // on next browser or reuse exists user
        createChance: 30
    },
    navigator: {
        session: {
            min: 60,
            max: 300
        },
        pages: [
            'http://localhost/link/'
        ],
        inpage: {
            reading: {
                min: 5,
                max: 60
            },
            next: {
                selector: 'a'
            }
        },
        realtime: {
            // hour: total user
            1: 1,
            12: 5,
            13: 7,
            14: 2,
            16: 4
        }
    }
}
