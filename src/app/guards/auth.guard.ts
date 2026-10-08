import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // If still loading session from storage, wait a moment
  if (auth.isLoading()) {
    await auth.restoreSession();
  }

  if (auth.isAuthenticated() && auth.isAdmin()) {
    return true;
  }

  // Not logged in as admin
  return router.createUrlTree(['/login']);
};
