import { creatVideoObject, downloadVideoObject, downloadNewsArticle } from './metadaUtills.js';

export async function getVideoMetadata(item) {
    let videoPath;
    if ((item['@type'] === 'VideoObject')) {
        videoPath = await downloadVideoObject(item);
    }
    else if ((item['@type'] === 'NewsArticle' && item.hasOwnProperty('video'))){
        videoPath = await downloadNewsArticle(item);
    }

    if(!videoPath){
        throw new Error("no video");
    }

    const videoObject = await creatVideoObject(item, videoPath);

    return videoObject;
}



