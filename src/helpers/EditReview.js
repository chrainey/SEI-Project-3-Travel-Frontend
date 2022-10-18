import axios from 'axios'
import { useEffect, useState } from 'react'
import API_URL from '../config.js'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getToken } from './auth.js'
import Card  from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import Spinner from '../components/Spinner.js'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Form'

const EditReview = () => {

  const { destinationId, reviewId } = useParams()
  const navigate = useNavigate()
  const [ imageSelect, setImageSelected ] = useState('')
  const [ errors, setErrors ] = useState(false)
  const [ review, setReview ] = useState('')
  const [ updatedReview, setUpdatedReview ] = useState('')
  const [ newReviewImg, setNewReviewImg ] = useState('')

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/travel/${destinationId}/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setReview(data)
        setUpdatedReview(data)
      } catch (error) {
        setErrors(error.message)
        console.log(error.message)
      }
    }
    getUser()
  }, [reviewId])

  useEffect(() => {
  }, [newReviewImg])

  const handleChange = (event) => {
    setUpdatedReview({ ...updatedReview, [event.target.name]: event.target.value })
    setErrors({ ...errors, [event.target.name]: '', message: '' })
    
  }

  const uploadImage = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('file', imageSelect)
    formData.append('upload_preset', 'djssiss0') //? djssiss0 is the key + danedskby is the name 
    const { data } = await axios.post('https://api.cloudinary.com/v1_1/danedskby/image/upload', formData)
    setNewReviewImg(data.url)
    setUpdatedReview({ ...updatedReview, reviewImgUrl: [data.url] })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.put(`${API_URL}/travel/${destinationId}/${reviewId}`, updatedReview, {
        headers: {
          Authorization: `Bearer ${getToken()}`,  
        },
      })
      console.log(data)
      navigate(`/travel/${destinationId}`)
    } catch (error) {
      setErrors(error.message)
      console.log(error.message)
    }
  } 

  return (
    <main className='edit-review-container' >

      { review.reviewText ? 
      <>
        <Form className="edit-review-form" onSubmit={handleSubmit}>
          <h1>Edit Review</h1>
          <Card key={reviewId} className="edit-review-card">
            <Card.Img variant='top' src={review.reviewImgUrl[0] ? review.reviewImgUrl[0] : 'https://sei65-destinations.s3.eu-west-1.amazonaws.com/users/default-image.jpg' }></Card.Img>
            <Card.Body>
              <Card.Title className='text-center mb-0'>{/*{reviewText}*/}</Card.Title>
              <Card.Text>
                {review.reviewText}
                <Form.Label htmlFor="reviewText">Review Text</Form.Label>
                <Form.Control as="textarea" rows={4} name="reviewText" placeholder="Edit review text" value={updatedReview.reviewText} onChange={handleChange} />
              </Card.Text>  
              <ListGroup className="list-group-flush">
                <ListGroup.Item><span>👤</span> {review.displayName}</ListGroup.Item>
                <ListGroup.Item>Rating: {review.rating}</ListGroup.Item>
                <Form.Control type="number" name="rating" placeholder="Edit rating" value={updatedReview.rating} onChange={handleChange} />
                <ListGroup.Item>Activites: {review.activities.join(', ')}</ListGroup.Item>
                <textarea name="activities" placeholder="Edit activities" value={updatedReview.activities} onChange={handleChange} ></textarea>
              </ListGroup>
              { newReviewImg ? 
              <img className='w-100' src={newReviewImg} alt={'User Uploaded Review'} />
              :
              <></>
              }
              <Form.Control type="file" id="image" className="input" onChange={(event) => {
                setImageSelected(event.target.files[0])
              }} />
              <Button className='btn btn-primary' onClick={uploadImage}>Upload image</Button>
              <hr />
              <input className ="bnt btn-primary" type="submit"/> 
              {/* <Button  className='btn btn-primary' variant="primary" type="submit">Submit</Button> */}
              <hr />
              <div className="buttons mb-4">
                <Link to={`/travel/${destinationId}`} className='btn btn-primary'>Cancel</Link>
              </div>                          
            </Card.Body>
          </Card> 
        </Form>
      </>
      :
      <h2 className="text-center">
        { errors ? 'Something went wrong. Please try again later' : <Spinner />}
      </h2>
      }
    </main>
  )
}

export default EditReview


