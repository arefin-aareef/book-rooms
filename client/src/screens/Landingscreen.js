import React from 'react'
import { Link } from 'react-router-dom'

function Landingscreen() {
  return (
    <div className='row landing justify-content-center mx-0'>
        <div className="col-md-10 my-auto text-center">
            <h2 style={{color: 'white', fontSize:'80px'}}>Book Rooms</h2>
            <h1 style={{color: 'white'}}>Get your desired room. Just a click away.</h1>
            <Link to='/home'>
                <button className='btn landingbtn'>Get Started</button>
            </Link>
        </div>
    </div>
  )
}

export default Landingscreen