import { Link } from "react-router-dom";

export default function Header(): JSX.Element {
  return (
    <div className="header">
      <Link className="logo" to="/">
        <h2>F1</h2>
      </Link>
      <div className="menu">
        <ul>
          <li>
            <Link className="button" to="/teams">
              Teams
            </Link>
          </li>
          <li>
            <Link className="button" to="/pilots">
              Pilots
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
