import React from 'react'

export default function CreatePilot() {
    const [formData, setFormData] = React.useState({
        pilotName: "",
        pilotTeam: ""
    })
    const [res, setRes] = React.useState('')

    function handleChange(event) {
        const { name, value } = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    async function submit(event) {
        event.preventDefault()
        const team = formData.pilotTeam.trimStart().trimEnd().toLowerCase()
        const body = team === "n/a" || team === "na" || team === "" ?
            JSON.stringify({ name: formData.pilotName }) :
            JSON.stringify({ name: formData.pilotName, team: { name: formData.pilotTeam } })
        const response = await fetch("http://localhost:4000/api/pilot", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        const data = await response.json();
        if (!response.ok) {
            setRes(`Error while creating pilot: ${data.reason}`)
            throw new Error(`Error while creating pilot: ${data}`)
        }

        if (data) {
            setRes(`${formData.pilotName} successfully created.`)
        }
        setFormData({
            pilotName: "",
            pilotTeam: ""
        })
    }

    return (
        <div className='createPilot'>
            {res ?
                <p class="response">{res}</p>
                :
                <form>
                    <div className="inputs">
                        <input
                            type="text"
                            id="pilotName"
                            name="pilotName"
                            placeholder="Pilot Name"
                            value={formData.pilotName}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            id="pilotTeam"
                            name="pilotTeam"
                            placeholder="Pilot's Team"
                            value={formData.pilotTeam}
                            onChange={handleChange}
                        />
                    </div>
                    <button onClick={submit}>Create pilot</button>
                </form>
            }
        </div>
    )
}