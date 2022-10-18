import axios from 'axios'
import { useState } from 'react'
import  Container from 'react-bootstrap/Container'
import  Row  from 'react-bootstrap/Row'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config.js'
import { setId, setToken } from '../helpers/auth'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const Register = () => {

  const navigate = useNavigate()

  const [ formData, setFormData ] = useState('')
  const [ loginData, setLoginData ] = useState('')
  const [ errors, setErrors ] = useState(false)
  
  const handleChange = (event, error) => {
    setFormData({ ...formData, [event.target.name]: event.target.value})
    if (event.target.name === 'userName' || event.target.name === 'password') {
      setLoginData({ ...loginData, [event.target.name]: event.target.value })
    }
    setErrors(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.post(`${API_URL}/register`, formData)
      console.log(data)
      autoLogin()
    } catch (error) {
      setErrors({...errors, [event.target.name]: '', message: '' })
      console.log(error.mesage)
    }
  }

  const autoLogin = async (event) => {
    try {
    const { data } = await axios.post(`${API_URL}/login`, loginData)
    setToken(data.token)
    setId(data.userId)
    navigate(`/edit-profile/${data.userId}`)
    } catch (error) {
      setErrors(error.message)
      console.log(error.message)
    }
  }


  return (
  <main className='form-page'>
    <Container className='register-form' as='main'>
      <Row>
          <h1>Register</h1>    
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" >
            <Form.Label>User Name</Form.Label>
            <Form.Control onChange={handleChange} type="text" name="userName" placeholder="Username" value={formData.userName} /> 
          </Form.Group>

          <Form.Group className="mb-3" >
            <Form.Label>Email address</Form.Label>
            <Form.Control  onChange={handleChange} type="email" name="email" placeholder='Email' value={formData.email}  />
            <Form.Text className="text-muted">
            We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" >
            <Form.Label>Password</Form.Label>
            <Form.Control onChange={handleChange} type="password" name="password" placeholder='Password' value={formData.password}  />
          </Form.Group>

          <Form.Group className="mb-3" >
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control onChange={handleChange} type="password" name="confirmPassword" placeholder='Confirm Password' value={formData.confirmPassword} /> 
          </Form.Group>

          { errors && <p className='text-danger'>{errors}</p>}

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

      </Row>
    </Container>
</main>

  )
}

export default Register 