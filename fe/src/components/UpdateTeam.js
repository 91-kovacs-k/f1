import React from 'react'

export default function UpdateTeam(params) {
    const [formData, setFormData] = React.useState({
        teamName: params.team.name
    })
    const [res, setRes] = React.useState('')

    async function submit(event) {
        event.preventDefault()
        const response = await fetch(`http://localhost:4000/api/team/${params.team.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: params.team.id, name: formData.teamName.trimStart().trimEnd() })
            }
        )
        const data = await response.json();

        if (!response.ok) {
            setRes(`Could not rename to ${formData.teamName}, because a team with 
            that name already exists in the database!`)
            //throw new Error(`HTTP error! status: ${response.error}`);
        } else if (data) {

            setRes(`${formData.teamName} successfully updated.`)
            setFormData({
                teamName: ""
            })
        } else {
            throw new Error(`HTTP error! status: ${response.error}`);
        }
    }

    function changeHandler(event) {
        const { name, value } = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    return (
        <div className='updateTeam'>
            {res ?
                <p class="response dark">{res}</p>
                :
                <form>
                    <input
                        type="text"
                        name="teamName"
                        id="teamName"
                        onChange={changeHandler}
                        placeholder={params.team.name}
                        value={formData.teamName}
                    />
                    <button onClick={submit}>Submit update</button>
                </form>
            }
        </div>
    )
}