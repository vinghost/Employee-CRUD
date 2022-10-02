import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

@ViewChild('addEmployeeButton') addEmployeeButton:any;
  @ViewChild('fileInput') fileInput: any;

  title = 'Employee-CRUD';
  employeeForm: FormGroup | any;
  employees: Employee[] | any;
  employeestoDisplay: Employee[] | any;


  // education options
  educationOptions = [
    '10thpass',
    'diploma',
    '12th',
    'Graduate',
    'Post-Graduate',
    'PHD'
  ];


  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
    this.employeeForm = this.fb.group({});
    this.employees = [];
    this.employeestoDisplay = this.employees;
  }


  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstname: this.fb.control(''),
      lastname: this.fb.control(''),
      birthdate: this.fb.control(''),
      gender: this.fb.control(''),
      education: this.fb.control('default'),
      company: this.fb.control(''),
      jobexperince: this.fb.control(''),
      salary: this.fb.control(''),
    });
    this.employeeService.getEmployees().subscribe(res => {
      for (let emp of res) {
        this.employees.unshift(emp);
      }
      this.employeestoDisplay = this.employees;
    });
  }


  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    // this.buttontemp.nativeElement.click();

  }

  addEmployee() {
    let employee: Employee = {
      firstname: this.FirstName.value,
      lastname: this.LastName.value,
      birthdate: this.Birthdate.value,
      gender: this.Gender.value,
      education: this.educationOptions[parseInt(this.Education.value)],
      company: this.Company.value,
      jobexperince: this.JobExperince.value,
      salary: this.Salary.value,
      profile: this.fileInput.nativeElement.files[0]?.name,
    }
    this.employeeService.postEmployee(employee).subscribe((res) => {
      this.employees.unshift(res);
      this.clearForm();
    });
  }

  removeEmployee(event:any){
    this.employees.forEach((val: { id: number; }, index: any) => {
      if(val.id ===parseInt(event) )
      { 
        this.employeeService.deleteEmployee(event).subscribe((res)=>{
          this.employees.splice(index,1);
        });
      } 
    });

  }


  editEmployee(event:any){
    this.employees.forEach((val: Employee,ind: any)=>{
      if(val.id===event){
        this.setForm(val);
      }
    }); 
    this.removeEmployee(event);
    this.addEmployeeButton.nativeElement.click();
  }

  setForm(emp:Employee){
    this.FirstName.setValue(emp.firstname);
    this.LastName.setValue(emp.lastname);
    this.Birthdate.setValue(emp.birthdate);
    this.Gender.setValue(emp.gender);

    let educationIndex=0;
    
    this.educationOptions.forEach((val,index)=>{
      if(val===emp.education) educationIndex= index;
    });
    this.Education.setValue(educationIndex);
    this.Company.setValue(emp.company);
    this.JobExperince.setValue(emp.jobexperince);
    this.Salary.setValue(emp.salary);
    this.fileInput.nativeElement.value='';
  }

  searchEmployees(event:any){
    let filteredEmployees: Employee[] =[];
    if(event === ''){
      this.employeestoDisplay = this.employees;
    }
    else{
      filteredEmployees=this.employees.filter((val:any,index: any)=>{
        let targetKey = val.firstname.toLowerCase() + '' + val.lastname.toLowerCase();
        let searchKey = event.toLowerCase();
        return targetKey.includes(searchKey);
      });
      this.employeestoDisplay=filteredEmployees;
    }

  }


  clearForm() {
    this.FirstName.setValue('');
    this.LastName.setValue('');
    this.Birthdate.setValue('');
    this.Gender.setValue('');
    this.Education.setValue('');
    this.Company.setValue('');
    this.JobExperince.setValue('');
    this.Salary.setValue('');
    this.fileInput.nativeElement.value = '';
  }

  public get FirstName(): FormControl {
    return this.employeeForm.get('firstname') as FormControl;
  }
  public get LastName(): FormControl {
    return this.employeeForm.get('lastname') as FormControl;
  }
  public get Birthdate(): FormControl {
    return this.employeeForm.get('birthdate') as FormControl;
  }
  public get Gender(): FormControl {
    return this.employeeForm.get('gender') as FormControl;
  }
  public get Education(): FormControl {
    return this.employeeForm.get('education') as FormControl;
  }
  public get Company(): FormControl {
    return this.employeeForm.get('company') as FormControl;
  }
  public get JobExperince(): FormControl {
    return this.employeeForm.get('jobexperince') as FormControl;
  }
  public get Salary(): FormControl {
    return this.employeeForm.get('salary') as FormControl;
  }

}
