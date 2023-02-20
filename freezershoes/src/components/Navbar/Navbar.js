import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

export const Navbar = () => {

    const navigate = useNavigate();

    // const [logInfo, setLogInfo] = useState(false)
    // const [userId, setUserId] = useState('')
    // const [userName, setUserName] = useState('')
    
    // useEffect(() => {
    //     const [cookieName, cookieValue] = document.cookie.split('=')
    //     const userDataJSON = localStorage.getItem('userData')
    //     if (cookieValue && userDataJSON) {

    //         const { username, _id } = JSON.parse(userDataJSON)

    //         setUserId(_id)
    //         setUserName(username)
    //         setLogInfo(true)

    //     } else {
    //         document.cookie = "USER_DATA=expired; expires=Thu, 01 Jan 1970 00:00:00 UTC;max-age=0";
    //         fetch('/')
    //         setLogInfo(false)
    //         navigate('/users/login')
    //     }
    // }, [document.cookie])

    // const logout = (e) => {
    //     e.preventDefault();

    //     document.cookie = "USER_DATA=expired; expires=Thu, 01 Jan 1970 00:00:00 UTC;max-age=0";
    //     document.cookie = ''
    //     localStorage.removeItem('userData')
    //     fetch('/')
    //     setLogInfo(false)
    //     navigate('/users/login')
    // }
    return (
        <nav className="nav-component">
            {/* <Link to="/" className="brand"></Link> */}

        </nav>
    )
}
