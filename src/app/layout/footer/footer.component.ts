import { Component, Inject } from '@angular/core';
import { PartnersDialogComponent } from '@shared/components/partners-dialog/partners-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  private window!: Window;
  constructor (
    @Inject(DOCUMENT) private document: Document,
    private dialogRef: MatDialog) {
    if (this.document.defaultView) {
      this.window = this.document.defaultView;
    }
  }
  partnersDialog() {
    this.dialogRef.open(PartnersDialogComponent, {minWidth: '50%', width: '700px', maxWidth: '90vw', autoFocus: false,
      panelClass: 'bordered-dialog'})

  }
  openTg () {
    this.window.open(`https://telegram.me/EneriNews`, '_blank');
  }

}
