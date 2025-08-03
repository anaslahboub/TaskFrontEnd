import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { WidgetsBrandComponent } from '../widgets-brand/widgets-brand.component';
import { IconDirective } from '@coreui/icons-angular';
import { WidgetsEComponent } from '../widgets-e/widgets-e.component';
import { WidgetsDropdownComponent } from '../widgets-dropdown/widgets-dropdown.component';
import {
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  CardHeaderComponent,
  ColComponent,
  ProgressComponent,
  RowComponent,
  TemplateIdDirective,
  WidgetStatBComponent,
  WidgetStatCComponent,
  WidgetStatFComponent
} from '@coreui/angular';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [CardComponent, CardHeaderComponent, CardBodyComponent, WidgetsDropdownComponent, RowComponent, ColComponent, WidgetStatBComponent, ProgressComponent, WidgetsEComponent, WidgetStatFComponent, TemplateIdDirective, IconDirective, WidgetsBrandComponent, CardGroupComponent, WidgetStatCComponent]
})
export class WidgetsComponent implements AfterContentInit {
  private changeDetectorRef = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
