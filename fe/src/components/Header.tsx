import { useContext } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import { User, logout, BackendError } from "./utils";

export default function Header(): JSX.Element {
  const { userContext, setUserContext } = useContext(UserContext);

  const handleLogout = async () => {
    const fetch = await logout();
    if ((fetch as BackendError).reason) {
      // server error
    } else {
      setUserContext({ name: "", password: "" } as User);
    }
  };

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
          <div className="account-loggedIn">
            <div className="loggedIn">
              <p>Welcome back, {userContext?.name}</p>
              <button className="button" onClick={() => void handleLogout()}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
