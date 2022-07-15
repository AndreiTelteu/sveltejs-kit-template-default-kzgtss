import { ImagePool, encoders } from '@squoosh/lib';
import { cpus } from 'os';
import fs from 'fs/promises';
import fs2 from 'fs';
const imagePool = new ImagePool(cpus().length);
import https from 'https';
import http from 'http';
import path from 'path';

type EncoderKey = keyof typeof encoders | null;
type EncodeResult = {
    optionsUsed: object;
    binary: Uint8Array;
    extension: string;
    size: number;
} | null;

export async function get({ params }: any) {
    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': '*/*',
    };
    const fullPath = await downloadFile(params.query, params.url);
    const extension = String(path.extname(fullPath)).toLowerCase();
    
    let query = String(params.query || '').split('-')?.map(i => i.split('.'));
    let width = null;
    let height = null;
    let quality = null;
    query.map(i => {
        if (i[0] == 'w') width = parseInt(i[1]);
        if (i[0] == 'h') height = parseInt(i[1]);
        if (i[0] == 'q') quality = parseInt(i[1]);
    });
    
    const file = await fs.readFile(fullPath);
    const image = imagePool.ingestImage(file);
    let preprocessOptions: any = {};
    if (width !== null || height !== null) {
        preprocessOptions.resize = {};
        if (width !== null) preprocessOptions.resize.width = width;
        if (height !== null) preprocessOptions.resize.height = height;
        if (width !== null && height !== null) {
            preprocessOptions.resize.fitMethod = 'contain'; // 'stretch';
        }
    }
    await image.preprocess(preprocessOptions);
    let encodeOptions: any = {};
    let encoder: EncoderKey = null;
    if (extension == '.jpg' || extension == '.jpeg') {
        encoder = 'mozjpeg';
        encodeOptions[encoder] = {};
        headers['Content-Type'] = 'image/jpeg';
        if (quality != null) {
            encodeOptions[encoder].quality = quality;
        }
    }
    if (extension == '.png') {
        encoder = 'oxipng';
        encodeOptions[encoder] = {};
        headers['Content-Type'] = 'image/png';
        if (quality != null) {
            encodeOptions[encoder].level = Math.round(7 - (quality / 100) * 7);
        }
    }
    await image.encode(encodeOptions);
    let encodedResult: EncodeResult = null;
    if (encoder) {
        encodedResult = await (image.encodedWith as any)?.[encoder];
        if (encodedResult) {
            await fs.writeFile(fullPath, encodedResult.binary);
        }
    }
    
    if (!encodedResult) {
        throw new Error('Unable to convert');
    }
    return {
        headers,
        body: encodedResult.binary,
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
};
