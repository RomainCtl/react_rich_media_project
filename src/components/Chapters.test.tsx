import { render, screen, waitFor } from "@testing-library/react";
import { Chapters } from './Chapters';
import { mockChapterModel } from "domain/test/mock-chapter";

describe("testing Chapter component", () => {
    test("Renders with null props without crashing", () => {
        const props = {
            onSelectTime: () => { },
        };
        render(<Chapters {...props} />);
    });

    test("Message if no chapters", () => {
        const props = {
            onSelectTime: () => { },
        };
        render(<Chapters {...props} />);
        const p = screen.getByText(/Where are the chapters.../i);
        expect(p).toBeInTheDocument();
    });

    test("Renders with chapters without crashing", async () => {
        const props = {
            chapters: [mockChapterModel],
            onSelectTime: () => { },
        };
        const { container } = render(<Chapters {...props} />);
        const chapterList = await waitFor(() => container.getElementsByClassName("chapter_list"));

        expect(chapterList.length).toEqual(1);
        expect(chapterList[0]).toBeInTheDocument();

        props.chapters.forEach((chapter) => {
            expect(screen.getByText(new RegExp(chapter.title, "i"))).toBeInTheDocument()
        });
    });

    test("Renders with timeline without crashing", async () => {
        const props = {
            chapters: [mockChapterModel],
            onSelectTime: () => { },
        };
        const { container } = render(<Chapters {...props} />);
        const timeline = await waitFor(() => container.getElementsByClassName("timeline"));

        expect(timeline.length).toEqual(1);
        expect(timeline[0]).toBeInTheDocument();
    });
});
