import './App.css';
import React from 'react'
import Team from './components/Team'
import Create from './components/Create'

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
        return <Create />
      default:
        return
    }
  }

  return (
    <div className="content">
      <h1>Hello F1</h1>
      <ul>
        <li><button onClick={() => toggleSite(1)}>Get teams</button></li>
        <li><button onClick={() => toggleSite(2)}>Add Team</button></li>
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
