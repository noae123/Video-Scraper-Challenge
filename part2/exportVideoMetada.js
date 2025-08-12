import { writeFileSync } from 'fs';

export function exportVideoMetadat(data) {
    writeFileSync('metadataVideos.json', JSON.stringify(data, null, 2), 'utf-8');
}
