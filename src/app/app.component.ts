import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[];
  public updateEmployee: Employee;
  public deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === "add") {
      button.setAttribute('data-target', '#addEmployeeModal');
    } else if (mode === "update") {
      this.updateEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    } else if (mode === "delete") {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public onAddEmloyee(addForm: NgForm): void {
    document.getElementById('add-employee-form')?.click()

    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        this.getEmployees();
        addForm.reset(); // Duplicate code 
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset(); // Duplicate code 
      }
    )
  }

  public onUpdateEmloyee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeleteEmloyee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(
      (response: void) => {
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public searchEmployees(key: string): void {
    if (!key) {
      this.getEmployees();
      return;
    }

    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        const results: Employee[] = [];
        for (const employee of response) {
          if (JSON.stringify(employee).toLowerCase().indexOf(key.toLowerCase()) !== -1) {
            results.push(employee);
          }
        }
        this.employees = results;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
}