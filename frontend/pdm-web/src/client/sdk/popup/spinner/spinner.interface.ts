import { EventEmitter } from '@angular/core';

export interface ISpinner {
    showSpinner(message: string): void;
    showNoData(message: string): void;
    showError(message: string): void;
    hideSpinner(): void;
}