import fs from 'fs';
import exif from 'exif';

const readFileExtensions = ['jpeg', 'jpg'];

const extractExifData = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        new exif.ExifImage({ image: fileBuffer }, function (error, exifData) {
            if (error)
                reject(error);
            else
                resolve(exifData);
        });
    });
};

const readExifData = async (directory) => {
    const filesList = await getFilesList(directory);
    const exifDataList = [];

    for (const file of filesList) {
        const fileBuffer = await readFile(directory, file);
        const exifData = await extractExifData(fileBuffer);

        exifDataList.push({
            lens: exifData.exif.LensModel,
            focalLength: exifData.exif.FocalLength,
            aperture: exifData.exif.FNumber
        });
    };

    return exifDataList;
};

const getFilesList = async (directory) => {
    const files = await fs.promises.readdir(directory);

    return files.filter((file) => readFileExtensions.includes(file.toLowerCase().split('.').at(-1)));
};

const readFile = async (directory, file) => {
    return await fs.promises.readFile(`${directory}\\${file}`);
};

const writeFile = async (directory, fileName, content) => {
    await fs.promises.writeFile(`${directory}/${fileName}.json`, JSON.stringify(content, null, 4), { encoding: 'utf-8' });
};

export {
    readExifData,
    writeFile
};
