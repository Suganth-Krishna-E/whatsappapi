import { Routes } from '@angular/router';
import { UserModule } from './modules/user/user.module';
import { UserhomeComponent } from './modules/user/userhome/userhome.component';
import { PagenotfoundComponent } from './modules/sharedmodules/pagenotfound/pagenotfound.component';
import { authguardGuard } from './services/guard/authguard.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
        canActivate: [authguardGuard],
        data: {role: "ROLE_USER"}
        
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
        canActivate: [authguardGuard],
        data: {role: "ROLE_ADMIN"}
      },
      {
        path: '**',
        pathMatch: "full",
        component: PagenotfoundComponent
      }
];
