import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import { typeValidator } from 'src/app/utils/type.validators';
import { Type, types } from 'src/app/utils/types';

@Component({
  selector: 'app-form-arr-dialog',
  templateUrl: './form-arr-dialog.component.html',
  styleUrls: ['./form-arr-dialog.component.sass']
})
export class FormArrDialogComponent implements OnInit, OnDestroy {

  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger | undefined;

  public dialogRef = inject(MatDialogRef<FormArrDialogComponent>);
  private formBuilder = inject(FormBuilder);

  private readonly destroy$ = new Subject<void>();
  filteredTypeOptions?: Observable<Type[]>

  private filterTypes(value: string | Type): Type[] {
    if (typeof value === 'string') {
      return this._filterTypes(value);
    } else {
      return this._filterTypes(value.title);
    };
  }

  private _filterTypes(type: string): Type[] {
    let filterValue = '';
    if (!!type) filterValue = type.toLowerCase();
    return types.filter(option => option.title.toLowerCase().includes(filterValue));
  }

  formGroup: FormGroup = new FormGroup({});
  typeCreate: Type = new Type('', '', '');
  currentPanelIndex: number = 0;
  currentControl = this.typeArr()?.at(this.currentPanelIndex);
  typeControl = this.currentControl?.get('type');
  tooltipText: string = 'Check console log after create';

  ngOnInit(): void {
    this.initializeForm();
    this.setFilteredTypeOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFilteredTypeOptions(): void {
    this.filteredTypeOptions = this.typeArr()
      .at(this.currentPanelIndex)
      .get('type')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        startWith(''),
        map((value: string | Type) => this.filterTypes(value))
      );
  }

  initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      typeArr: this.formBuilder.array([]),
    });
    this.addType();
  }

  typeArr(): FormArray {
    return this.formGroup.get('typeArr') as FormArray;
  }

  newType(): FormGroup {
    return this.formBuilder.group({
      type: [new Type('', '', ''), [ Validators.required, typeValidator(types) ]],
    });
  }

  addType(): void {
    this.typeArr().push(this.newType());
  }

  resetType(): void {
    this.typeArr()
      .at(this.currentPanelIndex)
      .get('type')
      ?.reset(new Type('', '', ''));
  }

  removeTypeAt(index: number): void {
    this.typeArr().removeAt(index);
    this.currentPanelIndex--;
  }

  onTypeChange() {
    this.typeArr()
      .at(this.currentPanelIndex)
      .get('type')
      ?.setErrors(null);
    this.typeArr()
      .at(this.currentPanelIndex)
      .get('type')
      ?.setValidators([Validators.required, typeValidator(types).bind(this)]);
  }

  getOptionText(option: Type) {
    return option.title;
  }

  onCancelClick(): void {
    const output: DialogOutput = {
      action: 'cancel',
    };
    this.dialogRef.close(output);
  }

  onCreateClick(): void {
    const typeCreateRequests: Type[] = this.typeArr().value;
    const output: DialogOutput = {
      action: 'confirm',
      typeCreateRequests: typeCreateRequests,
    };
    this.dialogRef.close(output);
  }

  onPanelOpen(idx: number) {
    this.currentPanelIndex = idx;
    this.setFilteredTypeOptions();
    this.typeArr()
    .at(this.currentPanelIndex)
    .get('type')
    ?.patchValue(
      this.typeArr()
        .at(this.currentPanelIndex)
        .get('type')
        ?.value,
      {
        emitEvent: true,
      }
      )
  }
}

export interface DialogOutput {
  action: 'confirm' | 'cancel';
  typeCreateRequests?: Type[];
}
