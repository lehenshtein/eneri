import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {

  constructor(public dialog: MatDialog) { }
  set setModalData(data: any) {
    this.modalData = data;
  };
  get getModalData(): any {
    const data = this.modalData;
    this.modalData = undefined;
    return data;
  }
  private modalData: any;

  openDialog(component: ComponentType<any>) {
    this.dialog.open(component, {minWidth: '50%', width: '700px', maxWidth: '90vw'});
  }

  close() {
    this.dialog.closeAll();
  }
}
