import UserEntity from "../entities/userEntity";

export function transformToUserEntity(rawUser: any): UserEntity {
  const {
    user_id,
    email,
    password,
    username,
    profile_image,
    otp_pass,
    otp_exp_date,
    user_verified,
    pass_exp_date,
  } = rawUser;
  return {
    userId: user_id,
    email,
    password,
    username,
    profileImage: profile_image,
    otpPass: otp_pass,
    otpExpDate: otp_exp_date,
    userVerified: user_verified === 0 ? false : true,
    passExpDate: pass_exp_date,
  };
}
