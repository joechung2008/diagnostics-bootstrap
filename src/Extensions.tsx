import { Nav } from "react-bootstrap";
import { byKey, isExtensionInfo, toNavLink } from "./utils";

const Extensions: React.FC<ExtensionsProps> = ({ extensions, onLinkClick }) => {
  const links = Object.values(extensions)
    .filter(isExtensionInfo)
    .map(toNavLink)
    .sort(byKey);

  return (
    <div className="extension-root overflow-x-hidden">
      <Nav variant="pills" className="flex-column" aria-label="Extensions">
        {links.map((link) => (
          <Nav.Link
            key={link.key}
            onClick={(e) => {
              e.preventDefault();
              onLinkClick?.(e, link);
            }}
          >
            {link.name}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Extensions;
