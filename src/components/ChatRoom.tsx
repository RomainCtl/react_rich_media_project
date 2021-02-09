import React from 'react';
import { List, ListItem, Divider, ListItemText, ListItemAvatar, Paper, IconButton, InputBase, Avatar } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { MessageModel, MessageToSendModel } from 'domain/message-model';

import "./ChatRoom.css";

const URL = "wss://imr3-react.herokuapp.com";

type ChatRoomState = {
    data: MessageModel[],
    connected: boolean,
}

export class ChatRoom extends React.Component<{}, ChatRoomState> {
    private ws: WebSocket;
    private bottomRef: any;

    constructor(props: any) {
        super(props);

        this.state = {
            data: [],
            connected: false,
        }

        this.ws = new WebSocket(URL);
        this.bottomRef = React.createRef();

        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.info("[WS] Connected!");
            this.setState({
                connected: true
            });
        }

        this.ws.onclose = () => {
            console.info("[WS] Disconnected!");
            this.setState({
                connected: false
            });
            this.ws = new WebSocket(URL);
        }

        this.ws.onmessage = evt => {
            console.info("[WS] Message received!");
            const messages: MessageModel[] = JSON.parse(evt.data).sort(
                (o1: MessageModel, o2: MessageModel) => (o1.when > o2.when ? 1 : -1)
            );
            this.setState((prevState: ChatRoomState) => (
                {
                    connected: true,
                    data: prevState.data.concat(messages)
                }
            ));
            this.bottomRef.current.scrollIntoView();
        }
    }

    submitMessage(e: React.FormEvent<HTMLDivElement>) {
        e.preventDefault();
        // TODO add 'moment' if it's possible

        const target = e.target as typeof e.target & {
            name: { value: string };
            message: { value: string };
        };
        const msg: MessageToSendModel = {
            name: target.name.value,
            message: target.message.value,
        }

        if (msg.name !== "" && msg.message !== "")
            this.ws.send(JSON.stringify(msg));
    }

    render() {
        return (
            <div className="Chatroom">
                <List>
                    {this.state.data.map((item: MessageModel, index: number) => (
                        <div key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar>
                                        {item.name.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.name}
                                    secondary={item.message}
                                >
                                </ListItemText>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                    <span ref={this.bottomRef}></span>
                </List>
                <Divider className="thick-divider" />
                <Paper component="form" className="chatform" onSubmit={this.submitMessage}>
                    <Avatar className="avatar" />
                    <InputBase placeholder="Votre nom" name="name" />
                    <Divider orientation="vertical" flexItem />
                    <InputBase className="ipt" placeholder="Votre message" name="message" />
                    <IconButton type="submit" aria-label="send" disabled={!this.state.connected}>
                        <SendIcon />
                    </IconButton>
                </Paper>
            </div >
        );
    }
}