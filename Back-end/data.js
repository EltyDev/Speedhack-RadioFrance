const fs = require("fs");

const dataset = ".";
const transcriptDir = `${dataset}/transcripts/vocapia`;
const gridDir = `${dataset}/grid`;
const radios = [];

const csvToJSON = (csv) => {
    let lines = csv.split("\n");
    let result = {};
    let headers = []
    for (let i in lines) {
        let lineContent = lines[i].split(",");
        if (i == 0) {
            headers = [lineContent[1], lineContent[2], lineContent[4], lineContent[6]]
            continue;
        }
        result[lineContent[7]] = {}
        result[lineContent[7]][headers[0]] = lineContent[1];
        result[lineContent[7]][headers[1]] = lineContent[2];
        result[lineContent[7]][headers[2]] = lineContent[4];
        result[lineContent[7]][headers[3]] = lineContent[6];
    }
    return result;
}

const getManifestData = async (file) => {
    let jsonContent = await fs.promises.readFile(file, "utf-8");
    let magnetothequeId = jsonContent.match(/"magnetotheque_id": "(.*?)"/)[1];
    let tags = jsonContent.match(/"vocfile": \[([\s\S]*?)\]/)[1].split(',').map(item => item.trim().replace(/["']/g, ''));

    return {id: magnetothequeId, tags: tags};
}

const getDataAbout = async (magnetothequeId) => {
    for (let radio of radios) {
        if (magnetothequeId in radio)
            return radio[magnetothequeId];
    }
    return null;
}

const parseTranscriptXml = async (file) => {
    let xml = await fs.promises.readFile(file, "utf-8");
    if (xml.match(/<Error .*?<\/Error>/)) return null;
    let totalSpeakTime = xml.match(/spdur=\"(\d+\.\d+)\"/)
    if (totalSpeakTime == null) return null;
    totalSpeakTime = totalSpeakTime[1];
    let speakers = xml.match(/<Speaker .*?\/>/g)
    if (speakers == null) return null;
    speakers = speakers.map(speaker => {
        let gender = speaker.match (/gender="(\d)"/)[1]
        let duration = speaker.match(/dur="(\d+\.\d+)"/)[1];
        return {gender: parseInt(gender), speakTime: parseFloat(duration)}
    });
    return {totalSpeakTime: parseFloat(totalSpeakTime), speakers: speakers};
};

const getAllShows = async () => {
    let allShows = [];
    let showsDirs = await fs.promises.readdir(transcriptDir);
    
    for (let showsDir of showsDirs) {
        if (!(await fs.promises.lstat(`${transcriptDir}/${showsDir}`)).isDirectory())
            continue;
        let showDir = await fs.promises.readdir(`${transcriptDir}/${showsDir}`);
        for (let show of showDir)
            allShows.push(`${transcriptDir}/${showsDir}/${show}`);
    }
    return allShows;
};

const getAllData = async () => {
    let shows = await getAllShows();
    let totalSpeakGender = {"France Inter": {1: 0.0, 2: 0.0, shows: {}}, "France Info":{1: 0.0, 2: 0.0, shows: {}}, "France Culture": {1: 0.0, 2: 0.0, shows: {}}};

    for (let i = 0; i < shows.length; ++i) {
        let number = i;
        let manifestData = await getManifestData(`${shows[number]}/manifest.json`);
        let data = await getDataAbout(manifestData.id);
        if (data == null) continue;
        let file = await parseTranscriptXml(`${shows[number]}/transcript.xml`);
        if (file == null) continue;
        for (let speaker of file.speakers) {
            totalSpeakGender[data.diffusion_station_name][speaker.gender] += speaker.speakTime;
            if (!(data.concept_title in totalSpeakGender[data.diffusion_station_name].shows))
                totalSpeakGender[data.diffusion_station_name].shows[data.concept_title] = {1: 0.0, 2: 0.0};
            totalSpeakGender[data.diffusion_station_name].shows[data.concept_title][speaker.gender] += speaker.speakTime;
        }
        //data["tags"] = manifestData.tags;
        //file["data"] = data;
    }
    return totalSpeakGender;
}

const geShowParity = (data, showName) => {
    for (let radio in data) {
        if (!(showName in data[radio].shows)) continue;
        let total = data[radio].shows[showName][1] + data[radio].shows[showName][2];
        return {1: data[radio].shows[showName][1] / total, 2: data[radio].shows[showName][2] / total};
    }
}

const getRadioParity = (data, radioName) => {
    if (!(radioName in data)) return null;
    let total = data[radioName][1] + data[radioName][2];
    return {1: data[radioName][1] / total, 2: data[radioName][2] / total};
}

const getRadiosParity = (data) => {
    let result = {};
    for (let radio in data) {
        let total = data[radio][1] + data[radio][2];
        result[radio] = {1: data[radio][1] / total, 2: data[radio][2] / total, usage: total};
    }
    return result;
}

const getData = async () => {
    radios.push(csvToJSON(await fs.promises.readFile(`${gridDir}/franceculture.csv`, "utf-8")));
    radios.push(csvToJSON(await fs.promises.readFile(`${gridDir}/franceinfo.csv`, "utf-8")));
    radios.push(csvToJSON(await fs.promises.readFile(`${gridDir}/franceinter.csv`, "utf-8")));
    return await getAllData();
}

module.exports = {getRadiosParity, getRadioParity, geShowParity, getData};
