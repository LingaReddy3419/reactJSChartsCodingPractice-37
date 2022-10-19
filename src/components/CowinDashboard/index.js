import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiConstantStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiConstantStatus.initial,
    lastSevenDaysData: [],
    ageData: [],
    genderData: [],
  }

  componentDidMount() {
    this.getCovidDetails()
  }

  getCovidDetails = async () => {
    this.setState({apiStatus: apiConstantStatus.inProgress})
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const data = await response.json()
      const last7Days = data.last_7_days_vaccination
      const byAge = data.vaccination_by_age
      const byGender = data.vaccination_by_gender

      const updatedData = last7Days.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      this.setState({
        apiStatus: apiConstantStatus.success,
        lastSevenDaysData: updatedData,
        ageData: byAge,
        genderData: byGender,
      })
    } else {
      this.setState({
        apiStatus: apiConstantStatus.failure,
      })
    }
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="fail-image"
      />
      <h1 className="fail-heading">Something Went Wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderAllData = () => {
    const {lastSevenDaysData, ageData, genderData} = this.state

    return (
      <div className="results-container">
        <VaccinationCoverage lastSevenDaysData={lastSevenDaysData} />
        <VaccinationByGender genderData={genderData} />
        <VaccinationByAge ageData={ageData} />
      </div>
    )
  }

  renderResults = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstantStatus.success:
        return this.renderAllData()
      case apiConstantStatus.inProgress:
        return this.renderLoadingView()
      case apiConstantStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <p className="logo-head">Co-WIN</p>
        </div>
        <h1 className="heading">CoWIN Vaccination in India</h1>
        {this.renderResults()}
      </div>
    )
  }
}

export default CowinDashboard
