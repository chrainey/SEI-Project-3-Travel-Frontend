# Travel Library API - GA Project 3

This is my third project for the Software Engineering Immersive course with GA. It’s a complex MERN stack app built with my fellow GA classmates Kate O’Shea and Serhan Miah.

The app is deployed with Heroku and is available [here](https://sei65-destinations.netlify.app/)

Please note that user authentication is required. Anyone is free to use the admin sign-in credentials:

* Email: user
* Password: 1234

## Brief:

* Build a full-stack application by making your own backend and your own front-end.
* Use an Express API to serve your data from a Mongo database.
* Consume your API with a separate front-end built with React.
* Be a complete product which most likely means multiple relationships and CRUD functionality for at least a couple of models.
* Implement thoughtful user stories/wireframes that are significant enough to help you know which features are core MVP and which you can cut.
* Have a visually impressive design.
* Timeframe: 8 days.

## Technologies Used:

* Node.js
* MongoDB
* Express
* Bcrypt
* Mongoose
* Cloudinary
* AWS
* React.js
* Axios
* SCSS
* Git and GitHub

## Code Installation:

My Github LInks

* Clone or download the repo.
* Install dependencies by running “npm i” in your Terminal.
* Start the database by running mongodb “npm run seedDb”.
* Start the back-end server using node-mon “npm start”.
* Change into front-end folder using “cd frontend”.
* Run the front-end using “npm run start”.

![Homepage](../SEI-Project-3-Travel-Library-Frontend/src/img/Project3image.png)

## Planning:

After receiving the brief we set about deciding what kind of app to make. This was really easy to decide between the 3 of us as we all have a passion for travel. Using the skills we have recently learnt we decided to do a travel library containing some of the best destinations in the world for tourists.
Next we needed to get our ideas down on paper so we used Excalidraw to build a wireframe for the look of each page and how users will navigate through our app.

![Excalidraw wireframe](../SEI-Project-3-Travel-Library-Frontend/src/img/excalidraw2.png)

Minimum Viable Product:

* User can register, login and logout.
* Create at least 30 destinations in our seeding data.
* All destinations are displayed and the user can navigate around them.
* User can create a profile.
* User can add a new destination to the database.
* User can leave reviews on any destination.

Stretch Goals:

* Add a map location to the destination.
* Add a weather chart.
* Allow user to upload images to the database

As we were all working remotely we communicated using Slack and Zoom along with a shared Google Drive to keep on top of tasks. We agreed to have a morning standup everyday to go through what each of us would be working on over the course of the day and we also ran a daily Zoom though GA so we could easily help each other get over any hurdles we were facing.
This was our first experience of using GitHub on a group project. At the start we did our pushes and pulls together as a group so that we could avoid and fix any merge conflicts that we may be having. 

## Build Process:

We spent the first couple of days of the project building the back end and gathering all of our seeding data. The remainder of the week was spent building the front-end, styling the look and making changes to the database models, end points when needed.

Back-End:

Myself and Serhan started gathering all of our seeding data. As we were doing travel destinations we wanted lots of really good images to show off these destinations. We also needed the right size of images so they would all look good in a grid against each other.
Kate spent the first build day building the routes, controllers and schemas. We built these using Node.js, Express and MongoDB. She built the following components: express routes, models for users, destinations and reviews. As well as controllers for: authorization, users, destinations, reviews and error handlers. She tested all of the endpoints in Insomnia to make sure that CRUD functionality was working as intended. Kate then took the images we had gathered and used Amazon Web Services (AWS) S3 to host them and add to the seeding data.

Upload Image Preview:

```
<Form.Group className="mb-3" >
        { newProfileImg ? 
              <img className='w-100' src={newProfileImg} alt={'User Uploaded Profile'} />
              :
              <></>
              }
          <Form.Label><h2>Upload Image</h2></Form.Label>
          
          <Form.Control type="file" id="image" className="input" onChange={(event) => {
                setImageSelected(event.target.files[0])
              }} />
        <Button onClick={uploadImage}>Upload image</Button>
        </Form.Group>
```
Above shows the upload image form that allows the user to upload their own user image.

We then decided to deploy on Heroku at this point and add files as the project went on to avoid more deployment issues later on.

As a team we then spent time ensuring all of the endpoints were working properly by testing them with Insomnia. This was also to make sure the backend was receiving the correct authorisations and sending back the correct responses with the various HTTP methods. 

Back-end express routes linking paths to corresponding HTTP requests:
```
import express from 'express'
import destinationController from './controllers/destinationController.js'
import userController from './controllers/userController.js'
import reviewController from './controllers/reviewController.js'
import auth from './middleware/auth.js'

const router = express.Router()

router.route('/').get((request, response) => response.status(200).send('API is running'))

router
  .route('/travel')
  .get(destinationController.getAllDestination)
  .post(auth, destinationController.addDestination)

router
  .route('/travel/reviews')
  .get(reviewController.getAllReviews)

router
  .route('/travel/:destinationId')
  .get(destinationController.individualDestination)
  .delete(auth, destinationController.remove)
  .put(auth, destinationController.update)
  .post(auth, reviewController.create)

router
  .route('/travel/:destinationId/:reviewId')
  .get(reviewController.individualReview)
  .delete(auth, reviewController.remove)
  .put(auth, reviewController.update)

router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
router.route('/users').get(auth, userController.getAll)

router
  .route('/users/:userId')
  .get(auth, userController.individualUser)
  .put(auth, userController.update)


export default router
```
Displayed below are the mongoose schemas for the user and destination. There are relationships between users, reviews and destinations. As you can see in the code the reviews are in both schemas so that only one request is needed to get all of the necessary information to display info on both the user profile page and the individual destination page.

User:
```
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  displayName: String,
  profileImg: String,
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  aboutMeText: String,
  reviews: [ {
    reviewText: { type: String, required: true },
    rating: { type: Number },
    activities: [{ type: String, required: true }],
    destinationId: { type: mongoose.Schema.ObjectId, ref: 'destination', required: true },
    destinationName: String,
    reviewImgUrl: [{ type: String }],
    reviewId: {  type: mongoose.Schema.ObjectId, ref: 'review', required: true },
  } ],
})

export default mongoose.model('user', userSchema)
```

Destination:
```
import mongoose from 'mongoose'
// import reviewSchema from './review.js'

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  // continent: { type: String. required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: [ {
    destinationId: {  type: mongoose.Schema.ObjectId, ref: 'destination', required: true },
    reviewText: { type: String, required: true },
    rating: { type: Number },
    activities: [{ type: String, required: true }],
    reviewImgUrl: [{ type: String }],
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'user', required: true },
    displayName: String,
    reviewId: {  type: mongoose.Schema.ObjectId, ref: 'review', required: true },
  } ],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'user', required: true },
  imgUrl: [{ type: String }],
})

const destinationModel = mongoose.model('destination', destinationSchema)

export default destinationModel
```

Front-End:

Myself and Serhan made the framework of the app, creating our components based on the wireframe. Serhan set up a Cloudinary account and created an imageUpload function to allow users to upload images. This account enabled users to upload their image to a group Cloudinary account, allowing public access and having the new profile image set as a Hook to target the URL file. He also set the updated user profile to be equal to the data.URL inside the updated user profile.

The code below shows the process of a user updating their user profile image using hooks:
```
const uploadImage = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('file', imageSelect)
    formData.append('upload_preset', 'djssiss0') //? djssiss0 is the key + danedskby is the name 
    const { data } = await axios.post('https://api.cloudinary.com/v1_1/danedskby/image/upload', formData)
    // ! this is my (serhan miah) login for the cloudinary - for destination images
    setNewProfileImg(data.url)
    setUpdatedUserProfile({ ...updatedUserProfile, profileImg: data.url })
  }
```
I built the homepage, including a hero image carousel for each destination page so users could scroll through numerous images for each destination.

Carousel function displaying 3 images for each destination:
```
const CarouselImages = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={destination.imgUrl[0]}
          alt={destination.name}
        />        
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={destination.imgUrl[1]}
          alt={destination.name}
        />        
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={destination.imgUrl[2]}
          alt={destination.name}
        />        
      </Carousel.Item>
    </Carousel>
  );
}
```
Once we had compiled and seeded all of our data we could create all of our paths and Axios requests using React. Kate had created all of the routes on the backend so she knew which paths corresponded to which HTTP requests.

Frontend routes will all possible client side paths with the React components they are linked to:
```
function App() {


  return (
    <div className="App">
      <BrowserRouter>
      <NavBar /> 
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/edit-profile/:userId' element={<EditProfile />} />
          <Route path='/users/:userId' element={<UserProfile />} />
          <Route path='/landing' element={<Landing />}  />
          <Route path='/travel/:destinationId' element={<Destination />}  />
          <Route path='/travel/:destinationId/:reviewId' element={<Destination />}  /> 
          <Route path='/travel' element={<AllDestination />}  />
          <Route path="/travel/new" element={<NewDestination />} />
          <Route path='/review/:destinationId' element={<NewReview /> } />
          <Route path='/edit-review/:destinationId/:reviewId' element={<EditReview /> } />

        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App;
```
All of the components then have an Axios request on page load much like the below GET request:
```
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
```
Now that we could retrieve all of the info successfully onto the front end we worked on the user interface. We needed the user to be able to register, login and logout which was one of our core project requirements.
By using Insomnia I was able to see if the registration endpoints were working. I could also test the login endpoints to make sure the user was receiving a JSON Web Token (JWT). This authorises the user when they log in. I needed to make sure the login was secure so I created an environment variable to hold the SECRET-WORD for decrypting the login. I then created a new file in the frontend to hold the JWT, set the token and decrypt the token for that particular user.

Once all of the registration, login and authorization was completed we next needed to add a review feature. This would allow a registered user to write a review of a particular travel destination.

Serhan created a review component. He created an Axios request which links to the database. He used Hooks to hold the review and setReview as an empty string. He then created a function event which holds Axios post requests. Inside the function, it will hold the headers with the bearer token. 

He then matched the API request with the destination ID. Using useParams which returns an object of key/value pairs of the dynamic params from the current URL that was matched by the route path. This was done by routing it through the App.js file.
```
const handleSubmit = async (event) => {
  event.preventDefault()
  try {
    const { data } = await axios.post(`${API_URL}/travel/${destinationId}`, review, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
    })
    console.log(data)
    navigate(`/travel/${destinationId}`)
  } catch (error) {
    console.log(error)
    setErrors(error)
  }
}
```
At this point Kate then made the forms to edit the user profile and reviews. On submit, the forms triggered a handleSubmit function that used an Axios put request like below:
```
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
```

## Challenges:
Using GitHub as a team.
We had a few cases of team members accidentally working on the main branch rather than on a feature branch. Also, styling using React Bootstrap was added to pages after the functionality had been set up and working. Because functionality wasn't tested again before the styling branches were merged into the main so we had to go back and figure out what had broken the code. 
After a few cases of the above we decided to push code together in our morning stand-up and then pulling down all of the updated code to avoid any further mistakes.

As mentioned above we embedded the review inside of the user and destination schemas. We believed this would be faster overall because, when loading the user profile or destination pages, there would only be one axios request to get all of the data. However, it made creating, removing and updating more difficult because the models for the user, destination and review all needed to be changed.

## Wins:
For me personally, I was very happy with the look of the website and the styling. Using React Bootstrap allows for really responsive design that looks great on large monitors all the way down to small smartphones.

## Key Learnings:
When working with a team in the future I am very confident that I would be able to plan the project and task delegation more efficiently. At times we weren’t sure what eachother was doing and one of our team members was in Sri Lanka so had different working hours to the rest of the team. We also lost some time looking at implementing stretch goals before we had an MVP working.

I am also a lot more confident in using GitHub. For the first couple of days we had to spend a lot of time fixing merge conflicts and unravelling errors that had been made by working on the main branch instead of creating a feature one. I found the help given from our tutor fixing everything in the Terminal invaluable and I am sure this will be a useful experience moving into my first job in the industry.

## Bugs:
If a user adds a new destination there is only 1 image but the carousel is still there with two empty slots for further images.

When a user updates their displayed name on screen their reviews are not given the new username.

## Future Improvements:
A search bar for the destinations on the landing page.
Create drop down menus the filter destinations by continent, country, population etc
Calculate the average rating of the reviews for each destination.
Allow the ability for the user to add all 3 images together rather than one at a time.
Make the carousel inactive if there is only one image.
Use mapbox to display map location of each destination or maybe add a large world map with pins for each destination.
