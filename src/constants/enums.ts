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

export enum CustomerStatus {
  Active = 'Hoạt động',
  Pending = 'Chờ xử lý',
  Cancel = 'Đã hủy'
}

export enum UserDepartment {
  Technology = 'Phòng công nghệ',
  Sale = 'Phòng kinh doanh',
  Marketing = 'Phòng marketing'
}

export enum UserRole {
  Tech = 'Công nghệ',
  Sale = 'Kinh doanh',
  Business_Analyst = 'Business Analyst',
  FrontEnd_Developer = 'FrontEnd Developer',
  BackEnd_Developer = 'BackEnd Developer',
  FullStack_Developer = 'FullStack Developer',
  UIUX_Designer = 'UI/UX Designer',
  Mobile_Developer = 'Mobile Developer',
  Admin_HR = 'Admin HR',
  Creative_Marketing = 'Creative Marketing',
  Chief_Marketing_Officer = 'Chief Marketing Officer',
  Chief_Executive_Officer = 'Chief Executive Officer',
  Marketing_Director = 'Marketing Director'
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
