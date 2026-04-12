export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  profile_picture?: string | null
  is_verified: boolean
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  logout: () => void
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
  profile_picture?: File | null
}
