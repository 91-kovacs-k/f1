import { useContext } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import Logout from "./Logout";

export default function Header(): JSX.Element {
  const { userContext, setUserContext } = useContext(UserContext);

  return (
    <div className="header">
      <Link className="logo" to="/">
        <h2>F1</h2>
      </Link>
      <div className="navigation">
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
        {userContext?.name === "" ? (
          <div className="account">
            <ul>
              <li>
                <Link className="button" to="/login">
                  Login
                </Link>
              </li>
              <li>
                <Link className="button" to="/register">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <Logout />
        )}
      </div>
    </div>
  );
}
