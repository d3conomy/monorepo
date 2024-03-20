import { IdReference } from "../idReference";

enum AirlockEventType {
    UserCreated = 'UserCreated',
    UserUpdated = 'UserUpdated',
    UserDeleted = 'UserDeleted',
    UserLoggedIn = 'UserLoggedIn',
    UserLoggedOut = 'UserLoggedOut',
    UserPasswordChanged = 'UserPasswordChanged',
    UserPasswordReset = 'UserPasswordReset',
}


interface AirlockEvent {
    id: IdReference;
    dateCreated: Date;
    type: AirlockEventType;
    data: Map<string, any>;
}

export {
    AirlockEventType,
    AirlockEvent
}