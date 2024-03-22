interface IdReference {
    name: string;
    component: string;
}

interface PodStatus {
    stage: string;
    message: string;
    updated: string;
}

interface PodComponents {
    id: IdReference;
    status: PodStatus
}

interface _LunarPod {
    pod: IdReference;
    components: PodComponents[];
}

interface LunarPodProps {
    lunarPod: _LunarPod;
}

interface LunarPodInfo {
    peerId: string;
    status: string;
    multiaddrs: string[];
    protocols: string[];

}

interface PostPodRequestArgs {
    address?: string;
    protocol?: string;
    cid?: string;
    data?: {
        name?: string;
    }
}

const callDeletePods = async (podId: string) => {
    const response = await axios.delete(`${MoonbaseServerUrl}/pods`, {
        data: {
            id: podId
        }
    });
    return response.data;
}

const callGetPodInfo = async (podId: string, info: string) => {
    const response = await axios.get(`${MoonbaseServerUrl}/pod/${podId}?info=${info}`);
    return response.data;
}

const callPostPod = async (podId: string, command: string, args: PostPodRequestArgs) => {
    const response = await axios.post(`${MoonbaseServerUrl}/pod/${podId}`, {
            command: command,
            args: args 
        })
    return response.data;
}

export {
    LunarPodProps,
    LunarPodInfo,
    PostPodRequestArgs,
    callDeletePods,
    callGetPodInfo,
    callPostPod
}