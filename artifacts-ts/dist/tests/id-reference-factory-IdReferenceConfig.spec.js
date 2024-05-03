import { expect } from "chai";
import { IdReferenceConfig, IdReferenceConfigDefault } from "../src/id-reference-factory/IdReferenceConfig.js";
import { IdReferenceFormats } from "../src/id-reference-factory/IdReferenceConstants.js";
describe("/src/id-reference-factory/IdReferenceConfig.js", () => {
    it("should create an instance with default idReferenceFormat", () => {
        const config = new IdReferenceConfig({});
        expect(config.idReferenceFormat).to.be.equal(IdReferenceConfigDefault.idReferenceFormat);
    });
    it("should create an instance with provided idReferenceFormat", () => {
        const idReferenceFormat = IdReferenceFormats.UUID;
        const config = new IdReferenceConfig({ idReferenceFormat });
        expect(config.idReferenceFormat).to.be.equal(idReferenceFormat);
    });
});
