import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, UrlTree } from '@angular/router';
import { SignUpComponent } from '@app/components/auth/sign-up/sign-up.component';
import { Observable } from 'rxjs/Observable';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<SignUpComponent> {

  // canDeactivate():boolean {
  //   return window.confirm("You want to leave this page?");
  // }

  canDeactivate(component: CanComponentDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate() ?
    true : confirm("You want to leave this page?");

    // return window.confirm("You want to leave this page?");
  }
}
