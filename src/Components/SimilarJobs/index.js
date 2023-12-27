import {BsFillBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

const SimilarJobs = props => {
  const {similarJobsData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobsData

  return (
    <li className="similar-product-item">
      <img
        src={companyLogoUrl}
        alt="similar job company logo"
        className="thumbnail"
      />
      <h1 className="title">{title}</h1>
      <AiFillStar />
      <p className="brand">{rating}</p>
      <div className="product-details">
        <MdLocationOn />
        <p className="price">{location}</p>
        <div className="rating-container">
          <BsFillBriefcaseFill />
          <p className="rating">{employmentType}</p>
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
