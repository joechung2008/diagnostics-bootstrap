import { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Dropdown, Nav } from "react-bootstrap";
import BuildInfo from "./BuildInfo";
import Extension from "./Extension";
import Extensions from "./Extensions";
import ServerInfo from "./ServerInfo";
import { isExtensionInfo } from "./utils";

type Environment =
  | "https://hosting.portal.azure.net/api/diagnostics"
  | "https://hosting.azureportal.usgovcloudapi.net/api/diagnostics"
  | "https://hosting.azureportal.chinacloudapi.cn/api/diagnostics";

const Environment = {
  Public: "https://hosting.portal.azure.net/api/diagnostics",
  Fairfax: "https://hosting.azureportal.usgovcloudapi.net/api/diagnostics",
  Mooncake: "https://hosting.azureportal.chinacloudapi.cn/api/diagnostics",
} as const;

const App: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<Diagnostics>();
  const [extension, setExtension] = useState<ExtensionInfo>();
  const [environment, setEnvironment] = useState<Environment>(
    Environment.Public
  );
  const [selectedTab, setSelectedTab] = useState<string>("extensions");

  const environmentName = useMemo(() => {
    switch (environment) {
      case Environment.Public:
        return "Public Cloud";
      case Environment.Fairfax:
        return "Fairfax";
      case Environment.Mooncake:
        return "Mooncake";
      default:
        return "Select environment";
    }
  }, [environment]);

  const showPaasServerless = useMemo(
    () => isExtensionInfo(diagnostics?.extensions["paasserverless"]),
    [diagnostics?.extensions]
  );

  const environments = useMemo(
    () => [
      {
        key: "public",
        text: "Public Cloud",
        selected: environment === Environment.Public,
        onClick: () => {
          setEnvironment(Environment.Public);
          setExtension(undefined);
        },
      },
      {
        key: "fairfax",
        text: "Fairfax",
        selected: environment === Environment.Fairfax,
        onClick: () => {
          setEnvironment(Environment.Fairfax);
          setExtension(undefined);
        },
      },
      {
        key: "mooncake",
        text: "Mooncake",
        selected: environment === Environment.Mooncake,
        onClick: () => {
          setEnvironment(Environment.Mooncake);
          setExtension(undefined);
        },
      },
    ],
    [environment]
  );

  useEffect(() => {
    const getDiagnostics = async () => {
      const response = await fetch(environment);
      setDiagnostics(await response.json());
    };
    getDiagnostics();
  }, [environment]);

  if (!diagnostics) {
    return null;
  }

  const { buildInfo, extensions, serverInfo } = diagnostics;

  const handleLinkClick = (_?: React.MouseEvent, item?: KeyedNavLink) => {
    if (item) {
      const extension = extensions[item.key];
      if (isExtensionInfo(extension)) {
        setExtension(extension);
      }
    }
  };

  return (
    <div className="flexbox">
      <ButtonGroup className="w-auto align-self-start">
        <Dropdown>
          <Dropdown.Toggle variant="outline-primary" id="environment-dropdown">
            {environmentName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {environments.map((env) => (
              <Dropdown.Item
                key={env.key}
                onClick={env.onClick}
                active={env.selected}
              >
                {env.text}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {showPaasServerless && (
          <Button
            variant="outline-secondary"
            onClick={() => {
              const paasserverless = diagnostics?.extensions["paasserverless"];
              if (isExtensionInfo(paasserverless)) {
                setExtension(paasserverless);
              }
            }}
          >
            paasserverless
          </Button>
        )}
        <Button
          variant="outline-secondary"
          onClick={() => {
            const websites = diagnostics?.extensions["websites"];
            if (isExtensionInfo(websites)) {
              setExtension(websites);
            }
          }}
        >
          websites
        </Button>
      </ButtonGroup>
      <Nav
        variant="tabs"
        activeKey={selectedTab}
        onSelect={(selectedKey) => setSelectedTab(selectedKey || "extensions")}
      >
        <Nav.Item>
          <Nav.Link eventKey="extensions">Extensions</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="build">Build Information</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="server">Server Information</Nav.Link>
        </Nav.Item>
      </Nav>
      {selectedTab === "extensions" && (
        <div className="tab-panel">
          <div className="stack">
            <Extensions extensions={extensions} onLinkClick={handleLinkClick} />
            {extension && <Extension {...extension} />}
          </div>
        </div>
      )}
      {selectedTab === "build" && (
        <div className="tab-panel">
          <BuildInfo {...buildInfo} />
        </div>
      )}
      {selectedTab === "server" && (
        <div className="tab-panel">
          <ServerInfo {...serverInfo} />
        </div>
      )}
    </div>
  );
};

export default App;
