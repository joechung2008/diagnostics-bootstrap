import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

// Mock the child components
vi.mock("../BuildInfo", () => ({
  default: ({ buildVersion }: BuildInfoProps) => (
    <div data-testid="build-info">Build: {buildVersion}</div>
  ),
}));

vi.mock("../Extension", () => ({
  default: (props: ExtensionProps) => (
    <div data-testid="extension">{props.extensionName}</div>
  ),
}));

vi.mock("../Extensions", () => ({
  default: ({ extensions, onLinkClick }: ExtensionsProps) => (
    <div data-testid="extensions">
      {Object.entries(extensions).map(([key, ext]) => {
        // Only render button if extension is ExtensionInfo (has extensionName)
        if (ext && typeof ext === "object" && "extensionName" in ext) {
          return (
            <button
              data-testid={`extension-link-${key}`}
              key={key}
              type="button"
              onClick={(e) => onLinkClick(e, { key, name: ext.extensionName })}
            >
              {key}
            </button>
          );
        }
        return null;
      })}
    </div>
  ),
}));

vi.mock("../ServerInfo", () => ({
  default: ({ hostname }: ServerInfoProps) => (
    <div data-testid="server-info">Server: {hostname}</div>
  ),
}));

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("App", () => {
  const mockDiagnostics = {
    buildInfo: { buildVersion: "1.0.0" },
    extensions: {
      websites: { extensionName: "websites" },
      paasserverless: { extensionName: "paasserverless" },
      testExt: { extensionName: "testExt" },
    },
    serverInfo: {
      hostname: "test-server",
      deploymentId: "123",
      extensionSync: { totalSyncAllCount: 5 },
      nodeVersions: "18.0.0",
      serverId: "server-1",
      uptime: 3600,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockDiagnostics),
    });
  });

  describe("initial rendering", () => {
    it("renders loading state when diagnostics is not loaded", () => {
      mockFetch.mockResolvedValue(new Promise(() => {})); // Never resolves
      render(<App />);
      expect(screen.queryByText("Public Cloud")).toBeNull();
    });

    it("renders null when diagnostics is undefined", () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(undefined),
      });
      const { container } = render(<App />);
      // Component returns null when diagnostics is falsy
      expect(container.firstChild).toBeNull();
    });
  });

  describe("environment dropdown", () => {
    it("renders environment dropdown with default Public Cloud", async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText("Public Cloud")).toBeTruthy();
      });
    });

    it("changes environment when dropdown item is clicked", async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText("Public Cloud")).toBeTruthy();
      });

      const dropdownToggle = screen.getByRole("button", {
        name: /public cloud/i,
      });

      await act(async () => {
        fireEvent.click(dropdownToggle);
      });

      const fairfaxOption = screen.getByText("Fairfax");

      await act(async () => {
        fireEvent.click(fairfaxOption);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://hosting.azureportal.usgovcloudapi.net/api/diagnostics"
      );
    });

    it("clears extension when environment changes", async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText("Public Cloud")).toBeTruthy();
      });

      // First set an extension by clicking the extension link
      const extensionLink = screen.getByTestId("extension-link-websites");
      fireEvent.click(extensionLink);

      expect(screen.getByTestId("extension")).toBeTruthy();

      // Change environment
      const dropdownToggle = screen.getByRole("button", {
        name: /public cloud/i,
      });

      await act(async () => {
        fireEvent.click(dropdownToggle);
      });

      const fairfaxOption = screen.getByText("Fairfax");

      await act(async () => {
        fireEvent.click(fairfaxOption);
      });

      // Extension should be cleared
      expect(screen.queryByTestId("extension")).toBeNull();
    });
  });

  describe("tab navigation", () => {
    it("renders extensions tab by default", async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText("Extensions")).toBeTruthy();
      });

      expect(screen.getByTestId("extensions")).toBeTruthy();
    });

    it("switches to build tab when clicked", async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText("Build Information")).toBeTruthy();
      });

      const buildTab = screen.getByText("Build Information");
      fireEvent.click(buildTab);

      expect(screen.getByTestId("build-info")).toBeTruthy();
      expect(screen.queryByTestId("extensions")).toBeNull();
    });

    it("switches to server tab when clicked", async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText("Server Information")).toBeTruthy();
      });

      const serverTab = screen.getByText("Server Information");
      fireEvent.click(serverTab);

      expect(screen.getByTestId("server-info")).toBeTruthy();
      expect(screen.queryByTestId("extensions")).toBeNull();
    });
  });

  describe("extension buttons", () => {
    it("shows paasserverless button when paasserverless extension exists", async () => {
      render(<App />);
      await waitFor(() => {
        const paasserverlessButtons = screen.getAllByText("paasserverless");
        expect(paasserverlessButtons.length).toBeGreaterThan(0);
      });
    });

    it("shows websites button", async () => {
      render(<App />);
      await waitFor(() => {
        const websitesButtons = screen.getAllByText("websites");
        expect(websitesButtons.length).toBeGreaterThan(0);
      });
    });

    it("sets extension when websites button is clicked", async () => {
      render(<App />);
      await waitFor(() => {
        const websitesButtons = screen.getAllByText("websites");
        expect(websitesButtons.length).toBeGreaterThan(0);
      });

      // Click the top-level websites button (not the extension link)
      const websitesButtons = screen.getAllByRole("button", {
        name: /websites/i,
      });
      const topLevelWebsitesButton = websitesButtons.find(
        (button) =>
          !button.getAttribute("data-testid")?.includes("extension-link")
      );
      fireEvent.click(topLevelWebsitesButton!);

      const extensionElement = screen.getByTestId("extension");
      expect(extensionElement.textContent).toBe("websites");
    });

    it("sets extension when paasserverless button is clicked", async () => {
      render(<App />);
      await waitFor(() => {
        const paasserverlessButtons = screen.getAllByText("paasserverless");
        expect(paasserverlessButtons.length).toBeGreaterThan(0);
      });

      // Click the top-level paasserverless button (not the extension link)
      const paasserverlessButtons = screen.getAllByRole("button", {
        name: /paasserverless/i,
      });
      const topLevelPaasserverlessButton = paasserverlessButtons.find(
        (button) =>
          !button.getAttribute("data-testid")?.includes("extension-link")
      );
      fireEvent.click(topLevelPaasserverlessButton!);

      const extensionElement = screen.getByTestId("extension");
      expect(extensionElement.textContent).toBe("paasserverless");
    });
  });

  describe("extensions component interaction", () => {
    it("sets extension when extension link is clicked", async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId("extensions")).toBeTruthy();
      });

      const extensionLink = screen.getByTestId("extension-link-testExt");
      fireEvent.click(extensionLink);

      const extensionElement = screen.getByTestId("extension");
      expect(extensionElement.textContent).toBe("testExt");
    });
  });

  describe("API calls", () => {
    it("fetches diagnostics on mount", async () => {
      render(<App />);
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "https://hosting.portal.azure.net/api/diagnostics"
        );
      });
    });

    it("fetches diagnostics when environment changes", async () => {
      render(<App />);
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Change environment
      const dropdownToggle = screen.getByRole("button", {
        name: /public cloud/i,
      });

      await act(async () => {
        fireEvent.click(dropdownToggle);
      });

      const fairfaxOption = screen.getByText("Fairfax");

      await act(async () => {
        fireEvent.click(fairfaxOption);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
      expect(mockFetch).toHaveBeenLastCalledWith(
        "https://hosting.azureportal.usgovcloudapi.net/api/diagnostics"
      );
    });
  });

  describe("conditional rendering", () => {
    it("does not show paasserverless button when extension does not exist", async () => {
      const diagnosticsWithoutPaas = {
        ...mockDiagnostics,
        extensions: {
          websites: { extensionName: "websites" },
        },
      };

      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(diagnosticsWithoutPaas),
      });

      render(<App />);
      await waitFor(() => {
        expect(screen.getByText("Public Cloud")).toBeTruthy();
      });

      expect(screen.queryByText("paasserverless")).toBeNull();
    });

    it("does not show paasserverless button when extension is not ExtensionInfo", async () => {
      const diagnosticsWithError = {
        ...mockDiagnostics,
        extensions: {
          ...mockDiagnostics.extensions,
          paasserverless: {
            lastError: { errorMessage: "Error", time: "2023-01-01" },
          },
        },
      };

      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(diagnosticsWithError),
      });

      render(<App />);
      await waitFor(() => {
        expect(screen.getByText("Public Cloud")).toBeTruthy();
      });

      expect(screen.queryByText("paasserverless")).toBeNull();
    });
  });
});
