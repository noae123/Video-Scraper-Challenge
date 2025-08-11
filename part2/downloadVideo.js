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
    } else{
        console.error('Unsupported video format. Only .mp4 and .m3u8 are supported.');
        return;
    }
}
