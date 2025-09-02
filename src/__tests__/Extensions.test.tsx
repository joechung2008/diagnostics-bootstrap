import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Extensions from "../Extensions";

describe("Extensions", () => {
  it("renders correctly", () => {
    const extensions = {
      ext1: { extensionName: "ext1" },
      ext2: { extensionName: "ext2" },
    };
    const { container } = render(
      <Extensions extensions={extensions} onLinkClick={() => {}} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
