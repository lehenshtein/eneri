import { IUser } from '@shared/models/user.interface';
import { ICity } from '@shared/models/city.interface';

export interface IGamePost {
  gameSystemId: IGameSystem['_id'];
  booked: string[];
  title: string;
  description: string;
  imgUrl: string;
  tags: string[];
  cityCode: ICity['code'];
  price: number;
  startDateTime: Date | undefined;
  maxPlayers: number;
}

export interface IGameResponse {
  _id: string;
  master: { username: IUser['username'], rate: IUser['rate'], avatar: string };
  creator: { username: IUser['username'], avatar: string };
  organizedPlay: boolean,
  gameSystemId: IGameSystem['_id'];
  title: string;
  description: string;
  imgUrl: string | null;
  tags: string[];
  cityCode: ICity['code'];
  price: number;
  startDateTime: Date | undefined;
  maxPlayers: number;
  players: Partial<IUser>[];
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
  booked: string[];
  bookedAmount: number;
  linkOnly: boolean;
}

export interface IGameSystem {
  _id: number,
  name: string
}
