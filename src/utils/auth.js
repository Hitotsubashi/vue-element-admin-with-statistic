import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UsernameKey = 'Username'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUsername() {
  return Cookies.get(UsernameKey)
}

export function setUsername(token) {
  return Cookies.set(UsernameKey, token)
}

export function removeUsername() {
  return Cookies.remove(UsernameKey)
}
