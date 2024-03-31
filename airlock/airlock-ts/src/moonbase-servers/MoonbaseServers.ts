import { 
    IdReferenceFactory,
    IdReferenceTypes,
    MoonbaseId 
} from 'd3-artifacts';

import {
    IMoonbaseServers  
} from './MoonbaseServerInterfaces.js';

import {
    MoonbaseServer
} from './MoonbaseServer.js';

import {
    MoonbaseServerUrl
} from './MoonbaseServerUrl.js';

class MoonbaseServers implements IMoonbaseServers {
    idReferenceFactory: IdReferenceFactory;
    servers: Array<MoonbaseServer>;

    constructor({
        idReferenceFactory,
        moonbaseServerUrls
    }: {
        idReferenceFactory: IdReferenceFactory,
        moonbaseServerUrls?: Array<MoonbaseServerUrl>
    }) {
        this.idReferenceFactory = idReferenceFactory;
        this.servers = new Array<MoonbaseServer>();

        if (moonbaseServerUrls) {
            moonbaseServerUrls.forEach(url => {
                const id = this.idReferenceFactory.createIdReference({type: IdReferenceTypes.MOONBASE, dependsOn: this.idReferenceFactory.getIdReferencesByType(IdReferenceTypes.SYSTEM)[0]});
                this.servers.push(this.createServer({ id, url }));
            });
        }
    }

    addServer(server: MoonbaseServer): void {
        this.servers.push(server);
    }

    createServer({
        id,
        url,
    } : {
        id?: MoonbaseId | string,
        url: MoonbaseServerUrl
    
    }): MoonbaseServer {
        let moonbaseId: MoonbaseId;
        if (typeof id === 'string') {
            moonbaseId = this.idReferenceFactory.createIdReference({name: id, type: IdReferenceTypes.MOONBASE, dependsOn: this.idReferenceFactory.getIdReferencesByType(IdReferenceTypes.SYSTEM)[0]});
        }
        else {
            moonbaseId = this.idReferenceFactory.createIdReference({type: IdReferenceTypes.MOONBASE, dependsOn: this.idReferenceFactory.getIdReferencesByType(IdReferenceTypes.SYSTEM)[0]});
        }

        const server = new MoonbaseServer({id: moonbaseId, url});
        this.addServer(server);
        return server;
    }

    removeServer(server: MoonbaseServer): void {
        this.servers = this.servers.filter(s => s.id !== server.id);
    }

    updateServer(server: MoonbaseServer): void {
        this.servers = this.servers.map(s => s.id === server.id ? server : s);
    }

    getServer({
        id,
        name
    }: {
        id?: MoonbaseId
        name?: MoonbaseId['name']
    }): MoonbaseServer | undefined {
        if (id && name) {
            throw new Error('Cannot specify both id and name');
        }
        if (id) {
            return this.servers.find(s => s.id === id);
        }
        return this.servers.find(s => s.id.name === name);
    }

    getServers(): Array<MoonbaseServer> {
        return this.servers;
    }

    clear(): void {
        this.servers = [];
    }
}

export {
    MoonbaseServers
}