import fs from 'fs';
import exif from 'exif';
import { config } from './config/config.js';

const stats = [];

const getStats = async () => {
    try {
        const files =  await getFilesList();
        await readFiles(files);
        await storeStatsInFile();
    } catch (error) {
        console.error(error);
    }
};

const getFilesList = async () => {
    const files = await fs.promises.readdir(config.directory);
    const jpegFiles = files.filter((file) => file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg'));
    console.log(`In directory: ${config.directory} found ${jpegFiles.length} JPG files`);

    return jpegFiles;
};

const readFiles = async (filesList) => {
    for (let file of filesList) {
        const exifData = await readFile(file);
        appendDataToStats(exifData);
    }
};

const readFile = async (fileName) => {
    const fileBuffer = await fs.promises.readFile(`${config.directory}\\${fileName}`);

    return new Promise((resolve, reject) => {
        new exif.ExifImage({ image: fileBuffer }, function (error, exifData) {
            if (error)
                reject(error);
            else
                resolve(exifData);
        });
    })
};

const appendDataToStats = (data) => {
    stats.push({
        lens: data.exif.LensModel,
        focalLength: data.exif.FocalLength,
        aperture: data.exif.FNumber,
        iso: data.exif.ISO,
        shutterSpeed: data.exif.ExposureTime
    });
};

const storeStatsInFile = async () => {
    await fs.promises.writeFile(`.\\output\\raw-stats.json`, JSON.stringify(stats, null, 4), { encoding: 'utf-8' });
};

getStats();
