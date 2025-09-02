import { describe, it, expect } from "vitest";
import { isExtensionInfo, byKey, toNavLink } from "../utils";

describe("isExtensionInfo", () => {
  it("should return true for ExtensionInfo", () => {
    const ext: ExtensionInfo = { extensionName: "test" };
    expect(isExtensionInfo(ext)).toBe(true);
  });

  it("should return false for ExtensionError", () => {
    const ext: ExtensionError = {
      lastError: { errorMessage: "error", time: "now" },
    };
    expect(isExtensionInfo(ext)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isExtensionInfo(undefined)).toBe(false);
  });
});

describe("byKey", () => {
  it("should return -1 if a.key < b.key", () => {
    const a: KeyedNavLink = { key: "a", name: "a" };
    const b: KeyedNavLink = { key: "b", name: "b" };
    expect(byKey(a, b)).toBe(-1);
  });

  it("should return 1 if a.key > b.key", () => {
    const a: KeyedNavLink = { key: "b", name: "b" };
    const b: KeyedNavLink = { key: "a", name: "a" };
    expect(byKey(a, b)).toBe(1);
  });

  it("should return 0 if a.key === b.key", () => {
    const a: KeyedNavLink = { key: "a", name: "a" };
    const b: KeyedNavLink = { key: "a", name: "a" };
    expect(byKey(a, b)).toBe(0);
  });
});

describe("toNavLink", () => {
  it("should transform ExtensionInfo to KeyedNavLink", () => {
    const ext: ExtensionInfo = { extensionName: "test" };
    const result = toNavLink(ext);
    expect(result).toEqual({
      key: "test",
      name: "test",
      url: "",
    });
  });
});
