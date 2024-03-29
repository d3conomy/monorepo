import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { MoonbaseServerUrl } from '../Dashboard';

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

export const LunarPod: React.FC<LunarPodProps> = ({ lunarPod }) => {
    const [info, setInfo] = useState<LunarPodInfo>({
        peerId: '',
        status: '',
        multiaddrs: [],
        protocols: []
    });
    const [ postCommand, setPostCommand ] = useState<string>('dial');
    const [ args, setArgs ] = useState<PostPodRequestArgs>({
        address: "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
    });

    const handleDeletePod = async () => {
        // Delete a pod
        const deleteResponse = await callDeletePods(lunarPod.pod.name);
        toast.success(`Pod deleted: ${JSON.stringify(deleteResponse)}`)
    }

    const handleGetPodInfo = async () => {
        const podId: string = lunarPod.pod?.name;
        const status: any = await callGetPodInfo(podId, 'status');
        const peerId: string = await callGetPodInfo(podId, 'peerid');
        const multiaddrs: string[] = await callGetPodInfo(podId, 'multiaddrs');
        const protocols: string[] = await callGetPodInfo(podId, 'protocols');

        setInfo({
            peerId: peerId,
            status: status?.libp2p,
            multiaddrs: multiaddrs,
            protocols: protocols
        });
    }

    const handlePostPod = async () => {
        const response = await callPostPod(lunarPod.pod?.name, postCommand, args);
        toast.success(`Command sent: ${JSON.stringify(response)}`);
        return response
    }

    useEffect(() => {
        const interval = setInterval(() => {
            try {

                if (lunarPod.pod?.name !== '') {
                    handleGetPodInfo().catch((error) => {
                        console.error(error);
                    })
                }
            }
            catch (error) {
                console.error(error);
            }
        }, 1000);

        return () => clearInterval(interval);
    });

    return (
        <div style={{
            border: '1px solid black',
            padding: '10px',
            margin: '10px',
            backgroundColor: 'lightgrey',
            textAlign: 'left',
            overflow: 'scroll',
            maxWidth: '512px'
        }}>
            <h2 style={{ textAlign: "center" }}>{lunarPod.pod.name} 
            {info.status === 'started' ? <span style={{ color: 'green' }}> &#x25cf;</span> :
                info.status === 'starting' ? <span style={{ color: 'yellow' }}> &#x25cf;</span> :
                info.status === 'stopping' ? <span style={{ color: 'grey' }}> &#x25cf;</span> :
                <span style={{ color: 'red' }}> &#x25cf;</span> }
            </h2>

            <div>
                
                <select
                    value={postCommand ? postCommand : 'dial'}
                    onChange={e => setPostCommand(e.target?.value)}
                    style={{ width: '128px' }}
                >
                    <option value="dial">dial</option>
                    <option value="dialprotocol">dial protocol</option>
                    <option value="addjson">add json</option>
                    <option value="getjson">get json</option>
                </select>
                {postCommand === 'dial' || postCommand === "dialprotocol" ? 
                    <input
                        type="text"
                        value={args.address}
                        onChange={e => setArgs({
                            address: (e.target as HTMLInputElement).value,
                            protocol: args.protocol
                        })}
                        style={{ width: '300px' }}
                    />
                : null}
                {postCommand === 'dialprotocol' ?
                    <input
                        type="text"
                        value={args.protocol}
                        onChange={e => setArgs({ 
                            address: args.address,
                            protocol: (e.target as HTMLInputElement).value
                        })}
                        style={{ width: '300px' }}
                    />
                : null}
                {postCommand === 'addjson' ? 
                    <input
                        type="text"
                        value={args.data?.name}
                        onChange={e => setArgs({ data: { name: (e.target as HTMLInputElement)?.value } })}
                        style={{ width: '300px' }}
                    />
                : null}
                {postCommand === 'getjson' ?
                    <input
                        type="text"
                        value={args.cid}
                        onChange={e => setArgs({ cid: (e.target as HTMLInputElement)?.value })}
                        style={{ width: '300px' }}
                    />
                : null}
                <button onClick={handlePostPod}>Send Command</button>
                <button onClick={handleDeletePod}>Delete Pod</button>
            </div>

            {/* Make the following horizontaly scrollable */}

            <div style={{ scrollbarColor: 'black', overflow: '', fontSize: '12px'   }}>
                <p>Peer Id: {info?.peerId}</p>
                <p>Multiaddrs: {info.multiaddrs?.map((addr, index) =>{
                    return <span key={index}>{addr}<br/></span>
                })}</p>
                <p>Protocols: 
                    <br />
                    {info.protocols?.map((protocol, index) =>{
                    return <span key={index}>{protocol}<br/></span>

                })}</p>
                <ul>
                    {lunarPod.components?.map((component, index) => {
                        // if (component.id.component !== 'opendb') {
                            return (
                                <li key={index}>
                                    <h3>{component.id?.component} | {component.id?.name}</h3>
                                </li>
                            );
                        // }
                        // if (component.id.component === 'opendb') {
                            
                        // }
                    })}
                </ul>
            </div>
        </div>
    );
};