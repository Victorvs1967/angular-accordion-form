import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import { Type, types } from './utils/types';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { typeValidator } from './utils/type.validators';
import { DialogOutput, FormArrDialogComponent } from './components/form-arr-dialog/form-arr-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  private fornBuilder = inject(FormBuilder);
  private matDialog = inject(MatDialog);

  @ViewChild(MatAutocompleteTrigger) trigger?: MatAutocompleteTrigger;
  private readonly destroy$ = new Subject<void>();

  formGroup?: FormGroup;
  typeCtrl: FormControl = new FormControl();
  fiteredTypeOptions?: Observable<Type[]>;

  private _filterTypes(value: string | Type): Type[] {
    const filterValue = typeof value === 'string' ?
      value.toLowerCase() :
      value.title.toLowerCase();

    return types.filter(option => option.title.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    this.formGroup = this.fornBuilder.group({
      typeCtrl: ['', [Validators.required, typeValidator(types)]],
    });
    this.setFilteredTypeOptions();
  }

  ngAfterViewInit(): void {
    this.trigger?.panelClosingActions
      .subscribe(e => {
        if (!e?.source) {
          this.resetType();
          this.typeCtrl.setErrors({ invalid: true });
          this.trigger?.closePanel();
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFilteredTypeOptions(): void {
    this.fiteredTypeOptions = this.formGroup?.controls['typeCtrl']
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        startWith(''),
        map(value => this._filterTypes(value))
      );
  }

  resetType() {
    this.formGroup?.controls['typeCtrl']
      .setValue({
        key: '',
        title: '',
        description: '',
      });
  }

  onTypeChange(): void {
    this.typeCtrl.setErrors(null);
  }

  getOptionTitle(option: Type): string {
    return option.title;
  }

  openFormArrDialog(): void {
    this.matDialog.open(FormArrDialogComponent, {
      disableClose: true,
      width: '600px',
      maxHeight: '90vh',
    })
    .afterClosed()
    .subscribe((dialogOutput: DialogOutput) => {
      if (dialogOutput.action === 'confirm') {
        console.log('[type-create-requests]'.concat(JSON.stringify(dialogOutput.typeCreateRequests)));
      }
    });
  }

}
