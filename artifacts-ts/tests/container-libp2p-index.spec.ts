import { expect } from 'chai';
import { Libp2pContainer } from '../src/container-libp2p/index.js';
import { InstanceOptions, InstanceOptionsList } from '../src/container/options.js';
import { InstanceTypes } from '../src/container/instance.js';
import { createId } from './helpers.js';
import { ContainerId } from '../src/id-reference-factory/index.js';
import { libp2pCommands } from '../src/container-libp2p/commands.js';

describe('Libp2pContainer', async () => {
    it('should create a new Libp2pContainer instance', async () => {
        const id = createId('container') as ContainerId;
        const container = new Libp2pContainer(id);
        await container.init();

        expect(container).to.be.an.instanceOf(Libp2pContainer);
        expect(container.id).to.equal(id);
        expect(container.type).to.equal(InstanceTypes.Libp2p);
        // expect(container.initializer).to.be.a('function');
        expect(container.commands).to.deep.equal(libp2pCommands);
    });

    it('should create a new Libp2pContainer instance with options', async () => {
        const id = createId('container') as ContainerId;
        const options = new InstanceOptions({options: [
            { name: 'enableNoise', value: false },
            { name: 'enableTls', value: false },
        ]});
        const container = new Libp2pContainer(id, options);
        await container.init();

        expect(container).to.be.an.instanceOf(Libp2pContainer);
        expect(container.id).to.equal(id);
        expect(container.type).to.equal(InstanceTypes.Libp2p);
        expect(container.commands).to.deep.equal(libp2pCommands);
        expect(container.options).to.deep.equal(options);
    });
});