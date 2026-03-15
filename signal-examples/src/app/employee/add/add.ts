import { Component, inject, signal, Signal } from '@angular/core';
import { EmployeeModel } from '../../models/employee';
import { EmployeeService } from '../service/employee.service'
import { email, form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    imports: [FormField],
    template: `
    <div class="form-container">
        <h1>{{title()}}</h1>
        <p>add workss!</p>

        <form (submit)="saveEmployee($event)" method="post">
            <label for="firstname">First Name:</label>
            <input type="text" id="firstname" [formField]="employeeForm.firstname">
            @if(employeeForm.firstname().touched() && employeeForm.firstname().invalid()) {
                <ul class="errormessage">
                @for(error of employeeForm.firstname().errors(); track error.kind) {
                    <li>{{error.message}}</li>
                }
                </ul>
            }

            <label for="lastname">Last Name:</label>
            <input type="text" id="lastname" [formField]="employeeForm.lastname">

            <label for="email">Email:</label>
            <input type="text" id="email" [formField]="employeeForm.email">
            @if(employeeForm.email().touched() && employeeForm.email().invalid()) {
                <ul class="errormessage">
                @for(error of employeeForm.email().errors(); track error.kind) {
                    <li>{{ error.message }}</li>
                }
                </ul>
            }

            <label for="phoneno">Phone:</label>
            <input type="text" id="phoneno" [formField]="employeeForm.phoneno">
            @if(employeeForm.phoneno().touched() && employeeForm.phoneno().invalid()) {
                <ul class="errormessage">
                @for(error of employeeForm.phoneno().errors();track error) {
                    <li>{{error.message}}</li>
                }
                </ul>
            }

            <label for="address">Address:</label>
            <textarea id="address" [formField]="employeeForm.address"></textarea>
            @if(employeeForm.address().touched() && employeeForm.address().invalid()) {
                <ul class="errormessage">
                @for(error of employeeForm.address().errors();track error) {
                    <li>{{error.message}}</li>
                }
                </ul>
            }

            <label>Is Contract</label>
            <input type="checkbox" id="iscontract" [formField]="employeeForm.iscontract">

            <button type="submit" [disabled]="employeeForm().invalid()">Save</button>
        </form>
    </div>
    `,
    styleUrl: './add.css',
    providers: [EmployeeService]
})
export class Add {

    public title = signal<string>('Add Employees');
    private editMode = signal(false);
    private employeeId = signal('');

    public constructor(
        private employeeService: EmployeeService,
        private router: Router,
        private activeRoute: ActivatedRoute
    ) { }

    public employeeModel = signal<EmployeeModel>({
        firstname: '',
        lastname: '',
        email: '',
        phoneno: '',
        address: '',
        iscontract: false
    });

    public employeeForm = form(this.employeeModel, (schemaPath) => {
        required(schemaPath.firstname, { message: 'First Name is required' });
        minLength(schemaPath.firstname, 5, { message: 'First Name should be minimum 5 characters' });
        maxLength(schemaPath.firstname, 15, { message: 'First Name should be maximum 15 characters' });
        required(schemaPath.email, { message: 'Email is required' });
        email(schemaPath.email, { message: 'Email is not valid' });
        required(schemaPath.phoneno, { message: 'Phone is required' });
        required(schemaPath.address, { message: 'Address is required' });
    });

    ngOnInit() {
        this.employeeId.set(this.activeRoute.snapshot.params['id'] || '');
        if (this.employeeId()) {
            this.editMode.set(true);
            this.title.set('Edit Employee');
            this.setEditEmployee(this.employeeId());
        }
    }


    public saveEmployee(evt: Event): void {
        evt.preventDefault();
        console.log('saveEmployee', this.employeeForm().value());
        if (this.employeeForm().valid()) {
            if (this.editMode()) {
                this.employeeService.UpdateEmployee(
                    this.employeeId(),
                    this.employeeForm().value()
                ).subscribe(item => {
                    console.log('created successfully ', item);
                });

            } else {
                this.employeeService.SaveEmployee(
                    this.employeeForm().value()
                ).subscribe(item => {
                    console.log('created successfully ', item);
                })
            }
            alert(`Employee ${this.editMode() ? 'updated' : 'created'} successfully`);
            this.router.navigate(['/employee']);

        }

    }

    setEditEmployee(id: string) {
        this.employeeService.getEmployeeById(id).subscribe(item => {
            this.employeeModel.set(item);
            // this.empForm().setValue(item);
        });

    }
}
