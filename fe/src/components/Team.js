import React from 'react';
import Update from './Update'

export default function Team(params) {
    const [teams, setTeams] = React.useState([]);
    const [formData, setFormData] = React.useState({
        teamSearch: ""
    });
    const [update, setUpdate] = React.useState()

    React.useEffect(() => {
        getTeams()
    }, [])

    async function getTeams() {
        const response = await fetch("http://localhost:4000/api/team", {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        await setTeams(data);
    }

    async function getTeam(event) {
        event.preventDefault()
        const searchTerm = formData.teamSearch

        if (searchTerm === '' || searchTerm === undefined || searchTerm === null) {
            return getTeams()
        }

        if (!isNaN(+searchTerm)) {
            const response = await fetch(`http://localhost:4000/api/team/${searchTerm}`,
                {
                    method: 'GET'
                }
            )

            if (!response.ok) {
                if (response.status === 404) {
                    await setTeams([{ id: 0, name: `no team with id of ${searchTerm}` }])
                    setFormData(
                        {
                            teamSearch: ""
                        }
                    )
                    return
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            await setTeams([data])
        } else {
            const response = await fetch(`http://localhost:4000/api/team/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ type: 'search', name: searchTerm, limit: 0 })
                }
            )

            if (!response.ok) {
                if (response.status === 404) {
                    await setTeams([{ id: 0, name: `no team with name of ${searchTerm}` }])
                    setFormData(
                        {
                            teamSearch: ""
                        }
                    )
                    return
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            await setTeams(data)
        }

        setFormData(
            {
                teamSearch: ""
            }
        )
    }
    
    async function deleteTeam(id){
        const response = await fetch(`http://localhost:4000/api/team/${id}`,
                {
                    method: 'DELETE'
                }
            )

            if (!response.ok) {
                if (response.status === 404) {
                    await setTeams([{ id: 0, name: `no team with the id of ${id}` }])
                    setFormData({ teamSearch: "" })
                    return
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if(data.rowsAffected[0] === 1){
                await getTeams()
            }else{
                throw new Error(`Error while deleting: ${data}`)
            }
    }

    function toggleUpdate(team){
        setUpdate(team)
    }

    function changeHandler(event) {
        const { name, value } = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    function renderUpdate(){
        return <Update team={update} />
    }

    function renderTeams(){
        return (
            <>
                <ul> {teamElements} </ul>
                <form>
                    <input
                        type="text"
                        name="teamSearch"
                        id="teamSearch"
                        value={formData.teamSearch}
                        placeholder="Team ID or Name"
                        onChange={changeHandler}
                    />
                    <button onClick={getTeam}>Get team</button>
                </form>
            </>
        )
    }

    const teamElements = teams.map(team => <div className="teamItem">
        <li key={team.id}>{team.name}</li>
        <button onClick={() => toggleUpdate(team)}>update</button>
        <button onClick={() => deleteTeam(team.id)}>delete</button>
    </div>)
    
    return (
        <div className="team">
            {update ? renderUpdate() : (teams && renderTeams()) }
        </div>
    );
}
