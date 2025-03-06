import { Routes } from '@angular/router';
import { UserModule } from './modules/user/user.module';
import { UserhomeComponent } from './modules/user/userhome/userhome.component';
import { PagenotfoundComponent } from './modules/sharedmodules/pagenotfound/pagenotfound.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
        
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
      },
      {
        path: '**',
        component: PagenotfoundComponent
      }
];
