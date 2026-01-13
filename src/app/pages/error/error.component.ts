import { Component, OnInit, OnDestroy, Inject } from '@angular/core'; // Import OnDestroy
import { Location, DOCUMENT } from '@angular/common'; // Import Location service

import { takeUntil } from 'rxjs/operators'; // Keep takeUntil
import { Subject, timer } from 'rxjs'; // Import timer

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy { // Implement OnDestroy
  public coreConfig: any;
  public countdown: number = 10; // Initial countdown value
  private _timerSubscription: any; // To hold the timer subscription

  // Private
  private _unsubscribeAll: Subject<any>; // Keep for general subscriptions

  /**
   * Constructor
   *
   * @param {Location} _location // Inject Location service
   */
  constructor(private _location: Location, @Inject(DOCUMENT) private _document: Document) {
    this._unsubscribeAll = new Subject();

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Ocultar Sidebar y Navbar al entrar en la página de error
    const navbar = this._document.getElementById('navbar-main');
    const sidebar = this._document.getElementsByTagName('app-sidebar')[0] as HTMLElement;

    if (navbar) navbar.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
   
    // Start the countdown timer
    this._timerSubscription = timer(0, 1000) // Emit value immediately, then every 1 second
      .pipe(takeUntil(this._unsubscribeAll)) // Ensure it unsubscribes when component is destroyed
      .subscribe(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.goBack(); // Redirect after countdown finishes
        }
      });
  }

  /**
   * Navigates back to the previous page.
   */
  goBack(): void {
    this._location.back();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Restaurar Sidebar y Navbar al salir de la página de error
    const navbar = this._document.getElementById('navbar-main');
    const sidebar = this._document.getElementsByTagName('app-sidebar')[0] as HTMLElement;

    if (navbar) navbar.style.display = '';
    if (sidebar) sidebar.style.display = '';

    this._unsubscribeAll.complete();

    // Explicitly unsubscribe from the timer if it's still active
    if (this._timerSubscription) {
      this._timerSubscription.unsubscribe();
    }
  }
}
