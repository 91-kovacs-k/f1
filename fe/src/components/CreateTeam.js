import React from 'react'

export default function CreateTeam(){
    const [formData, setFormData] = React.useState({
        teamName: ""
    })
    const [res, setRes] = React.useState('')

    function handleChange(event){
        const {name, value} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    async function submit(event){
        event.preventDefault()
        const response = await fetch("http://localhost:4000/api/team", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: formData.teamName})
        });

        const data = await response.json();

        if (!response.ok) {
            setRes(`Error while creating team: ${data.error}`)
            throw new Error(`Error while deleting: ${data}`)
        }

        if(data){
            setRes(`${formData.teamName} successfully created.`)
        }
        setFormData({
            teamName: ""
        })
    }

    return(
        <div className='createTeam'>
            { res ? 
                <p>{res}</p>
                :
                <form>
                    <input
                        type="text"
                        id="teamName"
                        name="teamName"
                        placeholder="Team Name"
                        value={formData.teamName}
                        onChange={handleChange}
                    />
                    <button onClick={submit}>Create team</button>
                </form>
            }
        </div>
    )
}