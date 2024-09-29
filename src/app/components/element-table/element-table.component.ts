import { Component, effect, inject } from '@angular/core';
import { PeriodicElement } from '../../interfaces/periodic-element';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ElementService } from '../../services/element.service';
import { MatDialog } from '@angular/material/dialog';
import { EditElementDialogComponent } from '../edit-element-dialog/edit-element-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-element-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatButton,
  ],
  templateUrl: './element-table.component.html',
  styleUrls: ['./element-table.component.scss']
})
export class ElementTableComponent {
  private elementService = inject(ElementService);
  private dialog = inject(MatDialog);

  dataSource = new MatTableDataSource<PeriodicElement>();
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  filterControl = new FormControl('');

  constructor() {
    effect(() => {
      this.dataSource.data = this.elementService.getElements()();
    });

    this.setupFilter();
  }

  private setupFilter() {
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();
      return data.name.toLowerCase().includes(normalizedFilter) ||
        data.symbol.toLowerCase().includes(normalizedFilter) ||
        data.position.toString().includes(normalizedFilter) ||
        data.weight.toString().includes(normalizedFilter);
    };

    this.filterControl.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe(filterValue => {
        this.applyFilter(filterValue || '');
      });
  }

  async editElement(element: PeriodicElement): Promise<void> {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      data: { ...element }
    });

    const editedElement = await firstValueFrom(dialogRef.afterClosed());

    if (editedElement) {
      this.elementService.updateElement(editedElement);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
