import { ContainerId } from "../id-reference-factory/index.js";

class ContainerError extends Error {
    containerId?: ContainerId;

  constructor(message: string, containerId?: ContainerId) {
    super(message);
    this.containerId = containerId;
    this.name = 'ContainerError';
  }
}

export {
    ContainerError
}