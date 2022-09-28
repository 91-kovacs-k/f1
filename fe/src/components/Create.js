import React from 'react'

export default function Create(){
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
        if (!response.ok) {
            console.log(response)
            throw new Error(`HTTP error! status: ${response.error}`);
        }

        const data = await response.json();
        if(data.acknowledged){
            setRes(`${formData.teamName} successfully created.`)
        }else{
            setRes(`Error while creating team: ${response.status}`)
        }
        setFormData({
            teamName: ""
        })
    }

    return(
        <div className='create'>
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