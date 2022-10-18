import axios from 'axios'
import { useEffect, useState } from 'react'
import API_URL from '../config.js'
import { useParams, Link } from 'react-router-dom'
import { getToken } from '../helpers/auth.js'
import Container from 'react-bootstrap/Container'
import  Card  from "react-bootstrap/Card"
import Row  from 'react-bootstrap/Row'
import  Col from 'react-bootstrap/Col'
import Spinner from './Spinner.js'
import Button from 'react-bootstrap/Button'
import  ListGroup from 'react-bootstrap/ListGroup'

const UserProfile = () => {
  const { userId } = useParams()
  const [ errors, setErrors ] = useState(false)
  const [ reviewsRemoved, setReviewsRemoved ] = useState(0)
  const [ userProfile, setUserProfile ] = useState({
    _id: '',
    email: '',
    userName: '',
    reviews: [],
  })

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setUserProfile(data)
      } catch (error) {
        setErrors(error.message)
        console.log(error.message)
      }
    }
    getUser()
  }, [userId, reviewsRemoved])

  const deleteReview = async (event, destinationId, reviewId) => {
    event.preventDefault()
    try {
      const { data } = await axios.delete(`${API_URL}/travel/${destinationId}/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log(data)
      setReviewsRemoved(reviewsRemoved + 1)
    } catch (error) {
      setErrors(error.message)
      console.log(error.message)
    }
  }

  return (
    <>
    { userProfile.email ?
    <div className="profile-page-wrapper">
      <Container className='user-profilePage'>
        <h1>{ userProfile.displayName? userProfile.displayName : userProfile.userName}</h1>
        <Card border="dark" className="user-card bg-transparent ">
            <Card.Img className='userProfileCard' variant="top" src={userProfile.profileImg} alt={userProfile.userName} />
            <Card.Body className="bg-transparent">
              <Card.Title>{userProfile.name}</Card.Title>
              <Card.Text>
                {userProfile.description}
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush ">
              <ListGroup.Item><span>👤</span> {userProfile.userName}</ListGroup.Item>
              <ListGroup.Item><span>📧</span> {userProfile.email}</ListGroup.Item>
              <ListGroup.Item><span>📧</span> {userProfile.aboutMeText}</ListGroup.Item>
            </ListGroup>
            <Card.Body>
              <Link to={`/edit-profile/${userId}`} className='btn btn-primary'>Edit Profile</Link>
            </Card.Body>
          </Card>
        <Col md="6">
        <hr />
        <h3>User Reviews</h3>
          <Container as='section' className='user-reviewCard'>
            <Row>
              { userProfile.reviews.length > 0
                ?
                userProfile.reviews.map(review => {
                  const { reviewId, reviewText, destinationId, destinationName, rating, reviewImgUrl, activities } = review
                  return (
                    <Col key={reviewId} md="6" lg="4" className='mb-4'>
                      {/* review card section */}
                      <Card >
                        <Card.Img  variant='top' src={reviewImgUrl[0] ? reviewImgUrl[0] : 'https://sei65-destinations.s3.eu-west-1.amazonaws.com/users/default-image.jpg' }></Card.Img>
                        <Card.Body>
                          <Link to={`/travel/${destinationId}`}>
                            <Card.Title className='text-center mb-0'>{destinationName}</Card.Title>
                          </Link>
                          <p>Rating: {rating}</p>
                          <p>Activities: {activities.join(', ')}</p>
                          <p>{reviewText}</p>
                          <div className="buttons mb-4">
                            <Button variant="danger" onClick={event => deleteReview(event, destinationId, reviewId)}>Delete</Button>
                            <Link to={`/edit-review/${destinationId}/${reviewId}`} className='btn btn-primary'>Edit Review</Link>
                          </div>   
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                })
                :
                <>
                  { errors ? <h2>Something went wrong. Please try again later</h2> : <p>No reviews yet</p>}
                </>
              }
            </Row>
          </Container>
        </Col>
        <hr />
        <Link to="/travel" className='back-button btn btn-primary'>Back to all destinations</Link>
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

export default UserProfile