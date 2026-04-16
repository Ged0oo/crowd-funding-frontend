export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  birthdate: string;
  profile_picture: string | null;
  facebook_profile: string | null;
  country: string | null;
  // is_active: boolean;
  // is_staff: boolean;
  // is_superuser: boolean;
  // date_joined: string;
  // created_at: string;
  // deleted_at: string | null;
  // last_login: string | null;
  // groups: any[];
  // user_permissions: any[]; 
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
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  profile_picture: string | null; 
  facebook_profile: string | null;
  birthdate: string;
  country: string | null;
}

export interface OtpPayload {
  email: string;
  otp: string;
}