import { Injectable, signal, WritableSignal } from '@angular/core';
import { PeriodicElement } from '../interfaces/periodic-element';
import { ELEMENT_DATA } from './periodic-element.model';

@Injectable({
  providedIn: 'root'
})
export class ElementService {
  private elements$: WritableSignal<PeriodicElement[]> = signal(ELEMENT_DATA);

  getElements(): WritableSignal<PeriodicElement[]> {
    return this.elements$;
  }

  updateElement(updatedElement: PeriodicElement) {
    const currentData: PeriodicElement[] = this.elements$();
    const updatedData: PeriodicElement[] = currentData.map(element =>
      element.position === updatedElement.position ? { ...updatedElement } : element
    );

    this.elements$.set(updatedData);
  }
}
