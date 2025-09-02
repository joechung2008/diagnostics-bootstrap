import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Extension from "../Extension";

describe("Extension", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Extension
        extensionName="TestExtension"
        config={{ ckey: "cvalue" }}
        stageDefinition={{ stage1: ["step1", "step2"] }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
