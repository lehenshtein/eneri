
export interface UserLoginInterface {
  email: string,
  password: string
}

export interface UserRegisterInterface extends UserLoginInterface {
  name: string
}
export interface UserInterface {
  _id: number,
  name: string,
  email: string,
  createdAt: Date
}
