import { render, screen } from "@testing-library/react";
import WS from "jest-websocket-mock";
import { ChatRoom } from './ChatRoom';
import { mockMessageModel } from "domain/test/mock-message";

describe("testing Chatroom component", () => {
    let server: WS;
    beforeEach(() => {
        server = new WS("wss://imr3-react.herokuapp.com");
    });

    afterEach(() => {
        WS.clean();
    });

    test("Connecting message if WS not connected", () => {
        render(<ChatRoom />);

        const p = screen.getByText(/Connecting.../i);
        expect(p).toBeInTheDocument();
    });

    test("Disconnected message if WS connection has been closed", async () => {
        render(<ChatRoom />);
        await server.connected;
        server.close();

        const p = screen.getByText(/Disconnected from the chat.../i);
        expect(p).toBeInTheDocument();
    });

    test("List of message visible", async () => {
        // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function#53294906
        window.HTMLElement.prototype.scrollIntoView = function () { };

        render(<ChatRoom />);
        await server.connected;
        server.send(JSON.stringify([mockMessageModel]));

        expect(screen.getByText(new RegExp(mockMessageModel.message, "i"))).toBeInTheDocument()
    });
});