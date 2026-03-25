# SignalExamples

This project is focus on learning angular moderm.

- Que aprendi
  - Form con Sign
  - Validacion de Form con signal
  - Instalar JSON server
    - npm install -g json-server
    - Ejecutar server
      - json-server --watch src/db/db.json

  - Reactive and Template-driven Form (src/app/forms-reactive)
    - [Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
      - FormControl
      - ControlValueAccessor
      - Grouping Form controls
        - Form group
          - update setValue(): replaces the entire value for the contro
          - patchValue(): replace any properties defined in the object that have changed
        - Form array ([Dimanic Forms](https://angular.dev/guide/forms/reactive-forms#creating-dynamic-forms))

      - Form validation: define validators as functions that receive a controls
    - Template-driven
      - NgModel (two-way-binding)
      - FormControl
      - ControlValueAccessor
      - Form validation: Tied to template directives

## Reference

- [CRUD signal Form](https://www.youtube.com/watch?v=1N6rq5fUddA)
