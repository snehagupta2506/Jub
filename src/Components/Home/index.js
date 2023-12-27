import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import Header from '../Header'

const Home = ()=>
 (
  <>
    <Header />
    <div className="home-container">
      <h1 className="home-heading">Find The Job That Fits Your Life</h1>
      <p className="home-description">
        Millions of people are searching for jobs
      </p>
      <Link to="/jobs">
        <button type="button" className="shop-now-button">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)

export default Home
