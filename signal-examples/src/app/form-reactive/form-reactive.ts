import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators, FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormArray, ValueChangeEvent, StatusChangeEvent, PristineChangeEvent, TouchedChangeEvent, FormResetEvent, FormSubmittedEvent, ValidatorFn, AbstractControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

interface Item {
    id: number;
    title: string;
}

@Component({
    selector: 'app-form-reactive',
    imports: [ReactiveFormsModule, FormsModule, CommonModule],
    template: `
        <p>form-reactive works!</p>
        <form class="form" style="display: none;">
            <!-- Setup in reactive forms -->
            <label for="color">Setup in reactive forms:</label>
            Favorite Color: <input type="text" name="color" id="color" [formControl]="favoriteColorControl" />
            <br>
            <p>{{favoriteColorControl.value}}</p>
            <button type="button" (click)="updateColor()">Update Color</button>
            <br>
            <label for="color1">Setup in template-driven forms:</label>
            Favorite Color: <input type="text" name="color1" id="color1" [(ngModel)]="favoriteColor" />
            <p>{{favoriteColor()}}</p>
    </form>
    <div class="form-group" style="display: none;">
        <h1>Grouping form controls</h1>
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <label for="first-name">First Name: </label>
            <input id="first-name" type="text" formControlName="firstName" />
            <label for="last-name">Last Name: </label>
            <input id="last-name" type="text" formControlName="lastName" />
            <div formGroupName="address">
                <h2>Address</h2>
                <label for="street">Street: </label>
                <input id="street" type="text" formControlName="street" />
                <label for="city">City: </label>
                <input id="city" type="text" formControlName="city" />
                <label for="state">State: </label>
                <input id="state" type="text" formControlName="state" />
                <label for="zip">Zip Code: </label>
                <input id="zip" type="text" formControlName="zip" />
            </div>
            <!-- Display the form array in the template -->
            <div formArrayName="aliases">
                <h2>Aliases</h2>
                <button type="button" (click)="addAlias()">+ Add another alias</button>
                @for (alias of aliases.controls; track $index; let i = $index) {
                <div>
                    <!-- The repeated alias template -->
                    <label for="alias-{{ i }}">Alias:</label>
                    <input id="alias-{{ i }}" type="text" [formControlName]="i" />
                </div>
                }
            </div>
            <p>Complete the form to enable button.</p>
            <button type="button" (click)="updateProfile()">Update Profile</button>
            <button type="submit" [disabled]="!profileForm.valid">Submit</button>
        </form>
    </div>
    <form [formGroup]="demoForm">
        <h1>for Dinamic</h1>
        <div formArrayName="demoArray"
            *ngFor="let arrayItem of arrayItems; let i=index">

            <input [id]="arrayItem.id" type="checkbox"
                [formControl]="demoArray.controls[i]">

            <label [for]="arrayItem.id" class="array-item-title">
                {{arrayItem.title}}</label>

        </div>
        </form>
    `,
    styleUrl: './form-reactive.css',
})
export class FormReactive {
    private readonly cdr = inject(ChangeDetectorRef);
    favoriteColorControl = new FormControl('');

    favoriteColor = signal('');

    private formBuilder = inject(FormBuilder);

    demoForm!: FormGroup;

    arrayItems!: Item[];

    updateColor() {
        this.favoriteColorControl.setValue('Blue');
    }

    constructor() {
        this.demoForm = this.formBuilder.group({
            demoArray: this.formBuilder.array([], this.minSelectedCheckboxes())
        });
        // make sure the component notifies Angular to run change detection
        this.profileForm.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.cdr.markForCheck());
        // Unified control state change events
        this.profileForm.events
            .pipe(filter((e) => e instanceof StatusChangeEvent))
            .subscribe(e => console.log('Status:', e.status)
            );
        // this.profileForm.events.subscribe((e) => {
        //     if (e instanceof ValueChangeEvent) {
        //         console.log('Value changed to: ', e.value);
        //     }
        //     if (e instanceof StatusChangeEvent) {
        //         console.log('Status changed to: ', e.status);
        //     }
        //     if (e instanceof PristineChangeEvent) {
        //         console.log('Pristine status changed to: ', e.pristine);
        //     }
        //     if (e instanceof TouchedChangeEvent) {
        //         console.log('Touched status changed to: ', e.touched);
        //     }
        //     if (e instanceof FormResetEvent) {
        //         console.log('Form was reset');
        //     }
        //     if (e instanceof FormSubmittedEvent) {
        //         console.log('Form was submitted');
        //     }
        // });
    }


    minSelectedCheckboxes(): ValidatorFn {
        const validator: ValidatorFn = (control: AbstractControl) => {
            const formArray = control as FormArray;

            const selectedCount = formArray.controls
                .map(control => control.value)
                .reduce((prev, next) => next ? prev + 1 : prev, 0);

            return selectedCount >= 1 ? null : { notSelected: true };
        };

        return validator;
    }

    ngOnInit() {
        this.arrayItems = [
            {
                id: 1, title: 'Title 1'
            },
            {
                id: 2, title: 'Title 2'
            },
            {
                id: 3, title: 'Title 3'
            },
            {
                id: 4, title: 'Title 4'
            }
        ];
    }
    get demoArray(): FormArray<FormControl<boolean | null>> {

        return this.demoForm.get('demoArray') as FormArray;

    }

    addItem(item: Item) {
        this.arrayItems.push(item);
        this.demoArray.push(this.formBuilder.control(false));
    }

    removeItem() {
        this.arrayItems.pop();
        this.demoArray.removeAt(this.demoArray.length - 1);
    }


    // Grouping form controls
    /*profileForm = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        address: new FormGroup({
            street: new FormControl(''),
            city: new FormControl(''),
            state: new FormControl(''),
            zip: new FormControl(''),
        }),
    });*/
    // with Builder
    profileForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: [''],
        address: this.formBuilder.group({
            street: [''],
            city: [''],
            state: [''],
            zip: [''],
        }),
        //Define a FormArray control
        aliases: this.formBuilder.array([this.formBuilder.control('')])
    });

    onSubmit() {
        // TODO: Use EventEmitter with form value
        console.warn(this.profileForm.value);
    }

    updateProfile() {
        this.profileForm.patchValue({
            firstName: 'Nancy',
            address: {
                street: '123 Drew Street',
            },
        });
    }
    // Access the FormArray control
    get aliases() {
        return this.profileForm.get('aliases') as FormArray;
    }
    addAlias() {
        this.aliases.push(this.formBuilder.control(''));
    }
}
