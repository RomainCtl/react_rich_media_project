import React from 'react';
import { List, ListItem, Divider, ListItemText, ListItemAvatar, Paper, IconButton, InputBase, Avatar, Card, CardActions, CardContent, Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { MessageModel, MessageToSendModel } from 'domain/message-model';

import "./ChatRoom.css";

const URL = "wss://imr3-react.herokuapp.com";

type ChatRoomState = {
    data: MessageModel[],
    connected: boolean,
    name: string,
    message: string
}

export class ChatRoom extends React.Component<{}, ChatRoomState> {
    private ws: WebSocket;
    private bottomRef: any;

    constructor(props: any) {
        super(props);

        this.state = {
            data: [],
            connected: false,
            name: "",
            message: ""
        }

        this.ws = new WebSocket(URL);
        this.bottomRef = React.createRef(); // to scroll down when new message appear

        // To be able to access to 'this' when came from event
        this.submitMessage = this.submitMessage.bind(this);
        this.initializeWebsocket = this.initializeWebsocket.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
    }

    /**
     * One time, when component did mount
     */
    componentDidMount() {
        this.initializeWebsocket();
    }

    /**
     * Initialize websocket variable and functions
     */
    initializeWebsocket() {
        if (this.ws.readyState === WebSocket.CLOSING) {
            setTimeout(() => {
                this.initializeWebsocket();
            }, 1000);
        } else {
            if (this.ws.readyState === WebSocket.CLOSED) this.ws = new WebSocket(URL)

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
                // If closed, ask to reconnect
                this.initializeWebsocket();
            }

            this.ws.onmessage = evt => {
                console.info("[WS] Message received!");
                // Get message and sort by date
                const messages: MessageModel[] = JSON.parse(evt.data).sort(
                    (o1: MessageModel, o2: MessageModel) => (o1.when > o2.when ? 1 : -1)
                );
                this.setState((prevState: ChatRoomState) => (
                    {
                        connected: true,
                        data: prevState.data.concat(messages)
                    }
                ));
                // scroll to bottom (to see newer message)
                if (this.bottomRef.current) this.bottomRef.current.scrollIntoView();
            }
        }
    }

    // Form (to send message) functions
    onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: e.currentTarget.value
        });
    }
    onChangeMessage(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            message: e.currentTarget.value
        });
    }
    submitMessage(e: React.FormEvent<HTMLDivElement>) {
        e.preventDefault();

        const msg: MessageToSendModel = {
            name: this.state.name,
            message: this.state.message,
        }

        // Send message
        if (msg.name !== "" && msg.message !== "") {
            this.ws.send(JSON.stringify(msg));
            // reset message (empty input)
            this.setState({
                message: ""
            });
        }
    }

    /**
     * format timestamp to date (hh:mm:ss dd/MM/yy)
     * @param timestamp
     */
    formatTimestamp(timestamp: string) {
        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = "0" + date.getMonth();
        const day = "0" + date.getDate();
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 25/10/2021 format
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + " " + day.substr(-2) + "/" + month.substr(-2) + "/" + year;
    }

    render() {
        let chatlist;
        if (this.state.connected)
            chatlist = (
                <List>
                    {this.state.data.map((item: MessageModel, index: number) => (
                        <div key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar>
                                        {item.name ? item.name.charAt(0) : ""}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText secondary={item.message}>
                                    <span>
                                        {item.name}
                                        <i className="date">{this.formatTimestamp(item.when)}</i>
                                    </span>
                                </ListItemText>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                    <span ref={this.bottomRef}></span>
                </List>
            )
        else
            chatlist = (
                <div>
                    <Card>
                        <CardContent>
                            <h3>{this.ws.readyState === WebSocket.CONNECTING ? "Connecting..." : "Disconnected from the chat..."}</h3>
                        </CardContent>
                        <CardActions>
                            <Button onClick={this.initializeWebsocket} variant="contained" disabled={this.ws.readyState === WebSocket.CONNECTING}>Reconnect</Button>
                        </CardActions>
                    </Card>
                </div>
            )
        return (
            <div className="Chatroom">
                {chatlist}
                <Paper component="form" className="chatform" onSubmit={this.submitMessage}>
                    <Avatar className="avatar" />
                    <InputBase placeholder="Your name" value={this.state.name} onChange={this.onChangeName} />
                    <Divider orientation="vertical" flexItem />
                    <InputBase className="ipt" placeholder="Your message" value={this.state.message} onChange={this.onChangeMessage} />
                    <IconButton type="submit" aria-label="send" disabled={!this.state.connected}>
                        <SendIcon />
                    </IconButton>
                </Paper>
            </div >
        );
    }
}