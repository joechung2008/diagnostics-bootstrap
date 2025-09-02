import { Table } from "react-bootstrap";

const Configuration: React.FC<ConfigurationProps> = ({ config }) => {
  const items = Object.entries(config).reduce<KeyValuePair<string>[]>(
    (previous, [key, value]) => [...previous, { key, value }],
    []
  );

  return (
    <div>
      <h3>Configuration</h3>
      <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.key}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Configuration;
