import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Team from "./components/Team";
import Pilot from "./components/Pilot";
import Header from "./components/Header";
import reportWebVitals from "./reportWebVitals";
import UpdatePilot from "./components/UpdatePilot";
import UpdateTeam from "./components/UpdateTeam";
import CreateTeam from "./components/CreateTeam";
import CreatePilot from "./components/CreatePilot";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <div className="page">
      <div className="page-content">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/teams" element={<Team />} />
            <Route path="/team/:id" element={<UpdateTeam />} />
            <Route path="/createteam/" element={<CreateTeam />} />
            <Route path="/pilots" element={<Pilot />} />
            <Route path="/pilot/:id" element={<UpdatePilot />} />
            <Route path="/createpilot" element={<CreatePilot />} />
            <Route path="/" element={<App />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
