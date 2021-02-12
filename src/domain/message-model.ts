export type MessageModel = {
    when: string, // timestamp (reception by the server)
    name: string, // username
    message: string, // the message
    moment?: number, // timestamp (sec) (during the video)
}

export type MessageToSendModel = {
    name: string,
    message: string,
    moment?: number,
}