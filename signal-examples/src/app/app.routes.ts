import { Routes } from '@angular/router';
import { Add } from './employee/add/add';
import { List } from './employee/list/list';
import { FormReactive } from './form-reactive/form-reactive';

export const routes: Routes = [
    {
        path: 'addemployee', component: Add
    },
    {
        path: 'employee', component: List
    },
    {
        path: 'editemployee/:id', component: Add
    },
    {
        path: 'form', component: FormReactive
    },
];
