# artifacts-ts

`artifacts-ts` is a TypeScript library containing common packages in the d3 ecosystem.  

## Description



It is a work in progress and is not yet ready for use.  These tools are being developed to support the creation, operation, backup, and restoration of libp2p/ipfs/orbitdb based applications.  Specificially, to manage the infrastructure of a distributed application by implementing a REST api to manage the various processes and data structures.

```Doesnt Kubo have a similar project?```  Yes, but it is written in Go and currently OrbitDB is not supported.  This project's RPC api will match the Kubo api when possible.  The goal is to provide a REST api that can be used to manage the infrastructure of a distributed application. 


## Installation

You can install artifacts-ts using npm:
    
```bash
npm install d3-artifacts
```

## Packages

### `id-reference-factory`
> A factory for creating and managing id references.

### `log-books-manager`
> A manager for creating and managing log books.

### `process-interface`
> An interface for creating and managing processes.

| Features |  |  |   |
|--- | --- | --- | ---- |
| Job queue         |   👍   |  Sequential      |  🟩   | 
|                   |        |  Parallel        |  🟩   | 
| JSON configurable |   👍   |  Process         |  🟩   |
|                   |        |  Commands        |  🟩   |
|                   |        |  Options         |  🟩   |
|                   |        |  Initialization  |  🟩   |
|                   |        |  Work load       |  🟥   |


### `process-libp2p`
> A process for managing libp2p.

| Features |  |  |   |
--- | --- | --- | ----
| Functionality |   🛠️   |  Commands |  🟩   |