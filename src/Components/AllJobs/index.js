import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'

import Header from '../Header'
import JobCardItem from '../JobCardItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const failureViewImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class AllJobs extends Component {
  state = {
    profileData: {},
    jobsData: [],
    activeCheckBoxList: [],
    searchInput: '',
    activeSalaryRangeId: '',
    apiStatus: apiStatusConstants.initial,
    apiJobsStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseProfile = await fetch(url, option)

    if (responseProfile.ok === true) {
      const fetchedDataProfile = await responseProfile.json()
      const updatedDataProfile = {
        name: fetchedDataProfile.profile_details.name,
        profileImageUrl: fetchedDataProfile.profile_details.profile_image_url,
        shortBio: fetchedDataProfile.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedDataProfile,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsData = async () => {
    this.setState({apiJobsStatus: apiStatusConstants.inProgress})
    const {activeCheckBoxList, activeSalaryRangeId, searchInput} = this.state
    const type = activeCheckBoxList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const api = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobs = await fetch(api, option)
    if (responseJobs.ok === true) {
      const fetchedDataJobs = await responseJobs.json()
      const updatedDataJobs = fetchedDataJobs.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employmentType,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsData: updatedDataJobs,
        apiJobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSelectSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobsData)
  }

  onClickCheckBox = event => {
    const {activeCheckBoxList} = this.state
    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedList = activeCheckBoxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckBoxList: updatedList}, this.getJobsData)
    } else {
      this.setState(
        prevState => ({
          activeCheckBoxList: [
            ...prevState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  onGetProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div>
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  onRetryprofile = () => {
    this.getProfileData()
  }

  onGetProfileFailureView = () => (
    <div>
      <button type="button" onClick={this.onRetryProfile}>
        retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRetryJobs = () => {
    this.getJobsData()
  }

  onRenderProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onRetryJobs = () => {
    this.onGetJobView()
  }

  onGetJobsFailureView = () => (
    <div>
      <img src={failureViewImg} alt="failure view" />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onRetryJobs}>
        retry
      </button>
    </div>
  )

  onGetJobView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length > 0
    return noJobs ? (
      <>
        <ul>
          {jobsData.map(eachItem => (
            <JobCardItem key={eachItem.id} item={eachItem} />
          ))}
        </ul>
      </>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p> We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  onRenderJobsStatus = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiStatusConstants.success:
        return this.onGetJobsView()
      case apiStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onGetCheckBoxesView = () => (
    <ul>
      {employmentTypesList.map(eachItem => (
        <li key={eachItem.employmentTypeId}>
          <input
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={this.onClickCheckBox}
          />
          <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonsView = () => (
    <ul>
      {salaryRangesList.map(eachItem => (
        <li key={eachItem.salaryRangeId}>
          <input
            id={eachItem.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onSelectSalaryRange}
          />
          <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onRenderSearch = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onSubmitSearchInput}
        >
          <AiOutlineSearch className="search-icon" />
        </button>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.onRenderSearch()}</div>
        <div>
          {this.onRenderProfile()}
          <hr />
          <h1>Type of Employment</h1>
          {this.onGetCheckBoxesView()}
          <hr />
          <h1>Salary Range</h1>
          {this.onGetRadioButtonsView()}
        </div>
        <div>{this.onRenderSearch()}</div>
        {this.onRenderJobsStatus()}
      </>
    )
  }
}

export default AllJobs
