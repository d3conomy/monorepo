import { expect } from "chai";

import * as IdReferenceFactorySrc from "../src/id-reference-factory/index.js";

describe("src/id-reference-factory/index.js", () => {
    it("should export the IdReference", () => {
        expect(IdReferenceFactorySrc).to.haveOwnProperty("IdReference");
    });

    it("should export the IdReferenceFormats", () => {
        expect(IdReferenceFactorySrc).to.haveOwnProperty("IdReferenceFormats");
    });

    it("should export the IdReferenceTypes", () => {
        expect(IdReferenceFactorySrc).to.haveOwnProperty("IdReferenceTypes");
    });

    it("should export the isIdReferenceFormat", () => {
        expect(IdReferenceFactorySrc).to.haveOwnProperty("isIdReferenceFormat");
    });

    it("should export the IdReferenceFactory", () => {
        expect(IdReferenceFactorySrc).to.haveOwnProperty("IdReferenceFactory");
    });

    it("should export the MetaData", () => {
        expect(IdReferenceFactorySrc).to.haveOwnProperty("MetaData");
    });
});