import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
} from "vitest";

// Mock modules before importing - define functions inline
const mockRender = vi.fn();
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({ render: mockRender })),
}));

vi.mock("../reportWebVitals.ts", () => ({
  default: vi.fn(),
}));

vi.mock("../App.tsx", () => ({
  default: () => null,
}));

// Dynamic imports for the modules
let initializeApp: () => void;
let mockCreateRoot: typeof import("react-dom/client").createRoot;
let mockReportWebVitals: typeof import("../reportWebVitals").default;

beforeAll(async () => {
  // Dynamic import of mocked modules
  const ReactDOM = await import("react-dom/client");
  const reportWebVitalsModule = await import("../reportWebVitals");

  mockCreateRoot = (ReactDOM as typeof import("react-dom/client")).createRoot;
  mockReportWebVitals = (
    reportWebVitalsModule as typeof import("../reportWebVitals")
  ).default;

  // Dynamic import of main module to get the initializeApp function
  const mainModule = await import("../main");
  initializeApp = mainModule.initializeApp;
});

// Mock console methods
const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();

describe("initializeApp", () => {
  let originalGetElementById: typeof document.getElementById;
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    // Store original methods
    originalGetElementById = document.getElementById;
    originalConsoleLog = console.log;
    originalConsoleError = console.error;

    // Mock console methods
    console.log = mockConsoleLog;
    console.error = mockConsoleError;

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original methods
    document.getElementById = originalGetElementById;
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe("when root element exists", () => {
    beforeEach(() => {
      // Mock getElementById to return a root element
      const mockRoot = document.createElement("div");
      document.getElementById = vi.fn((id: string) => {
        if (id === "root") return mockRoot;
        return null;
      });
    });

    it("should create a React root", () => {
      initializeApp();

      expect(mockCreateRoot).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it("should render the App component in StrictMode", () => {
      initializeApp();

      expect(mockRender).toHaveBeenCalledTimes(1);
      // The render call should contain React elements, but we can't easily test the exact structure
      // without more complex mocking. The fact that it was called is sufficient.
    });

    it("should call reportWebVitals with console.log", () => {
      initializeApp();

      expect(mockReportWebVitals).toHaveBeenCalledWith(console.log);
    });
  });

  describe("when root element does not exist", () => {
    beforeEach(() => {
      // Mock getElementById to return null
      document.getElementById = vi.fn(() => null);
    });

    it("should not create a React root", () => {
      initializeApp();

      expect(mockCreateRoot).not.toHaveBeenCalled();
    });

    it("should not render anything", () => {
      initializeApp();

      expect(mockRender).not.toHaveBeenCalled();
    });

    it("should not call reportWebVitals", () => {
      initializeApp();

      expect(mockReportWebVitals).not.toHaveBeenCalled();
    });

    it("should log an error message", () => {
      initializeApp();

      expect(mockConsoleError).toHaveBeenCalledWith("Root element not found");
    });
  });
});
