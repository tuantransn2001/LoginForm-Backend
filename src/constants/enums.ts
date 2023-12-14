export enum UserVerifyStatus {
  Unverified = 'Chưa xác thực',
  Verified = 'Đã xác thực',
  Banned = 'Đã khóa'
}

export enum UserStatus {
  Official = 'Chính thức',
  Probationary = 'Thử việc',
  Collaborate = 'Hợp tác',
  Resigned = 'Đã nghỉ'
}

export enum CustomerTitle {
  Mr = 'Ông',
  Mrs = 'Bà'
}

export enum UserDepartment {
  Technology = 'Phòng công nghệ',
  Sale = 'Phòng kinh doanh',
  Marketing = 'Phòng marketing'
}

export enum UserRole {
  Tech = 'Công nghệ',
  Sale = 'Kinh doanh'
}

export enum TokenType {
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token',
  ForgotPasswordToken = 'forgot_password_token'
}

export enum VerifyOP {
  Phone = 'phone',
  Email = 'email'
}
