import React from 'react';
import UpdatePilot from './UpdatePilot'

export default function Pilot(params) {
    const [pilots, setPilots] = React.useState([]);
    const [formData, setFormData] = React.useState({
        pilotSearch: ""
    });
    const [update, setUpdate] = React.useState()

    React.useEffect(() => {
        getPilots()
    }, [])

    async function getPilots() {
        const response = await fetch("http://localhost:4000/api/pilot", {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        await setPilots(data);
    }

    async function getPilot(event) {
        event.preventDefault()
        const searchTerm = formData.pilotSearch

        if (searchTerm === '' || searchTerm === undefined || searchTerm === null) {
            return getPilots()
        }

        if (!isNaN(+searchTerm)) {
            const response = await fetch(`http://localhost:4000/api/pilot/${searchTerm}`,
                {
                    method: 'GET'
                }
            )

            if (!response.ok) {
                if (response.status === 404) {
                    await setPilots([{ id: 0, name: `no pilot with id of ${searchTerm}` }])
                    setFormData(
                        {
                            pilotSearch: ""
                        }
                    )
                    return
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            await setPilots([data])
        } else {
            const response = await fetch(`http://localhost:4000/api/pilot/`,
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
                    await setPilots([{ id: 0, name: `no pilot with name of ${searchTerm}` }])
                    setFormData(
                        {
                            pilotSearch: ""
                        }
                    )
                    return
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            await setPilots(data)
        }

        setFormData(
            {
                pilotSearch: ""
            }
        )
    }
    
    async function deletePilot(id){
        const response = await fetch(`http://localhost:4000/api/pilot/${id}`,
                {
                    method: 'DELETE'
                }
            )

            if (!response.ok) {
                if (response.status === 404) {
                    await setPilots([{ id: 0, name: `no pilot with the id of ${id}` }])
                    setFormData({ pilotSearch: "" })
                    return
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if(data){
                await getPilots()
            }else{
                throw new Error(`Error while deleting: ${data}`)
            }
    }

    function toggleUpdate(pilot){
        setUpdate(pilot)
    }

    function changeHandler(event) {
        const { name, value } = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    function renderUpdate(){
        return <UpdatePilot pilot={update} />
    }

    function renderPilots(){
        return (
            <>
                {pilotElements}
                
            </>
        )
    }

    const pilotElements = pilots.map(pilot => <div className="pilotItem">
        <span key={pilot.id}>{pilot.name}{pilot.id === 0 ? "" : `, Team: ${pilot.team?.name || "N/A"}`}</span>
        {pilot.id !== 0 ? 
            <>
                <button onClick={() => toggleUpdate(pilot)}>Update</button>
                <button onClick={() => deletePilot(pilot.id)}>Delete</button>
            </>
        : ""}
    </div>)
    
    return (
        <>
            {update ? "" :
                <div className="search">
                    <form>
                        <input
                            type="text"
                            name="pilotSearch"
                            id="pilotSearch"
                            value={formData.pilotSearch}
                            placeholder="Pilot ID or Name"
                            onChange={changeHandler}
                        />
                        <button onClick={getPilot}>Get pilot</button>
                    </form>
                </div>
            }
            
            <div className="pilot">
                {update ? renderUpdate() : (pilots && renderPilots()) }
            </div>
        </>
    );
}
