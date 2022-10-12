import './App.css';
import React from 'react'
import Header from './components/Header'
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
    <div className="page">
      <div className='page-content'>
        <Header toggleSite={toggleSite} />
        
        <div className="siteContent">
        {
          renderSite()
        }
        { site === 0 ?
          <div className='welcome'>
            <h1>Welcome to F1 Exercise project!</h1>
          </div>
        : ""}
        </div>
        </div>
    </div>
  );
}

export default App;
