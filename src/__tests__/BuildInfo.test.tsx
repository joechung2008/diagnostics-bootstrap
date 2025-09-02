import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BuildInfo from "../BuildInfo";

describe("BuildInfo", () => {
  it("renders correctly", () => {
    const { container } = render(<BuildInfo buildVersion="1.0.0" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
