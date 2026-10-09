export const Get_Token = (): string => {
  return localStorage.getItem('token') || ''
}

export const Set_Token = (token: string): void => {
  localStorage.setItem('token', token)
}

export const Remove_Token = (): void => {
  localStorage.removeItem('token')
}
