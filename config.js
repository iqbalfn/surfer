module.exports = {
    chrome: {
        // the binary path of the google-chrome
        bin: '/usr/bin/google-chrome'
    },
    puppeteer: {
        // forwarded puppeteer launch options
        launch: {
            headless: true
        }
    },
    user: {
        // all users datadir stored
        data: '/home/iqbal/Http/iq/puppeteer/surfer/data',

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
            'https://filmsemi.club/'
        ],
        inpage: {
            firstPage: {
                referer: 'https://www.google.com/'
            },
            reading: {
                min: 5,
                max: 60
            },
            next: {
                // element to tap to go to next page
                selector: 'a.thumb',

                // filter the link with this host only
                host: 'filmsemi.club'
            }
        },
        realtime: {
            // hour: total user
            1: 1,
            12: 5,
            13: 7,
            14: 2,
            16: 4,
            21: 50,
            23: 25
        }
    }
}
