import { render, screen, waitFor } from "@testing-library/react";
import { TabPanel } from './TabPanel';

describe("testing TabPanel component", () => {
    test("Renders without crashing", () => {
        const props = {
            index: 0,
            value: 5,
        };
        render(<TabPanel {...props} />);
    });

    test("Renders children is hidden (index=value)", () => {
        const props = {
            index: 0,
            value: 5,
            children: <p role="child">children</p>
        };
        render(<TabPanel {...props} />);

        const child = screen.queryByRole("child");
        expect(child).toBeNull();
    });

    test("Renders children is displayed (index=value)", async () => {
        const props = {
            index: 0,
            value: 0,
            children: <p role="child">children</p>
        };
        render(<TabPanel {...props} />);

        const child = await waitFor(() => screen.findByRole("child"));
        expect(child).toBeInTheDocument();
    });
});

