import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReactive } from './form-reactive';

describe('FormReactive', () => {
    let component: FormReactive;
    let fixture: ComponentFixture<FormReactive>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormReactive],
        }).compileComponents();

        fixture = TestBed.createComponent(FormReactive);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
