import { render, screen, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import { App } from './App';
import { mockDataModel } from "domain/test/mock-data";


describe("testing App", () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    test("backend is called", () => {
        fetchMock.mockResponseOnce(JSON.stringify(mockDataModel));

        render(<App />);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('https://imr3-react.herokuapp.com/backend');
    });

    test("Message if backend is not responding", () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));

        render(<App />);
        const alert = screen.getByText(/Loading data.../i);
        expect(alert).toBeInTheDocument();
    });

    test("Grid is present", async () => {
        fetchMock.mockResponseOnce(JSON.stringify(mockDataModel));

        const { container } = render(<App />);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('https://imr3-react.herokuapp.com/backend');

        await waitFor(() => expect(container.firstChild).toHaveClass("body"));
    });
});