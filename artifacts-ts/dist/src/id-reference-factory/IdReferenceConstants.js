var IdReferenceFormats;
(function (IdReferenceFormats) {
    IdReferenceFormats["UUID"] = "uuid";
    IdReferenceFormats["NAME"] = "name";
    IdReferenceFormats["STRING"] = "string";
    IdReferenceFormats["CUSTOM"] = "custom";
})(IdReferenceFormats || (IdReferenceFormats = {}));
var IdReferenceTypes;
(function (IdReferenceTypes) {
    IdReferenceTypes["SYSTEM"] = "system";
    IdReferenceTypes["MOONBASE"] = "moonbase";
    IdReferenceTypes["POD_BAY"] = "pod-bay";
    IdReferenceTypes["POD"] = "pod";
    IdReferenceTypes["PROCESS"] = "process";
    IdReferenceTypes["CONTAINER"] = "container";
    IdReferenceTypes["JOB"] = "job";
})(IdReferenceTypes || (IdReferenceTypes = {}));
export { IdReferenceFormats, IdReferenceTypes, };
