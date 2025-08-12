import { getVideoMetadata } from './getVideoMetadata.js';

export async function extractVideoMetadataFromHTML(html) {
    const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const matches = [...html.matchAll(regex)];

    if (!matches) {
        return 'could not find any JSON-LD script tags';
    }

    for (let i = 0; i < matches.length; i++) {
        let data = matches[i][1];

        try {
            const jsonData = JSON.parse(data);

            const items = Array.isArray(jsonData) ? jsonData : [jsonData];

            for (const item of items) {
                if ((item['@type'] === 'VideoObject') || (item['@type'] === 'NewsArticle' && item.hasOwnProperty('video'))) {
                    return await getVideoMetadata(item, item['@type']);
                }
            }
        } catch (e) {
            continue;
        }
    }
};