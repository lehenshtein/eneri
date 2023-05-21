
export interface IUserLogin {
  email: string,
  password: string
}

export interface IUserRegister extends IUserLogin {
  username: string
}
export interface IUser {
  _id: number,
  name: string,
  username: string,
  about: string,
  email: string,
  password: string,
  birthDate: Date,
  role: 'superAdmin' | 'admin' | 'moderator' | 'user',
  gameRole: 'player' | 'both',
  gamesLeaded: number,
  gamesPlayed: number,
  rate: number,
  status: 'default' | 'muted' | 'banned',
  statusTillDate: Date | null,
  contactData: IContactData,
  showContacts: boolean,
  verified: boolean,
  verificationDate: Date,
  avatar: string,
  updatedAt: Date,
  createdAt: Date,
}

interface IContactData {
  city: { name: string, code: number } | undefined,
  phone: string | undefined,
  telegram: string | undefined
}

export interface IUserAsMaster {
  name: string,
  username: string,
  about: string,
  gamesLeaded: number,
  gamesPlayed: number,
  telegram: string | undefined,
  avatar: string,
  createdAt: Date,
}
