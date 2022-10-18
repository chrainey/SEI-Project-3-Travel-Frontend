import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config.js'
import { setId, setToken } from '../helpers/auth'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const Login = () => {
  const navigate = useNavigate() 
  const [ errors, setErrors ] = useState(false)
  const [ loginData, setLoginData ] = useState({
    userName: '',
    password: '',
  })

  const handleChange = (event) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value  })
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
    const { data } = await axios.post(`${API_URL}/login`, loginData)
    setToken(data.token)
    setId(data.userId)
    navigate(`/users/${data.userId}`)
    } catch (error) {
      setErrors(error.message)
      console.log(error.message)
    }
  }
  

  return  (     
      <main className='form-login justify-content-center'>
        <Form onSubmit={onSubmit} className='login-form'>
          <h1>Login</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>User Name</Form.Label>
            <Form.Control type='text' name='userName' placeholder='Username' onChange={handleChange} value={loginData.userName} />   
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' name='password' placeholder='Password' onChange={handleChange} value={loginData.password} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
          {errors && <div className='error'>{errors}</div>}
        </Form>
      </main>    
  )
}

export default Login

