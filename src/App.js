
import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import NavBar from './components/NavBar'
import Login from './components/Login'
import Register from './components/Register'
import UserProfile from './components/UserProfile'
import Footer from './components/Footer'
import Landing from './components/Landing'
import Destination from './components/Destination'
import AllDestination from './components/AllDestination'
import NewDestination from './components/NewDestination'
import EditProfile from './helpers/EditProfile'
import NewReview from './helpers/NewReview'
import EditReview from './helpers/EditReview'


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
