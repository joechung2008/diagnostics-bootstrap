import { describe, it, expect, vi, beforeEach } from "vitest";
import reportWebVitals from "../reportWebVitals";

// Mock web-vitals module
const mockOnCLS = vi.fn();
const mockOnINP = vi.fn();
const mockOnFCP = vi.fn();
const mockOnLCP = vi.fn();
const mockOnTTFB = vi.fn();

vi.mock("web-vitals", () => ({
  onCLS: mockOnCLS,
  onINP: mockOnINP,
  onFCP: mockOnFCP,
  onLCP: mockOnLCP,
  onTTFB: mockOnTTFB,
}));

describe("reportWebVitals", () => {
  const mockHandler = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when no handler is provided", () => {
    it("should not import web-vitals", async () => {
      reportWebVitals();

      // Wait for any potential async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockOnCLS).not.toHaveBeenCalled();
      expect(mockOnINP).not.toHaveBeenCalled();
      expect(mockOnFCP).not.toHaveBeenCalled();
      expect(mockOnLCP).not.toHaveBeenCalled();
      expect(mockOnTTFB).not.toHaveBeenCalled();
    });
  });

  describe("when undefined is provided", () => {
    it("should not import web-vitals", async () => {
      reportWebVitals(undefined);

      // Wait for any potential async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockOnCLS).not.toHaveBeenCalled();
      expect(mockOnINP).not.toHaveBeenCalled();
      expect(mockOnFCP).not.toHaveBeenCalled();
      expect(mockOnLCP).not.toHaveBeenCalled();
      expect(mockOnTTFB).not.toHaveBeenCalled();
    });
  });

  describe("when a valid function handler is provided", () => {
    it("should call all web-vitals functions with the handler", async () => {
      reportWebVitals(mockHandler);

      // Wait for the dynamic import to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockOnCLS).toHaveBeenCalledWith(mockHandler);
      expect(mockOnINP).toHaveBeenCalledWith(mockHandler);
      expect(mockOnFCP).toHaveBeenCalledWith(mockHandler);
      expect(mockOnLCP).toHaveBeenCalledWith(mockHandler);
      expect(mockOnTTFB).toHaveBeenCalledWith(mockHandler);
    });

    it("should call all web-vitals functions exactly once each", async () => {
      reportWebVitals(mockHandler);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockOnCLS).toHaveBeenCalledTimes(1);
      expect(mockOnINP).toHaveBeenCalledTimes(1);
      expect(mockOnFCP).toHaveBeenCalledTimes(1);
      expect(mockOnLCP).toHaveBeenCalledTimes(1);
      expect(mockOnTTFB).toHaveBeenCalledTimes(1);
    });

    it("should work with console.log as handler", async () => {
      const originalConsoleLog = console.log;
      console.log = mockHandler;

      reportWebVitals(console.log);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockOnCLS).toHaveBeenCalledWith(console.log);
      expect(mockOnINP).toHaveBeenCalledWith(console.log);
      expect(mockOnFCP).toHaveBeenCalledWith(console.log);
      expect(mockOnLCP).toHaveBeenCalledWith(console.log);
      expect(mockOnTTFB).toHaveBeenCalledWith(console.log);

      console.log = originalConsoleLog;
    });
  });

  describe("multiple calls", () => {
    it("should handle multiple calls without errors", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      // Multiple calls should not throw errors
      expect(() => {
        reportWebVitals(handler1);
        reportWebVitals(handler2);
      }).not.toThrow();

      await new Promise((resolve) => setTimeout(resolve, 0));

      // At least one of the handlers should have been used
      const totalCalls = mockOnCLS.mock.calls.length;
      expect(totalCalls).toBeGreaterThan(0);
    });
  });
});
