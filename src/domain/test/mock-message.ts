import { MessageModel, MessageToSendModel } from "domain/message-model";

export const mockMessageModel: MessageModel = {
    when: "0",
    name: "username",
    message: "the message here",
    moment: 45,
};

export const mockMessageToSendModel: MessageToSendModel = {
    name: "username",
    message: "the message here",
    moment: 45,
};