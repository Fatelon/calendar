import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Observable abstraction over ngOnDestroy to use with takeUntil
 */
@Injectable()
export class AppDestroyService extends Subject<void> implements OnDestroy {
  public ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
