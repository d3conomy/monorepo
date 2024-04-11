import { expect } from "chai";
import { PodBay } from "../src/pod-bay/index.js";
import { IdReferenceFactory } from "d3-artifacts";
import { openDb } from "./open-db-process/index.js";

describe("PodBay", () => {
    let podBay: PodBay;
    let orbitDbId: string;

    beforeEach(() => {
        podBay = new PodBay({
            idReferenceFactory: new IdReferenceFactory(),
        });
    });


    it("should create a new pod", async () => {
        const podId = await podBay.newPod();
        expect(podId).to.exist;
        expect(podBay.checkPodId(podId)).to.be.true;

        if (podId) {
            await podBay.removePod(podId);
        }
    });

    it("should add a pod to the PodBay", async () => {
        const podId = await podBay.newPod();
        expect(podBay.checkPodId(podId)).to.be.true;
        
        if (podId) {
            await podBay.removePod(podId);
        }
    });

    it("should get a pod from the PodBay", async () => {
        const podId = await podBay.newPod();
        const retrievedPod = podBay.getPod(podId);
        expect(retrievedPod).to.exist;
        if (podId) {
            await podBay.removePod(podId);
        }
    });

    it("should remove a pod from the PodBay", async () => {
        const podId = await podBay.newPod();
        if (podId) {
            await podBay.removePod(podId);
        }
        expect(podBay.checkPodId(podId)).to.be.false;
    });

    it("should get the status of a pod in the PodBay", async () => {
        const podId = await podBay.newPod();
        if (podId) {
            const status = podBay.getStatus(podId);
            expect(status).to.exist;
            await podBay.removePod(podId);
        }
    });

    it("should open a database in the PodBay", async () => {
        const dbName = "myDatabase";
        const dbType = "keyvalue";
        const options = new Map<string, string>();
        const result = await podBay.openDb({ dbName, dbType, options });
        expect(result).to.exist;
        expect(result?.openDb).to.exist;
        expect(result?.address).to.exist;
        expect(result?.podId).to.exist;
        expect(result?.multiaddrs).to.exist;

        await podBay.closeDb(dbName);

        if (result?.podId) {
            await podBay.removePod(result?.podId);
        }
    });

    it("should get the open database with the specified name or ID", async () => {
        const dbName = "myDatabase";
        const dbType = "keyvalue";
        const options = new Map<string, string>();
        const result = await podBay.openDb({ dbName, dbType, options });

        if (result?.openDb) {
            const openDb = await podBay.getOpenDb(result?.openDb);
            expect(openDb).to.exist;
        }

        await podBay.closeDb(dbName);

        if (result?.podId) {
            await podBay.removePod(result?.podId);
        }

    });

    it("should close the open database with the specified name or ID", async () => {
        const dbName = "myDatabase";
        const dbType = "events";
        const options = new Map<string, string>();
        await podBay.openDb({ dbName, dbType, options });
        const closedDb = await podBay.closeDb(dbName);
        expect(closedDb).to.exist;

        if (closedDb?.podId) {
            await podBay.removePod(closedDb?.podId);
        }
    });
});
