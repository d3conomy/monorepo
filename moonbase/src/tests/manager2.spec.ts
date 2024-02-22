import { Manager } from '../db/manager.js';
import { expect } from 'chai';
import { Component, LogLevel, ResponseCode } from '../utils/constants.js';
import { logger } from '../utils/logBook.js';
import { create } from 'domain';
import { createRandomId } from '../utils/id.js';
import e from 'express';
import { Node } from '../db/node.js';


describe('Manager2', async () => {
    // let manager: Manager;
    let id: string;

    beforeEach(() => {

        id = `test-id-${createRandomId()}`;
    });

    it('should create a node', async () => {
        let manager = new Manager();
        const type = Component.LIBP2P;
        // const options = { /* provide your test options here */ };
        
        await manager.createNode({
            id,
            type,
        });

        const allNodes = manager.getAllNodes()
        allNodes.forEach(async (node) => {
            logger({
                level: LogLevel.INFO,
                component: Component.SYSTEM,
                code: ResponseCode.SUCCESS,
                message: `node: ${node.id}`
            
            })
            await manager.closeNode(node.id);
        });
        expect(manager.getNode(id)).to.be.instanceOf(Node);

    });

    it('should create an ipfs node', async () => {
        let manager = new Manager();
        const type = Component.IPFS;
        // const options = { /* provide your test options here */ };
        
        await manager.createNode({
            id,
            type,
        });

        const allNodes = manager.getAllNodes()
        allNodes.forEach(async (node) => {
            logger({
                level: LogLevel.INFO,
                component: Component.SYSTEM,
                code: ResponseCode.SUCCESS,
                message: `node: ${node.id}`
            
            })
            await manager.closeNode(node.id);
        });
        expect(manager.getNode(id)).to.be.instanceOf(Node);

    });

    it('should close a node', async () => {
        let manager = new Manager();
        const type = Component.LIBP2P;
        // const options = { /* provide your test options here */ };
        
        await manager.createNode({
            id,
            type,
        });

        await manager.closeNode(id);
        // expect(manager.getNode(id)).to.be.null;
    });
});
