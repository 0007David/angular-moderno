import { HttpClient } from "@angular/common/http";
import { EmployeeListModel, EmployeeModel } from "../../models/employee";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private readonly _API: string = 'http://localhost:3000/employees';

    constructor(private http: HttpClient) { }

    SaveEmployee(data: EmployeeModel) {
        return this.http.post(this._API, data);
    }

    getAllEmployee() {
        return this.http.get<EmployeeListModel[]>(this._API);
    }

    deleteEmployee(id: string) {
        return this.http.delete(`${this._API}/${id}`);
    }

    getEmployeeById(id: string) {
        return this.http.get<EmployeeModel>(`${this._API}/${id}`);
    }

    UpdateEmployee(id: string, data: EmployeeModel) {
        return this.http.put(`${this._API}/${id}`, data);
    }

}
