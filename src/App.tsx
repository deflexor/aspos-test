import React, { useEffect, useState } from 'react'
import Signup from './widgets/Signup'
import Weather from './widgets/Weather'
import Feedback from './widgets/Feedback'
import './App.css'
import { loginUser, signupUser, logoutUser, getLoginToken, getUserPrefs, getWeatherByLocationId, setUserPrefs, sendFeedback } from './util'
import { FeedbackData, LoggedInUser, UserFormData, WeatherData, WeatherLocation } from './types'

const DEFAULT_LOCATION_ID = 'NY'

export const App = () => {
  const [currentUser, setCurrentUser] = useState<LoggedInUser>({ email: '' })
  const [weather, setWeather] = useState<WeatherData>({ location: 'New York', temp: 20 })
  const appLoginUser = async ({ userEmail, userPassword } : UserFormData) => {
    const u = await loginUser({ userEmail, userPassword })
    setCurrentUser(u)
  }
  const appSignupUser = async ({ userEmail, userPassword } : UserFormData) => {
    const u = await signupUser({ userEmail, userPassword })
    setCurrentUser(u)
  }
  const appLogoutUser = async () => {
    await logoutUser()
    setCurrentUser({ email: '' })
  }
  const appOnFeedback = (data : FeedbackData) => {
    return sendFeedback(data)
  }
  const isUserLoggedIn : () => boolean = () => Boolean(currentUser.email)

  const locationChanged = (w: WeatherLocation) => {
    setWeather(w as WeatherData)
    if (isUserLoggedIn()) {
      setUserPrefs(getLoginToken(), { location: w.id })
    }
  }

  useEffect(() => {
    const ulogin = getLoginToken()
    if (ulogin) {
      setCurrentUser({ email: ulogin })
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      const prefs = getUserPrefs(currentUser.email)
      if (prefs.location) {
        getWeatherByLocationId(prefs.location).then(w => {
          setWeather(w)
        })
      }
    } else {
      getWeatherByLocationId(DEFAULT_LOCATION_ID).then(w => {
        setWeather(w)
      })
    }
  }, [currentUser])
  return (
        <>
            <Signup user={currentUser} onSignup={appSignupUser} onSignin={appLoginUser} onLogout={appLogoutUser} />
            <Feedback userEmail={currentUser.email} onFeedback={appOnFeedback} />
            <Weather weatherData={weather} locationChanged={locationChanged} />
        </>
  )
}

export default App
