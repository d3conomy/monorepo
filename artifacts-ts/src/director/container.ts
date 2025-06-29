import { CommandRecord, CommandsManager } from "./commands.js";
import { IdentityRecord } from "./identity.js";
import { OptionRecord, Options } from "./options.js";
import { BaseRecord } from "./records.js";


type ContainerInstance = () => Promise<any>
type ContainerInitializer = (options: OptionRecord<any>[]) => Promise<any>

class Container
    extends BaseRecord
    implements
        Record<'id', IdentityRecord>,
        Record<'instance', ContainerInstance | undefined>,
        Record<'initializer', ContainerInitializer | undefined>,
        Record<'options', Options | undefined>,
        Record<'commands', CommandsManager>
{
    public readonly id: IdentityRecord
    public instance: ContainerInstance | undefined
    public readonly initializer: ContainerInitializer | undefined
    public readonly options: Options | undefined
    public readonly commands: CommandsManager;

    constructor({
        id,
        name,
        description,
        instance,
        initializer,
        options,
        commands
    } : {
        id: IdentityRecord,
        name: string,
        description?: string,
        instance?: ContainerInstance,
        initializer?: ContainerInitializer,
        options?: OptionRecord<any>[] | Options,
        commands: CommandsManager | CommandRecord[]
    }) {
        super({name, description});
        this.id = id;
        this.instance = instance;
        this.initializer = initializer;

        if (options instanceof Options) {
            this.options = options;
        } else if (options instanceof Array) {
            this.options = Options.fromArray(options);
        }

        if (commands instanceof CommandsManager) {
            this.commands = commands;
        } else if (commands instanceof Array) {
            this.commands = new CommandsManager(commands);
        } else {
            this.commands = new CommandsManager();
        }
    }

    public async initialize(): Promise<void> {
        const options = this.options?.getRecords() ?? [];

        let instance: any;
        if (typeof this.initializer === 'function') {
            instance = await this.initializer(options);
        }

        if (typeof this.instance === undefined && typeof instance !== undefined) {
            this.instance = async () => instance;
        }

        if (this.instance === undefined) {
            throw new Error('Container instance not set');
        }
    }

    public toString(): string {
        return `${this.name}`;
    }

    public toJSON(): any {
        return {
            name: this.name,
            description: this.description,
            instance: this.instance,
            initializer: this.initializer,
            options: this.options,
            commands: this.commands
        }
    }

}


export {
    Container,
    ContainerInstance,
    ContainerInitializer
}
