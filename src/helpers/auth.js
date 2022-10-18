
import { Buffer } from 'buffer'

export const setToken = (token) => {
  window.localStorage.setItem('local-user-Token', token)
}
export const setId = (id) => {
  window.localStorage.setItem('local-user-Id', id)
}

export const getToken = () => {
  return window.localStorage.getItem('local-user-Token')
}

export const getId = () => {
  return window.localStorage.getItem('local-user-Id')
}

export const getPayLoad = () => {
  const token = getToken()
  if (!token) return 
  const splitToken = token.split('.')
  if (splitToken.length !== 3) return 
  return JSON.parse(Buffer.from(splitToken[1], 'base64'))
}

export const userIsAuthenticated = () => {
  const payload = getPayLoad()
  if (!payload) return 
  const currentTime = Math.round(Date.now() / 1000) 
  return currentTime < payload.exp
}

export const userIsOwner = (item) => {
  const payload = getPayLoad()
  if (!payload) return
  return payload.userId === item.createdBy.toString()
}