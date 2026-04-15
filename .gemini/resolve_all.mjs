import fs from 'fs';
import https from 'https';

const data = fs.readFileSync('c:/alt-formations/src/data/campus.js', 'utf8');
const links = [...data.matchAll(/mapLink:\s*"(.*?)"/g)].map(m => m[1]);

const getFinal = (u) => new Promise(r => {
    https.get(u, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            r(res.headers.location);
        } else {
            r(u);
        }
    }).on('error', () => r(u));
});

Promise.all(links.map(getFinal)).then(finals => {
    finals.forEach((f, i) => console.log(links[i] + " -> " + f));
});
