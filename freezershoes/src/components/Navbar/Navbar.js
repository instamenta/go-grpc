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
            <ul className="nav-list">
                <li className="nav-item" id="nav-logo">
                    <Link to="/" className="nav-link">

                        <i className="fa-brands fa-react"></i>
                        <span className="nav-text">
                            TestTest
                        </span>

                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/" className="nav-link">

                        <i className="fa-solid fa-gamepad"></i>
                        <span className="nav-text">
                        TestTest
                        </span>

                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/" className="nav-link">

                        <i className="fa-solid fa-right-to-bracket"></i>
                        <span className="nav-text">
                        TestTest
                        </span>

                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/" className="nav-link">

                        <i className="fa-solid fa-user-plus"></i>
                        <span className="nav-text">
                        TestTest
                        </span>

                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/" className="nav-link">

                        <i className="fa-solid fa-user-large"></i>
                        <span className="nav-text">
                        TestTest
                        </span>

                    </Link>
                </li>
                {/* contacts and useful links */}


            </ul>
            <ul className="contacts-list">
                <li className="contacts">
                    <Link to="/" className="contacts-link">

                        <i className="fa-solid fa-file-pdf"></i>
                        <span className="contacts-text">
                        TestTest
                        </span>

                    </Link>
                </li>
                <li className="contacts">
                    <Link to="/" className="contacts-link">

                        <i className="fa-solid fa-square-envelope"></i>
                        <span className="contacts-text">
                        TestTest
                        </span>

                    </Link>
                </li>

                <li className="contacts">
                    <Link to="/" className="contactsnav-link">

                        <i className="fa-solid fa-map-location-dot"></i>
                        <span className="contacts-text">
                        TestTest
                        </span>

                    </Link>
                </li>

                <li className="contacts">
                    <Link to="/" className="contacts-link">

                        <i className="fa-brands fa-square-github"></i>
                        <span className="contacts-text">
                        TestTest
                        </span>

                    </Link>
                </li>
                <li className="contacts">
                    <Link to="/" className="contacts-link">

                        <i className="fa-brands fa-linkedin"></i>
                        <span className="contacts-text">
                        TestTest
                        </span>

                    </Link>
                </li>
                <li className="contacts">
                    <Link to="/" className="contacts-link">
                        
                        <i className="fa-solid fa-mobile-button"></i>
                        <span className="contacts-text">
                        TestTest
                        </span>

                    </Link>
                </li>
            </ul>
        </nav>
    )
}
