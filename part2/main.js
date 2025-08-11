import { createWriteStream, writeFileSync } from 'fs';
import jsonld from 'jsonld';
import { CNN, MAKO, FOX_SPORT, CBS_SPORTS } from './consts.js';
import {extractVideoMetadataFromHTML} from './extractVideo.js';
import { downloadVideo } from './downloadVideo.js';

async function main(url) {
    const res = await fetch(url);
    const html = await res.text();
    const videoObject = await extractVideoMetadataFromHTML(html);

    const videoUrl = videoObject['contentUrl'] ? videoObject['contentUrl'] : videoObject['embedUrl'];
    const videoTitle = videoObject['name'];
    await downloadVideo(videoUrl, videoTitle);
    const publication_date = videoObject['datePublished'] ? videoObject['datePublished'] : videoObject['uploadDate'];
    //const categories = need todo because it's not on the video
    //const duration; //need to take the duration from the video
    const author = videoObject['author'] ? videoObject['author']['name'] : videoObject['publisher'] ? videoObject['publisher']['name'] : 'Unknown'; //if it's an article you need to find it in another way
    const resolution = videoObject['thumbnail'] ? videoObject['thumbnail']['width'] + 'x' + videoObject['thumbnail']['height'] : 'Unknown'; //need to take from the video if it's unknown
}

main(MAKO);