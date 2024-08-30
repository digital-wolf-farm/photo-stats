import { config } from '../config/config.js';

const allLensesName = 'ALL';
const summary = {
    directories: []
};

let groups = {};

const summarizeData = (data) => {
    createGroups();

    for (const dirData of data) {
        summary.directories.push(dirData.directory);

        for (const photoData of dirData.data) {
            for (const lens of [allLensesName, photoData.lens]) {
                upsertLens(lens);
                upsertFocalLength(summary[lens], photoData.focalLength);
                upsertFocalLengthGroup(summary[lens], photoData.focalLength);
            }

            // TODO: When all numbers added, count shares of each number
        }
    }

    return summary;
};

const upsertLens = (lensName) => {
    if (!summary[lensName]) {
        summary[lensName] = {
            photosNumber: 0,
            general: {},
            grouped: {}
        };

        for (const group in groups) {
            summary[lensName].grouped[group] = 0;
        }
    }

    summary[lensName].photosNumber += 1;
};

const upsertFocalLength = (section, focalLength) => {
    if (!section.general[focalLength]) {
        section.general[focalLength] = 0;
    }

    section.general[focalLength] += 1;
};

const upsertFocalLengthGroup = (section, focalLength) => {
    const group = findGroupForFocalLength(focalLength);

    section.grouped[group] += 1;
};

const createGroups = () => {
    const configTableLength = config.focalLengthThresholds.length;

    for (let i = 0; i <= configTableLength; i++) {
        const currentFocalLength = i === configTableLength ? 1000 : config.focalLengthThresholds[i];
        const previousFocalLength = i === 0 ? 0 : config.focalLengthThresholds[i - 1];

        const groupName = i === 0 ? `<${currentFocalLength}` : `${previousFocalLength + 1}-${currentFocalLength}`;

        groups[groupName] = {
            min: previousFocalLength + 1,
            max: currentFocalLength,
            name: groupName
        };
    };
};

const findGroupForFocalLength = (focalLength) => {
    let foundGroup;

    for (const group in groups) {
        if (focalLength >= groups[group].min && focalLength <= groups[group].max) {
            foundGroup = groups[group].name;
        }
    }

    return foundGroup;
};

export { summarizeData };
