import { IIdReferenceFactory, MoonbaseId } from "d3-artifacts";
import { MoonbaseServerUrl } from "./MoonbaseServerUrl.js";
/**
 * @interface IMoonbaseServer
 * @description Interface for MoonbaseServer
 */
interface IMoonbaseServer {
    id: MoonbaseId;
    url: MoonbaseServerUrl;
}
/**
 * @interface IMoonbaseServers
 * @description Interface for MoonbaseServers
 */
interface IMoonbaseServers {
    idReferenceFactory: IIdReferenceFactory;
    servers: Array<IMoonbaseServer>;
    addServer(server: IMoonbaseServer): void;
    createServer({ id, url }: {
        id?: MoonbaseId | string;
        url: MoonbaseServerUrl;
    }): IMoonbaseServer;
    removeServer(server: IMoonbaseServer): void;
    updateServer(server: IMoonbaseServer): void;
    getServer({ id, name }: {
        id?: MoonbaseId;
        name?: MoonbaseId['name'];
    }): IMoonbaseServer | undefined;
    getServers(): Array<IMoonbaseServer>;
    clear(): void;
}
export { IMoonbaseServer, IMoonbaseServers };
