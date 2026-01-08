import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara'; 
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MessageService } from 'primeng/api'
import { JoyrideModule } from 'ngx-joyride';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideHttpClient(withFetch()),
    importProvidersFrom(JoyrideModule.forRoot()),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Lara,
      },
    })
  ]
};
