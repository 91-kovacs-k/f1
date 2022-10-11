import './App.css';
import React from 'react'
import Team from './components/Team'
import Pilot from './components/Pilot'
import CreateTeam from './components/CreateTeam'
import CreatePilot from './components/CreatePilot'

function App() {

  const [site, setSite] = React.useState(0)

  function toggleSite(siteNum) {
    setSite(siteNum)
  }

  function renderSite(){
    switch(site){
      case 1:
        return <Team />
      case 2:
        return <CreateTeam />
      case 3:
        return <Pilot />
      case 4:
        return <CreatePilot />
      default:
        return
    }
  }

  return (
    <div className="content">
      <h1>Hello F1</h1>
      <ul>
        <li><button onClick={() => toggleSite(1)}>Get Teams</button></li>
        <li><button onClick={() => toggleSite(2)}>Add Team</button></li>
        <li><button onClick={() => toggleSite(3)}>Get Pilots</button></li>
        <li><button onClick={() => toggleSite(4)}>Add Pilot</button></li>
      </ul>

      <div className="siteContent">
      {
        renderSite()
      }
      </div>
    </div>
  );
}

export default App;
