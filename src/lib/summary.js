const summary = {
    directories: [],
    allLenses: {
        photosNumber: 0
    }
};

const summarizeData = (data) => {
    for (const dirData of data) {
        summary.directories.push(dirData.directory);

        for (const photoData of dirData.data) {

            // All lenses
            summary.allLenses.photosNumber += 1;

            if (!summary.allLenses[photoData.focalLength]) {
                summary.allLenses[photoData.focalLength] = { photosNumber: 0, aperture: {} };
            }

            summary.allLenses[photoData.focalLength].photosNumber += 1;
            summary.allLenses[photoData.focalLength].aperture[photoData.aperture] = (summary.allLenses[photoData.focalLength].aperture[photoData.aperture] || 0) + 1;

            // Given lens
            if (!summary[photoData.lens]) {
                summary[photoData.lens] = { photosNumber: 0 };
            }

            summary[photoData.lens].photosNumber += 1;

            if (!summary[photoData.lens][photoData.focalLength]) {
                summary[photoData.lens][photoData.focalLength] = { photosNumber: 0, aperture: {} };
            }

            summary[photoData.lens][photoData.focalLength].photosNumber += 1;
            summary[photoData.lens][photoData.focalLength].aperture[photoData.aperture] = (summary[photoData.lens][photoData.focalLength].aperture[photoData.aperture] || 0) + 1;

            // TODO: When all numbers added, count shares of each number
        }
    }

    return summary;
};

export { summarizeData };
