import { Component, signal } from '@angular/core';
import { EmployeeListModel, EmployeeModel } from '../../models/employee';
import { EmployeeService } from '../service/employee.service';
import { Router } from '@angular/router';

@Component({
    imports: [],
    template: `
    <div class="form-container">
        <h1>Add Employee</h1>
        <button (click)="navigateToAdd()" style="width: 15%;" class="btn-primary">Add New Employee</button>
        <table>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone No</th>
                    <th>Address</th>
                    <th>Is Contract</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @for (emp of employeeList(); track emp.id) {
                    <tr>
                        <td>{{emp.firstname}}</td>
                        <td>{{emp.lastname}}</td>
                        <td>{{emp.email}}</td>
                        <td>{{emp.phoneno}}</td>
                        <td>{{emp.address}}</td>
                        <td>{{emp.iscontract ? 'Yes' : 'No'}}</td>
                        <td>
                            <div class="btn-container">
                                <button (click)="editEmployee(emp.id)" class="btn-info">Edit</button>
                                <button (click)="deleteEmployee(emp.id)" class="btn-danger">Delete</button>

                            </div>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    </div>
    `,
    styleUrl: './list.css',
})
export class List {
    public employeeList = signal<EmployeeListModel[]>([]);

    constructor(
        private employeeService: EmployeeService,
        private router: Router
    ) { }

    ngOnInit() {
        this.employeeService.getAllEmployee()
            .subscribe(items =>
                this.employeeList.set(items));
    }

    deleteEmployee(id: string) {
        if (confirm('Are you sure to delete this employee?')) {
            this.employeeService.deleteEmployee(id).subscribe(() => {
                // Refresh the list after deletion
                this.employeeService.getAllEmployee().subscribe(items => {
                    this.employeeList.set(items);
                });
            });
        }
    }

    editEmployee(id: string) {
        this.router.navigate(['/editemployee', id]);
    }
    navigateToAdd() {
        this.router.navigate(['/addemployee']);
    }

}
