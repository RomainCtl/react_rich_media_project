import { render, screen, waitFor } from "@testing-library/react";
import { Keywords } from './Keywords';
import { mockKeywordModel } from "domain/test/mock-keyword";

describe("testing Keywords component", () => {
    test("Renders with null props without crashing", () => {
        const props = {
            onTimeSelected: () => { },
        };
        render(<Keywords {...props} />);
    });

    test("Message if no keywords", () => {
        const props = {
            onTimeSelected: () => { },
        };
        render(<Keywords {...props} />);
        const p = screen.getByText(/Keywords not here.../i);
        expect(p).toBeInTheDocument();
    });

    test("Renders keywords without crashing", async () => {
        const props = {
            keywords: [mockKeywordModel],
            onTimeSelected: () => { },
        };
        const { container } = render(<Keywords {...props} />);
        const keywordsList = await waitFor(() => container.getElementsByClassName("keywords"));

        expect(keywordsList.length).toEqual(1);
        expect(keywordsList[0]).toBeInTheDocument();

        props.keywords.forEach((keyword) => {
            keyword.data.forEach((word) => {
                expect(screen.getByText(new RegExp(word.title, "i"))).toBeInTheDocument()
            });
        });
    });
});