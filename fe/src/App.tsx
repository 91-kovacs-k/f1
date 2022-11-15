import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Team from "./components/Team";
import Pilot from "./components/Pilot";
import Header from "./components/Header";
import UpdatePilot from "./components/UpdatePilot";
import UpdateTeam from "./components/UpdateTeam";
import CreateTeam from "./components/CreateTeam";
import CreatePilot from "./components/CreatePilot";
import Register from "./components/Register";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import { User } from "./components/types";

export const UserContext = createContext({
  userContext: undefined as User | undefined,
  setUserContext: (userContext: User) => {},
});

function App(): JSX.Element {
  const [user, setUser] = useState({ name: "", password: "" } as User);

  return (
    <div className="page-content">
      <UserContext.Provider
        value={{ userContext: user, setUserContext: setUser }}
      >
        <BrowserRouter>
          <Header />
          <Routes>
            {user.name ? (
              <>
                <Route path="/teams" element={<Team />} />
                <Route path="/team/:id" element={<UpdateTeam />} />
                <Route path="/createteam/" element={<CreateTeam />} />
                <Route path="/pilots" element={<Pilot />} />
                <Route path="/pilot/:id" element={<UpdatePilot />} />
                <Route path="/createpilot" element={<CreatePilot />} />
              </>
            ) : (
              <>
                <Route path="/teams" element={<Login />} />
                <Route path="/team/:id" element={<Login />} />
                <Route path="/createteam/" element={<Login />} />
                <Route path="/pilots" element={<Login />} />
                <Route path="/pilot/:id" element={<Login />} />
                <Route path="/createpilot" element={<Login />} />
              </>
            )}
            <Route path="/" element={<Welcome />}></Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
