import { downloadVideo } from "./downloadVideo.js";

export async function getVideoMetadata(item, itemType) {
    const videoTitle = item['name'];
    let videoPath;

    if (itemType === 'VideoObject') {
        const videoUrl = item['contentUrl']
        videoPath = await downloadVideo(videoUrl, videoTitle);
    } else if (itemType === 'NewsArticle' && item.hasOwnProperty('video')) {
        const videoUrl = findEmbdedVideoUrl(item['video']['embedUrl']);
        videoPath = await downloadVideo(videoUrl, videoTitle);
    }
    else{
        console.error('Unsupported video type. Only VideoObject and NewsArticle with video are supported.');
        return;
    }

    const videoObject = {
        title: videoTitle,
        publicationDate: item['datePublished'] ? item['datePublished'] : item['uploadDate'],
        author: findAuther(item),
    }

    console.log(`Video Title: ${videoObject.title}`);

    //const categories = need todo because it's not on the video
    //const duration; //need to take the duration from the video
    //const resolution = //need to take from the video if it's unknown
}

function findAuther(item) {
    if (item['author']) {
        return item['author']['name'];
    } else if (item['publisher']) {
        return item['publisher']['name'];
    }
    else if(item['mainEntityOfPage']) {
        return item['mainEntityOfPage']['publisher']['name'];
    }
}