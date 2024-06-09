import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { EllipsisVertical, Github, Linkedin, LucideAngularModule, Moon, Package, Sun } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(LucideAngularModule.pick({ Sun, Moon, Linkedin, EllipsisVertical, Github, Package })),
  ],
};
