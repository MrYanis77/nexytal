const https = require('https');

function getFinalUrl(shortUrl) {
    return new Promise((resolve, reject) => {
        https.get(shortUrl, (res) => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                resolve(res.headers.location);
            } else {
                resolve(shortUrl);
            }
        }).on('error', reject);
    });
}

async function main() {
    const urls = [
        "https://maps.app.goo.gl/2BL4KnpHoajwjoNK6",
        "https://maps.app.goo.gl/BMGk5inFgGBsmPfR9"
    ];
    for (const u of urls) {
        console.log(await getFinalUrl(u));
    }
}
main();
