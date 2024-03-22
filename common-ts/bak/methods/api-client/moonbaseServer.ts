import axios, { AxiosResponse } from 'axios';

const ping = async (
    moonbaseUrl: string
): Promise<AxiosResponse> => {
    const response = await axios.get(`${moonbaseUrl}/ping`);
    return response;
}

export {
    ping
}
