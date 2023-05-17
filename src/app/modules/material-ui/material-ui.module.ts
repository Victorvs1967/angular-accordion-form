import { ModuleWithProviders, NgModule, inject } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';

const MATERIAL_UI_COMPONENTS = [
  MatAutocompleteModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatTooltipModule,
];

@NgModule({
  imports: [ ...MATERIAL_UI_COMPONENTS ],
  exports: [ ...MATERIAL_UI_COMPONENTS ],
  providers: [MatIconRegistry ],
})
export class MaterialUiModule {
  public natIconRegistry = inject(MatIconRegistry);

  static forRoot(): ModuleWithProviders<MaterialUiModule> {
    return {
      ngModule: MaterialUiModule,
      providers: [ MatIconRegistry ],
    };
  }
}
