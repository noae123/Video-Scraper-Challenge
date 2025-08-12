import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import fetch from 'node-fetch';

export async function downloadVideo(videoUrl, videoTitle) {
    const outputFile = videoTitle.concat('.mp4').replace(/[<>:"/\\|?*]/g, '').trim()

    if (videoUrl.endsWith('.mp4')) {
        const res = await fetch(videoUrl);
        const buffer = Buffer.from(await res.arrayBuffer());
        writeFileSync(outputFile, buffer);
    } else if (videoUrl.endsWith('.m3u8')) {
        const { spawn } = await import('child_process');
        const ffmpeg = spawn('ffmpeg', [
            '-i', videoUrl,
            '-c', 'copy',
            '-bsf:a', 'aac_adtstoasc',
            outputFile
        ]);

        ffmpeg.stdout.on('data', (data) => {
            console.log(`ffmpeg: ${data}`);
        });

        ffmpeg.stderr.on('data', (data) => {
            console.error(`ffmpeg error: ${data}`);
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                console.log(`Downloaded and converted to ${outputFile}`);
            } else {
                console.error(`ffmpeg exited with code ${code}`);
            }
        });

        return outputFile;
    } else{
        console.error('Unsupported video format. Only .mp4 and .m3u8 are supported.');
        return;
    }
}

export async function findEmbdedVideoUrl(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let m3u8Urls = [];

    page.on('request', request => {
        const reqUrl = request.url();
        console.log(`Request URL: ${reqUrl}`);
        if (reqUrl.includes('.m3u8')) {
            m3u8Urls.push(reqUrl);
        }
    });

    page.on('response', async response => {
        const resUrl = response.url();
        if (resUrl.includes('.m3u8')) {
            m3u8Urls.push(resUrl);
        }
    });

    await page.goto(url, { waitUntil: 'networkidle2' });

    await new Promise(resolve => setTimeout(resolve, 15000));

    if (m3u8Urls.length === 0) {
        console.log('No M3U8 URL found.');
    } else {
        let m3u8Url = m3u8Urls.filter(url => url.endsWith('master.m3u8'))[0];

        if (!m3u8Url) {        
            m3u8Url = m3u8Urls.filter(url => url.endsWith('.m3u8'))[0];
        }   
        return m3u8Url;
    }

    await browser.close();
}

