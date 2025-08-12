import { getVideoMetadata } from './getVideoMetaData/getVideoMetadata.js';

export function findLdJson(html){
    const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi; // iknow this is not the best practice since this part in other realiable sites might have unwanted text
    const matches = [...html.matchAll(regex)];

    if (!matches) {
       throw new Error("no ld json were found!");
    }

    return matches;
}

export async function findVideoItem(matches){
    for (let i = 0; i < matches.length; i++) {
        let data = matches[i][1];

        try {
            const jsonData = JSON.parse(data);

            const items = Array.isArray(jsonData) ? jsonData : [jsonData];

            const videoObjectPromise = await Promise.allSettled(items.map(getVideoMetadata));
            const videoObject = (videoObjectPromise.filter(p => p.status === 'fulfilled').map(r => r.value));

            if (videoObject.length > 0){
                return videoObject;
            }

        } catch (e) {
            throw new Error("no VideoObject items were found nor NewsArticle with video");
        }
    }
}