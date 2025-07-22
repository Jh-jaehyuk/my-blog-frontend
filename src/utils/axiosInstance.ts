import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 5000,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: true
})

function getCookie(name: string) {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));

  if (!cookieValue) {
    return null
  }

  const realCookie = cookieValue.split('=')
  realCookie.shift()

  return decodeURIComponent(realCookie.join('='))
}

axiosInstance.interceptors.request.use(config => {
    const csrfToken = getCookie('csrftoken')
    const userToken = localStorage.getItem('userToken')

    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken
    }

    if (userToken) {
        config.headers['Authorization'] = `Bearer ${userToken}`
    }

    return config
})

export default axiosInstance;