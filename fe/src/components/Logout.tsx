import { useState, useContext } from "react";
import { UserContext } from "../App";
import { Link, Navigate } from "react-router-dom";
import { User, logout, BackendError } from "./utils";

export default function Logout() {
  const { userContext, setUserContext } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  const handleLogout = async () => {
    const fetch = await logout();
    if (fetch) {
      setUserContext({ name: "" });
      setRedirect(true);
    } else {
      // server error
    }
    // if ((fetch as BackendError).reason) {
    //   // server error
    // } else {
    //   setUserContext({ name: "", password: "" } as User);
    // }
  };

  if (redirect) {
    return <Navigate to="/" />;
  } else {
    return (
      <div className="account-loggedIn">
        <div className="loggedIn">
          <p>Welcome back, {userContext?.name}</p>
          <button className="button" onClick={() => void handleLogout()}>
            Logout
          </button>
        </div>
      </div>
    );
  }
}
