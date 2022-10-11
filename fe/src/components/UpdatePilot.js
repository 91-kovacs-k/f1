import React from 'react'

export default function UpdatePilot(params) {
    const [formData, setFormData] = React.useState({
        pilotName: params.pilot.name,
        pilotTeam: params.pilot.team?.name || "N/A"
    })
    const [res, setRes] = React.useState('')

    async function submit(event){
        event.preventDefault()
        const body = formData.pilotTeam === "N/A" || "" ? 
            JSON.stringify({id: params.pilot.id, name: formData.pilotName}) :
            JSON.stringify({id: params.pilot.id, name: formData.pilotName, team: { name: formData.pilotTeam}})

        const response = await fetch(`http://localhost:4000/api/pilot/${params.pilot.id}`,
            {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: body
            }
        )
        const data = await response.json();

        if (!response.ok) {
            setRes(`Could not rename to ${formData.pilotName}, because a pilot with 
            that name already exists in the database!`)
            //throw new Error(`HTTP error! status: ${response.error}`);
        }else if(data){

            setRes(`${formData.pilotName} successfully updated.`)
            setFormData({
                pilotName: "",
                pilotTeam: ""
            })
        }else{
            throw new Error(`HTTP error! status: ${response.error}`);
        }
    }

    function changeHandler(event){
        const { name, value } = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    return (
        <div className='updatePilot'>
            { res ? 
                <p>{res}</p>
            :
                <form>
                    <input
                        type="text"
                        name="pilotName"
                        id="pilotName"
                        onChange={changeHandler}
                        placeholder={params.pilot.name}
                        value={formData.pilotName}
                    />
                    <input
                        type="text"
                        name="pilotTeam"
                        id="pilotTeam"
                        onChange={changeHandler}
                        placeholder={params.pilot.team?.name || "Team Name"}
                        value={formData.pilotTeam}
                    />
                    <button onClick={submit}>Submit update</button>
                </form>
            }
        </div>
    )
}