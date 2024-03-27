import axios, { AxiosResponse } from "axios";
import { OrbitDbTypes } from "../../models";

const openDb = async (
    moonbaseUrl: string,
    dbName: string,
    dbType: OrbitDbTypes,
    options?: any
): Promise<AxiosResponse> => {
    const response = await axios.post(`${moonbaseUrl}/open`, {
        dbName,
        dbType,
        options
    });
    return response;
}

export {
    openDb
}