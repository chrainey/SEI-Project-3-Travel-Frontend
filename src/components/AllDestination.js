import axios from 'axios'
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'
import API_URL from '../config.js'
import Spinner from './Spinner.js'


const AllDestination = () => {

const [ destinationData, setDestinationData ] = useState([])
const [ errors, setErrors ] = useState(false)
useEffect(() => {
  const getData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/travel`)
      setDestinationData(data)
    } catch (error) {
      setErrors(error.message)
      console.log(error.message)
    }
  } 
  getData()
}, [])


  return (
    <>
    { destinationData[0] ?
    <div className='all-destination-page'>
      <Container as="main" className='destination-index'>
      <h1 className='text-center mb-4'>All Destinations</h1>
      <Row className='destination-row'>
        { destinationData.map(item => {
            const { _id } = item
            return (
              <Col key={_id} md="5" lg="4" className='mb-4'>
                <Link style={{ textDecoration: 'none', color: 'black' }} to={`/travel/${_id}`}>
                  <Card >
                    <Card.Img className='card-images' variant='top' src={item.imgUrl[0]}></Card.Img>
                    <Card.Body className='bg-light'>
                      <Card.Title className='multi-card text-center mb-0 text-decoration-none'>{item.name} - {item.country}</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            )
          })
        }
      </Row>
    </Container>
    </div>
    :
    <h2 className="text-center">
      { errors ? 'Something went wrong. Please try again later' : <Spinner />}
    </h2>
      }
  </>
  )
}


export default AllDestination