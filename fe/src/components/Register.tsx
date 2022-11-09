import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../App";
import { register, User } from "./utils";

export default function Register() {
  const { userContext, setUserContext } = useContext(UserContext);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [response, setResponse] = useState("");
  const [redirect, setRedirect] = useState(false);

  const changeHandler = (event: React.FormEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const submit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    const name = formData.name.trim();
    const password = formData.password.trim();
    if (name === "" || password === "") {
      return;
    }

    const body = JSON.stringify({
      username: name,
      password: password,
    });

    const fetch = await register(body);
    if (fetch.error) {
      setResponse(`Error while creating account: ${fetch.error.reason}`);
    } else {
      setResponse(`Account successfully created. Redirecting...`);
      setUserContext(fetch.data as User);
      setTimeout(() => setRedirect(true), 2000);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  } else {
    return (
      <div className="register">
        {response ? (
          <p className="response">{response}</p>
        ) : (
          <>
            <form>
              <div className="inputs">
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={changeHandler}
                  placeholder="Username"
                  value={formData.name}
                />
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={changeHandler}
                  placeholder="Password"
                  value={formData.password}
                />
              </div>
              <button onClick={(event) => void submit(event)}>
                Register account
              </button>
            </form>
            <p className="Link">
              If you already have an account yet, click{" "}
              <Link to="/login">here</Link>.
            </p>
          </>
        )}
      </div>
    );
  }
}
