import axios, { AxiosResponse } from "axios";
import { IdReference, PodProcessId } from "../../models";



const status = async (
    podProcessId: PodProcessId
): Promise<AxiosResponse> => {
    const { moonbaseUrl, podId } = getStringValues(podProcessId)
    return await axios.get(`${moonbaseUrl}/pod/${podId}?info=status`);
}

const peerId = async (
    podProcessId: PodProcessId
): Promise<AxiosResponse> => {
    const { moonbaseUrl, podId } = getStringValues(podProcessId)
    return await axios.get(`${moonbaseUrl}/pod/${podId}?info=peerid`);
}

const multiaddrs = async (
    podProcessId: PodProcessId
): Promise<AxiosResponse> => {
    const { moonbaseUrl, podId } = getStringValues(podProcessId)
    return await axios.get(`${moonbaseUrl}/pod/${podId}?info=multiaddrs`);
}

const protocols = async (
    podProcessId: PodProcessId
): Promise<AxiosResponse> => {
    const { moonbaseUrl, podId } = getStringValues(podProcessId)
    return await axios.get(`${moonbaseUrl}/pod/${podId}?info=protocols`);
}

const peers = async (
    podProcessId: PodProcessId
): Promise<AxiosResponse> => {
    const { moonbaseUrl, podId } = getStringValues(podProcessId)
    return await axios.get(`${moonbaseUrl}/pod/${podId}?info=peers`);
}

const connections = async (
    podProcessId: PodProcessId
): Promise<AxiosResponse> => {
    const { moonbaseUrl, podId } = getStringValues(podProcessId)
    return await axios.get(`${moonbaseUrl}/pod/${podId}?info=connections`);
}

const dial = async (
    podProcessId: PodProcessId,
    peerId: IdReference
): Promise<AxiosResponse> => {
    const { moonbaseUrl, podId } = getStringValues(podProcessId)
    return await axios.post(`${moonbaseUrl}/pod/${podId}`, {
        command: "dial",
        args: {
            address: peerId
        }
    });
}

const dialProtocol = async (
    podProcessId: PodProcessId,
    peerId: IdReference,
    protocol: string
): Promise<AxiosResponse> => {
    const { moonbaseUrl, podId } = getStringValues(podProcessId)
    return await axios.post(`${moonbaseUrl}/pod/${podId}`, {
        command: "dialprotocol",
        args: {
            address: peerId,
            protocol
        }
    });
}

export {
    status,
    peerId,
    multiaddrs,
    protocols,
    peers,
    connections,
    dial,
    dialProtocol
}