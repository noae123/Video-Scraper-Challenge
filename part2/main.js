import { CNN, MAKO, FOX_SPORT, CBS_SPORTS } from './consts.js';
import { exportVideoMetadat } from './exportVideoMetada.js';
import { getVideoObject } from './mainLogicProcess.js';


async function main(urlList) {
    const videoObjects = await Promise.allSettled(urlList.map(getVideoObject));
    const videoMetaData = videoObjects.filter(p => p.status === 'fulfilled').map(r => r.value);
    console.error(videoObjects.filter(p=>p.status === 'rejected').map(r => r.reason));

    exportVideoMetadat(videoMetaData);
}

//todo make a clean up files
main([CNN, MAKO, FOX_SPORT, CBS_SPORTS]);