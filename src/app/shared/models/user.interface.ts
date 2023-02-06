
export interface UserLoginInterface {
  email: string,
  password: string
}

export interface UserRegisterInterface extends UserLoginInterface {
  username: string
}
export interface UserInterface {
  _id: number,
  name: string,
  username: string,
  email: string,
  confirmedEmail: boolean,
  password: string,
  salt: string,
  birthDate: Date,
  role: 'superAdmin' | 'admin' | 'moderator' | 'user',
  gameRole: 'player' | 'both',
  gamesLeaded: number,
  gamesPlayed: number,
  rate: number,
  status: 'default' | 'muted' | 'banned',
  statusTillDate: Date | null,
  contactData: IContactData,
  avatar: string,
  updatedAt: Date,
  createdAt: Date,
}

interface IContactData {
  city: { name: string, code: number },
  phone: number,
  telegram: string
}
