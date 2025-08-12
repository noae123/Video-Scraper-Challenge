import { CNN, MAKO, FOX_SPORT, CBS_SPORTS } from './consts.js';
import {extractVideoMetadataFromHTML} from './extractVideo.js';

async function main(url) {
    const res = await fetch(url);
    const html = await res.text();
    const videoObject = await extractVideoMetadataFromHTML(html);
}

main(FOX_SPORT);