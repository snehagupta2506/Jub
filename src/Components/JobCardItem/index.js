import {Link} from 'react-router-dom'
import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

const JobCardItem = props => {
  const {item} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = item

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="product-item">
        <img src={companyLogoUrl} alt="company logo" className="thumbnail" />
        <h1 className="title">{title}</h1>
        <BsStarFill />
        <p className="brand">{rating}</p>
        <div className="product-details">
          <MdLocationOn />
          <p className="price">{location}</p>
          <div className="rating-container">
            <BsFillBriefcaseFill />
            <p className="rating">{employmentType}</p>
            <p>{packagePerAnnum}</p>
            <hr />
            <h1>Description</h1>
            <p>{jobDescription}</p>
          </div>
        </div>
      </li>
    </Link>
  )
}
export default JobCardItem
