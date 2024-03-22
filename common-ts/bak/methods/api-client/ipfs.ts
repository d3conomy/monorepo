import axios from "axios";

const addJson = async (
    moonbaseUrl: string,
    podId: string,
    json: any
) => {
    const response = await axios.post(`${moonbaseUrl}/pod/${podId}`, {
        command: "addjson",
        args: {
            data: {
                json
            }
        }
    });
    return response;
}

const getJson = async (
    moonbaseUrl: string,
    podId: string,
    cid: string
) => {
    const response = await axios.post(`${moonbaseUrl}/pod/${podId}`, {
        command: "getjson",
        args: {
            cid
        }
    });
    return response;
}

export {
    addJson,
    getJson
}