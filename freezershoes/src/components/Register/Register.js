import "../Login/Login.css"
import { useState } from 'react'
import axios from "axios"
import { FormInput } from "../FormInput/FormInput"
import { Link, useNavigate } from "react-router-dom"

export const Register = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState('')

    const [values, setValues] = useState({
        username: '',
        email: '',
        birthday: '',
        password: '',
        confirmPassword: '',
    })
    const inputs = [
        {
            id: 1,
            name: "username",
            type: 'text',
            placeholder: 'johnny1990',
            label: 'Username:',
            errorMessage: "Username should be 3-16 characters and shoudn't include any special characters!",
            pattern: "^[A-Za-z0-9]{3,16}$",
            required: true,
        },
        {
            id: 2,
            name: "email",
            type: 'email',
            placeholder: 'johnny90@example.com',
            label: 'Email:',
            errorMessage: "It should be a valid e-mail address!",
            required: true,
        },
        {
            id: 4,
            name: "password",
            type: 'password',
            placeholder: '********',
            label: 'Password:',
            errorMessage: "Password should be 6-25 characters!",
            pattern: "^[A-Za-z0-9]{3,25}$",
            required: true,
        },
    ]
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const data = new FormData(e.target)
    //     const { username, email, birthday, password } = Object.fromEntries(data.entries());

    //     try {
    //         const config = {
    //             headers: {
    //                 "Content-type": "application/json"
    //             }
    //         }
    //         const data = await axios.post('http://localhost:3031/users/register',
    //             {
    //                 username,
    //                 email,
    //                 birthday,
    //                 password
    //             },
    //             config
    //         )
    //         if (data.status === 203) {
    //             setErrors('Register error')

    //         } else {
    //             localStorage.setItem('userData', JSON.stringify(data.data))
    //             document.cookie = `USER_DATA=${data.data.token}`
    //             navigate('/')
    //         }
    //     } catch (error) {
    //         setErrors('Register error')
    //     }
    // }
    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }
    return (
        <div className="main">
        <div>
            <div className='login-decoration'>
                
                <h1 className='auth-h1'><i class="fa-solid fa-user-lock"></i> Register</h1>

            </div>
            <form 
            // onSubmit={handleSubmit} 
            className="form-container">

                <h2 className='try-again-message'>{errors}</h2>
                {inputs.map((input) => (
                    <FormInput
                        key={input.id}
                        {...input}
                        value={values[input.name]}
                        onChange={onChange} />
                ))}
                
                <button className="submit-button">Register</button>
                <Link to="/users/login" className='auth-redirect'>
                    Redirect to login</Link>
            </form>
            
<div className='login-decoration-bottom'>
            </div>
        </div>
        </div>

    )
}