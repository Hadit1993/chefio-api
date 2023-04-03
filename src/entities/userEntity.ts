export default interface UserEntity {
  userId: number;
  email: string;
  username: string;
  password: string;
  profileImage?: string;
  otpPass?: number;
  otpExpDate?: Date;
  userVerified: boolean;
  passExpDate?: Date;
}
