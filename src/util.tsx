
import { UserFormData, LoggedInUser, UserPrefs, WeatherData, WeatherLocation, FeedbackData, FeedbackResponse } from './types'

export async function loginUser (credentials: UserFormData) : Promise<LoggedInUser> {
  return fetch('/api/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
    .then(({ email }) => {
      setLoginToken(email)
      return { email }
    })
    .catch((error : Error) => {
      return { email: '', error }
    })
}

export async function signupUser (credentials: UserFormData) : Promise<LoggedInUser> {
  return fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
    .then(({ email }) => {
      setLoginToken(email)
      return { email }
    })
    .catch((error : Error) => {
      return { email: '', error }
    })
}

export async function getWeatherByLocationId (locId: string) : Promise<WeatherData> {
  return fetch(`/api/weather?location=${locId}`, { method: 'GET' })
    .then(data => data.json())
}

export async function getWeatherLocations () : Promise<WeatherLocation[]> {
  return fetch('api/weather', { method: 'GET' })
    .then(data => data.json())
}

export async function sendFeedback (data: FeedbackData) : Promise<FeedbackResponse> {
  return fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(data => data.json())
    .then(() => {
      return { ok: true }
    })
    .catch((error : Error) => {
      return { ok: false, error: error.message }
    })
}

export async function logoutUser () {
  setLoginToken('')
}

export function setLoginToken (userToken : string) {
  localStorage.setItem('token', userToken)
}

export function getLoginToken () : string {
  const t = localStorage.getItem('token')
  return t || ''
}

export function getUserPrefs () : UserPrefs {
  const p = localStorage.getItem('prefs')
  if (p) {
    return JSON.parse(p)
  } else {
    return { location: '' }
  }
}
export function setUserPrefs (prefs : UserPrefs) {
  localStorage.setItem('prefs', JSON.stringify(prefs))
}
