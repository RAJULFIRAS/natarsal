import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./button";

import "@testing-library/jest-dom/vitest";

describe("Button", () => {
  it("should render button with children", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply primary variant by default", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-natarsal-gold");
  });

  it("should apply outline variant when specified", () => {
    render(<Button variant="outline">Click Me</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border-2 border-natarsal-gold");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should apply fullWidth class when fullWidth is true", () => {
    render(<Button fullWidth>Click Me</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });
});
