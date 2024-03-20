import { PodProcessType } from "./process";

enum MoonbaseComponent {
    Moonbase = 'moonbase',
    ApiServer = 'apiServer',
    PodBay = 'podBay',
    Pod = 'pod',
    IpfsProcess = PodProcessType.IPFS,
    OrbitDBProcess = PodProcessType.ORBITDB,
    OpenDBProcess = PodProcessType.DB,
    LibP2PProcess = PodProcessType.LIBP2P,
}

const isMoonbaseComponent = (component?: string): MoonbaseComponent => {
    if (component === undefined) {
        return MoonbaseComponent.Moonbase;
    }
    if (Object.values(MoonbaseComponent).includes(component as MoonbaseComponent)) {
        return component as MoonbaseComponent;
    }
    throw new Error('Invalid moonbase component');
}

export {
    MoonbaseComponent,
    isMoonbaseComponent
}