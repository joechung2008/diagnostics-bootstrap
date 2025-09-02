import Configuration from "./Configuration";
import StageDefinition from "./StageDefinition";

const Extension: React.FC<ExtensionProps> = ({
  config,
  extensionName,
  stageDefinition,
}) => {
  return (
    <div className="extension-root flex-grow-1">
      <h2 className="fw-bold">{extensionName}</h2>
      {config && <Configuration config={config} />}
      {stageDefinition && <StageDefinition stageDefinition={stageDefinition} />}
    </div>
  );
};

export default Extension;
