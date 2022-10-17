import React from 'react'

export default function Header({ toggleSite }) {


    return (
        <div className='header'>
            <button className='logo' onClick={() => toggleSite(0)}><h2>F1</h2></button>
            <div className='menu'>
                <ul>
                    <li><button onClick={() => toggleSite(1)}>Get Teams</button></li>
                    <li><button onClick={() => toggleSite(2)}>Add Team</button></li>
                    <li><button onClick={() => toggleSite(3)}>Get Pilots</button></li>
                    <li><button onClick={() => toggleSite(4)}>Add Pilot</button></li>
                </ul>
            </div>
        </div>
    )
}