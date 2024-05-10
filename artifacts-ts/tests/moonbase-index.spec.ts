import { expect } from 'chai';

import { Moonbase } from '../src/moonbase/index.js';
import { MoonbaseOptions } from '../src/moonbase/options.js';
import { InstanceOptions, InstanceOptionsList } from '../src/container/options.js';



describe('Moonbase', async () => {
    it('should create a moonbase', async () => {
        const moonbase = new Moonbase();
        expect(moonbase).to.be.an.instanceOf(Moonbase);
    });

    it('should create a moonbase with a pod bay', async () => {
        const moonbaseOptions: MoonbaseOptions = new MoonbaseOptions(
            new InstanceOptions({options: [
                {
                    name: "createPodBay",
                    value: true
                }
            ]})
        );
        const moonbase = new Moonbase({options: moonbaseOptions});
        expect(moonbase).to.be.an.instanceOf(Moonbase);
        expect(moonbase.podBays.length).to.equal(1);
    });
});