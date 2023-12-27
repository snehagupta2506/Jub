import {Component} from 'react'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJob extends Component {
  state = {
    jobDataDetails: [],
    similarJobsdata: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobData = await fetch(apiUrl, options)
    if (responseJobData.ok === true) {
      const fetchedData = await responseJobData.json()
      const updatedJobDetailsData = [fetchedData.job_details].map(eachItem => ({
        companyLogoUrl: eachItem.companyLogoUrl,
        companyWebsiteUrl: eachItem.companyWebsiteUrl,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        skills: eachItem.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: eachItem.title,
      }))
      const updatedSimilarJobDetails = fetchedData.similar_jobs.map(data => ({
        companyLogoUrl: data.company_logo_url,
        employmentType: data.employment_type,
        location: data.location,
        id: data.id,
        rating: data.rating,
        title: data.title,
        jobDescription: data.job_description,
      }))
      this.setState({
        jobDataDetails: updatedJobDetailsData,
        similarJobsdata: updatedSimilarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRetryJobDetailsAgain = () => {
    this.getJobData()
  }

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="button"
        onClick={this.onRetryJobDetailsAgain}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsSuccessView = () => {
    const {jobDataDetails, similarJobsdata} = this.state
    if (jobDataDetails.length > 0) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDescription,
        id,
        location,
        packagePerAnnum,
        rating,
        lifeAtCompany,
        skills,
        title,
      } = jobDataDetails[0]

      return (
        <>
          <img src={companyLogoUrl} alt="job details company logo" />
          <h1>{title}</h1>
          <div>
            <AiFillStar />
          </div>
          <p>{rating}</p>
          <MdLocationOn />
          <p>{location}</p>
          <h1>{employmentType}</h1>
          <p>{packagePerAnnum}</p>
          <hr />
          <h1>Description</h1>
          <a href={companyWebsiteUrl}>
            Visit
            <BiLinkExternal />
          </a>
          <p>{jobDescription}</p>
          <h1>Skills</h1>
          <ul>
            {skills.map(eachItem => (
              <li key={eachItem.name}>
                <img src={eachItem.imageUrl} alt={eachItem.name} />
                <p>{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <p>{lifeAtCompany.description}</p>
          <img src={lifeAtCompany.imageUrl} alt="life at company" />
          <h1 className="similar-products-heading">Similar Jobs</h1>
          <ul className="similar-products-list">
            {similarJobsdata.map(eachSimilarProduct => (
              <SimilarJobs
                similarJobsdata={eachSimilarProduct}
                key={eachSimilarProduct.id}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default AboutJob
