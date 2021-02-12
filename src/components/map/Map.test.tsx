import { render, screen, waitFor } from "@testing-library/react";
import { Map } from './Map';
import { mockWaypointModel } from "domain/test/mock-waypoint";

describe("testing Map component", () => {
    test("Renders with null props without crashing", () => {
        const props = {
            onPointTimeSelected: () => { },
        };
        render(<Map {...props} />);
    });

    test("Message if no waypoints", () => {
        const props = {
            onPointTimeSelected: () => { },
        };
        render(<Map {...props} />);
        const p = screen.getByText(/Waypoint in progress.../i);
        expect(p).toBeInTheDocument();
    });
});