import './App.css';
import React from 'react'

function App() {
  const [ teams, setTeams ] = React.useState([])
  const [ formData, setFormData ] = React.useState({
    teamId: "",
    teamName: ""
  })

  async function loadTeams(){
    const response = await fetch('http://localhost:4000/api/team',
      {
        method: 'GET'
      }
    ) 

	  if (!response.ok) {
	  	throw new Error(`HTTP error! status: ${response.status}`);
	  }

    const data = await response.json();
    await setTeams(data.data)
  }

  async function loadTeam(event){
    event.preventDefault()
    const selectedId = formData.teamId

    if(selectedId === '' || selectedId === undefined || selectedId === null) {
      return
    }

    const response = await fetch(`http://localhost:4000/api/team/${selectedId}`,
      {
        method: 'GET'
      }
    ) 

	  if (!response.ok) {
      if(response.status === 404){
        await setTeams([{id: 0, name: `no team with id of ${selectedId}`}])
        setFormData(
          {
            teamId: "",
            teamName: ""
          }
        )
        return
      }
	  	throw new Error(`HTTP error! status: ${response.status}`);
	  }

    const data = await response.json();
    await setTeams([data])
    setFormData(
      {
        teamId: "",
        teamName: ""
      }
    )
  }

  function changeHandler(event){
    const {name, value} = event.target

      setFormData(prevFormData => ({ 
          ...prevFormData, 
          [name]: value
      }))
  }

  const teamElements = teams.map(team => <li key={team.id}>{team.name}</li>)

  return (
    <div className="content">
      <h1>Hello F1</h1>
      <button onClick={loadTeams}>Get teams</button>
      { teams && <ul>{teamElements}</ul>}
      <form>
        <input 
          type="text"
          name="teamId"
          id="teamId"
          value={formData.teamId}
          placeholder="Team ID"
          onChange={changeHandler}
        />
        <button onClick={loadTeam}>Get team</button>
      </form>
    </div>
  );
}

export default App;
