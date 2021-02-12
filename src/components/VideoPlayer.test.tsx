import { render, screen, waitFor } from "@testing-library/react";
import { VideoPlayer } from './VideoPlayer';
import { mockFilmModel } from "domain/test/mock-film";

describe("testing VideoPlayer component", () => {
    test("Renders with null props without crashing", () => {
        const props = {};
        render(<VideoPlayer {...props} />);
    });

    test("Message if no film", () => {
        const props = {};
        render(<VideoPlayer {...props} />);
        const p = screen.getByText(/Video is coming !/i);
        expect(p).toBeInTheDocument();
    });

    test("Renders keywords without crashing", async () => {
        const props = {
            film: mockFilmModel,
        };
        const { container } = render(<VideoPlayer {...props} />);
        const divVideo = await waitFor(() => container.querySelector(`[id="video"]`));

        expect(divVideo).toBeInTheDocument();
        expect(divVideo?.firstChild?.nodeName).toEqual("VIDEO");
    });
});