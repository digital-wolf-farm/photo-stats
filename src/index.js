import { config } from './config/config.js';
import { readExifData, writeFile } from './lib/fs.js';
import { summarizeData } from './lib/summary.js';

const outputDirectory = './output';
const photosSummary = {};

const extractExifData = async () => {
    const exifData = [];

    for (const directory of config.directories) {
        const data = await readExifData(directory);
        exifData.push({
            directory,
            data
        });
    }

    return exifData;
};

const summarize = async () => {
    const rawExifData = await extractExifData();
    await writeFile(outputDirectory, `${config.outputFileName}.raw`, rawExifData);
    const summary = summarizeData(rawExifData);
    await writeFile(outputDirectory, `${config.outputFileName}`, summary);
};

summarize();
