import { useState } from 'react'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

import "./Catalog.css"

export const Catalog = () => {
    const navigate = useNavigate()

    
    return (
        <>
            <div className="catalog-welcome-container">
                <img src={require("./page-top.gif")} alt='catalog-welcome-img' className="catalog-welcome-img"/>
            </div>
            <div>

            </div>
            <div className='catalog-container'>

            </div>
        </>
    )
}