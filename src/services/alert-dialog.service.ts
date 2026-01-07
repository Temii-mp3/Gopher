import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  AlertDialogComponent,
  AlertDialogData,
} from '../components/alert-dialog.component/alert-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertDialogService {
  constructor(private dialog: MatDialog) {}

  openAlert(data: AlertDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: data,
    });

    return dialogRef.afterClosed();
  }

  // helper methods
  openConfirmation(title: string, message: string): Observable<boolean> {
    return this.openAlert({
      title,
      message,
      showCancel: true,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
    });
  }

  openInfo(title: string, message: string): Observable<boolean> {
    return this.openAlert({
      title,
      message,
      showCancel: false,
      confirmText: 'OK',
    });
  }
}
