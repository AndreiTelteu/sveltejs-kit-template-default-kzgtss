import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';
import fs from 'fs/promises';
import fs2 from 'fs';
const imagePool = new ImagePool(cpus().length);
import https from 'https';
import http from 'http';
import path from 'path';

export async function get({ params }: any) {
    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': 'application/json',
    };
    const fullPath = await downloadFile(params.query, params.url);
    
    const file = await fs.readFile(fullPath);
    const image = imagePool.ingestImage(file);
    await image.preprocess({
        resize: {
            width: 100,
            height: 50,
        },
    });
    const result = await image.encode({
        mozjpeg: {}, //an empty object means 'use default settings'
        jxl: {
            quality: 90,
        },
    });
    await imagePool.close();
    fs.writeFile(fullPath, (await image.encodedWith.mozjpeg).binary);
    
    return {
        headers,
        body: JSON.stringify({a: params}),
    };
};

const downloadFile = (query: string, url: string): Promise<string> => new Promise((resolve, reject) => {
    url = url.replace('https/', 'https://').replace('http/', 'http://');
    let parsed = new URL(url);
    let folder = path.sep + parsed.protocol.replace(':', '') + path.sep + parsed.hostname + path.dirname(parsed.pathname);
    let filename = path.basename(parsed.pathname);
    let root = path.resolve('.');
    let dir = [root, 'static', 'thumb', query + folder.replace(/\//g, path.sep)].join(path.sep);
    let fullPath = dir + path.sep + filename;
    mkdir(dir);
    const file = fs2.createWriteStream(fullPath);
    (parsed.protocol == 'https:' ? https : http).get(url, (response: any) => {
        const stream = response.pipe(file);
        stream.on("finish", () => {
            resolve(fullPath);
        });
    });
});

const mkdir = (folder: string) => {
    folder.split(path.sep).reduce(
        (directories, directory) => {
            directories += directory + path.sep;
            if (!fs2.existsSync(directories)) {
                fs2.mkdirSync(directories);
            }
            return directories;
        },
        '',
    );
}
