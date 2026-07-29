import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("Recordock idle popup", () => {
  it("displays the Recordock product identity", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: "Recordock",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Record your screen. Keep it local."),
    ).toBeInTheDocument();
  });

  it("displays all supported recording sources", () => {
    render(<App />);

    expect(screen.getByText("Browser tab")).toBeInTheDocument();

    expect(
      screen.getByText("Application window"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Complete monitor"),
    ).toBeInTheDocument();
  });

it("enables the recording button", () => {
  render(<App />);

  expect(
    screen.getByRole("button", {
      name: "Start Recording",
    }),
  ).toBeEnabled();
});

  it("displays the local privacy message", () => {
    render(<App />);

    expect(
      screen.getByText(
        /recordings are processed locally and remain on your device/i,
      ),
    ).toBeInTheDocument();
  });
});