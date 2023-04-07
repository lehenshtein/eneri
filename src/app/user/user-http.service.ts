import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '@shared/models/user.interface';
import { IResponseMessage } from '@shared/models/response-message.interface';

@Injectable({
  providedIn: 'root'
})
export class UserHttpService {

  constructor(private http: HttpClient) { }

  updateUser(data: {name: IUser['name'], contactData: IUser['contactData']}) {
    return this.http.patch<IResponseMessage>(`/user`, data);
  }
}
