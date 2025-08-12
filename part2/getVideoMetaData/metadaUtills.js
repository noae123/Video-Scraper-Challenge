import Ffmpeg from "fluent-ffmpeg";
import { downloadVideo, findEmbdedVideoUrl } from "../downloadVideo.js";

export async function creatVideoObject(item, videoPath){
    const videoObject = {
        videoTitle: getVideoTitle(item),
        publicationDate: item['datePublished'] ? item['datePublished'] : item['uploadDate'],
        author: findAuther(item),
    }

    //const categories = need todo because it's not on the video
    const { duration, resolution } = await getVideoInfo(videoPath);
    videoObject.duration = duration;
    videoObject.resolution = resolution;
    return videoObject
}

export async function downloadVideoObject(item){
    const videoTitle = getVideoTitle(item);
    const videoUrl = item['contentUrl']
    return await downloadVideo(videoUrl, videoTitle);
}

export async function downloadNewsArticle(item){
    const videoTitle = getVideoTitle(item);
    const videoUrl = await findEmbdedVideoUrl(item['video']['embedUrl']);
    return await downloadVideo(videoUrl, videoTitle);
}

export async function getVideoInfo(filePath) {
        return new Promise((resolve, reject) => {
            Ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) return reject(err);
                const duration = getDurationFromSeconds(metadata.format.duration);
                const streams = metadata.streams.filter(s => s.codec_type === 'video');
                const resolution = streams.length > 0 ? `${streams[0].width}x${streams[0].height}` : 'unknown';
                resolve({ duration, resolution });
            });
        });
}

export function getDurationFromSeconds(seconds) {
    const totalSeconds = Math.floor(seconds);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secondsLeft = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secondsLeft}`;
}

export function getVideoTitle(item){
    return item['name'] ? item['name'] : item['video']['name'];
}

export function findAuther(item) {
    if (item['author']) {
        if(item['author']['name']){
            return item['author']['name']
        } else if (item['author'].length > 0){
            return item['author'][0]['name'];
        }
    } else if (item['publisher']) {
        return item['publisher']['name'];
    }
    else if(item['mainEntityOfPage']) {
        return item['mainEntityOfPage']['publisher']['name'];
    }
}

