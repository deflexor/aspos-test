
export type UserFormData = {
  userEmail: string;
  userPassword: string;
}

export type LoggedInUser = {
  email: string;
  error?: Error;
}

export async function loginUser(credentials: UserFormData) : Promise<LoggedInUser> {
  return fetch('/api/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())
  .then(({email}) => {
    return {email}
  })
  .catch((error : Error) => {
    return {email: '', error}
  })
 }

 export async function signupUser(credentials: UserFormData) : Promise<LoggedInUser> {
  return fetch('api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())
  .then(({email}) => {
    return {email}
  })
  .catch((error : Error) => {
    return {email: '', error}
  })
}

export function setLoginToken(userToken : string) {
  localStorage.setItem('token', userToken);
}

export function getLoginToken() : string {
  const t = localStorage.getItem('token');
  return t || ''
}

export async function logoutUser() {
  setLoginToken('')
}