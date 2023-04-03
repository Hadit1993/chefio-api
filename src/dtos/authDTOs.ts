export interface RegisterUserDTO {
  email: string;
  username: string;
  password: string;
  profileImage?: string;
}

export interface ActivateAccountDTO {
  email: string;
  otpPass: number;
}

export interface LoginDto {
  email: string;
  password: string;
}
