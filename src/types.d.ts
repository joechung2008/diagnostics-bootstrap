interface BuildInfoProps {
  buildVersion: string;
}

interface ConfigurationProps {
  config: Record<string, string>;
}

interface Diagnostics {
  buildInfo: BuildInfoProps;
  extensions: Record<string, Extension>;
  serverInfo: ServerInfoProps;
}

interface ExtensionError {
  lastError: {
    errorMessage: string;
    time: string;
  };
}

interface ExtensionInfo {
  extensionName: string;
  config?: Record<string, string>;
  stageDefinition?: Record<string, string[]>;
}

type Extension = ExtensionInfo | ExtensionError;

type ExtensionProps = ExtensionInfo;

interface ExtensionsProps {
  extensions: Record<string, Extension>;
  onLinkClick(ev?: React.MouseEvent, item?: KeyedNavLink);
}

type KeyedNavLink = {
  key: string;
  name: string;
  url?: string;
  [prop: string]: unknown;
};

interface KeyValuePair<TValue> {
  key: string;
  value: TValue;
}

interface ServerInfoProps {
  deploymentId: string;
  extensionSync: {
    totalSyncAllCount: number;
  };
  hostname: string;
  nodeVersions: string;
  serverId: string;
  uptime: number;
}

interface StageDefinitionProps {
  stageDefinition: Record<string, string[]>;
}
