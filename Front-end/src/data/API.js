const HOST = 'http://localhost:4000'

const getRadiosParity = async () => {
    let response = await fetch(`${HOST}/radiosParity`);
    return await response.json();
}

const getShows = async () => {
    let response = await fetch(`${HOST}/shows`);
    return await response.json();
}

const getRadioParity = async (radio) => {
    let response = await fetch(`${HOST}/radioParity/${radio}`);
    return await response.json();
}

const getShowParity = async (show) => {
    let response = await fetch(`${HOST}/showParity/${show}`);
    return await response.json();
}

export { getRadiosParity, getShows, getRadioParity, getShowParity };