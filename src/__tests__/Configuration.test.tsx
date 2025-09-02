import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Configuration from "../Configuration";

describe("Configuration", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Configuration config={{ key1: "value1", key2: "value2" }} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
