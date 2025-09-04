import { Table } from "react-bootstrap";

const StageDefinition: React.FC<StageDefinitionProps> = ({
  stageDefinition,
}) => {
  const items = Object.entries(stageDefinition).reduce<
    KeyValuePair<string[]>[]
  >((previous, [key, value]) => [...previous, { key, value }], []);

  return (
    <div>
      <h3>Stage Definitions</h3>
      <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key}>
              <td>{item.key}</td>
              <td>{item.value.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StageDefinition;
