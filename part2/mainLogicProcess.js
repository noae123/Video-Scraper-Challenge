import { findLdJson, findVideoItem } from './extractVideo.js';
import { fetchHtml } from './fetchHtml.js';

export async function getVideoObject(url) {
    const html = await fetchHtml(url);
    const matches = findLdJson(html);
    const videoObject = await findVideoItem(matches);

    return videoObject;
}