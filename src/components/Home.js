
import { Link } from "react-router-dom"

const Home = () => {

  const buttons = [
    {
      label: "Register",
      path: "/register",
    },
    {
      label: "Login",
      path: "/login",
    },
  ];

  return (
    <>
      <main className="hero text-center">
      <div className="hero-container">
          <h1 className='display-3'>Welcome to the Travel Library</h1>
          <Link to='/travel'>
              <button>Explore the World's Best Destinations</button>
            </Link>
          <p className='lead'>To add destinations and reviews, please register below or login</p>
          {buttons.map((button, index) => (
            <Link key={index} to={button.path}>
              <button>{button.label}</button>
            </Link>
          ))}
          
        </div>
      </main>
    </>
  )}

export default Home