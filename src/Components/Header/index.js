import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {FiLogOut} from 'react-icons/fi'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <ul className="nav-content">
        <li className="nav-bar-large-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
              alt="website logo"
            />
          </Link>
        </li>
        <li>
          <Link to="/">
            <h1>Home</h1>
            <AiFillHome />
          </Link>
          <Link to="/jobs">
            <h1>Jobs</h1>
            <BsFillBriefcaseFill />
          </Link>
        </li>
        <li>
          <FiLogOut />
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
