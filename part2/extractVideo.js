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
            if (item['@type'] === 'VideoObject') {
                return item;
            }
            if (item['@type'] === 'NewsArticle' && item.hasOwnProperty('video')) {
                if (Array.isArray(item.video)) {
                const videoObj = item.video.find(v => v['@type'] === 'VideoObject');
                if (videoObj) return videoObj;
                } else if (item.video && item.video['@type'] === 'VideoObject') {
                return item.video;
                }
            }
            }
        } catch (e) {
            continue;
        }
    }
};