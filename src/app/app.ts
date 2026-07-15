import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit , ChangeDetectorRef} from '@angular/core'; // 1. Imported OnInit
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Explicitly declare if using modern Angular standalone
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit { // 2. Implement OnInit
  studentName: string = '';
  rollno: number = 0;
  dept: string = '';
  year: number = 0;
  studentDetails: any[] = [];
  isUpdateFromActive = false;
  currentStudentId = ""; 

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {}

  // 3. Moved from constructor to ngOnInit
  ngOnInit() {
    this.getAllStudent();
  }

  getAllStudent() {
    this.http.get("http://localhost:5501/getStudents").subscribe({
      next: (resultData: any) => {
        console.log("Students loaded:", resultData);
        this.studentDetails = [...resultData];
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error fetching students:", err)
    });
  }

  createStudent() {
    if (this.isUpdateFromActive) {
      this.updateStudent();
    } else {
      this.saveStudent();
    }  
  }

  saveStudent() {
    let inputData = {
      "Name": this.studentName,
      "RollNo": this.rollno,
      "Department": this.dept,
      "Year": this.year  
    };
    
    this.http.post("http://localhost:5501/addStudent", inputData).subscribe({
      next: (resultData: any) => {
        this.resetForm();
        this.getAllStudent();
        alert("Student has been Added Successfully");
      },
      error: (err) => console.error("Error saving student:", err)
    });
  }

  setStudent(data: any) {
    this.currentStudentId = data._id;
    this.studentName = data.Name;
    this.rollno = data.RollNo;
    this.dept = data.Department;
    this.year = data.Year;
    this.isUpdateFromActive = true; 
  }

  updateStudent() {
    let updateData = {
      "_id": this.currentStudentId,
      "Name": this.studentName,
      "RollNo": this.rollno,
      "Department": this.dept,
      "Year": this.year  
    }; 
    
    this.http.put("http://localhost:5501/updateStudent", updateData).subscribe({
      next: (resultData: any) => {
        this.resetForm();
        alert("Student Updated Successfully");
        this.getAllStudent();
      },
      error: (err) => {
        console.error("Error updating student. Check if your backend sends a valid JSON response back!", err);
        alert("Failed to update student on server.");
      }
    });
  }

  deleteStudent(data: any) {
    this.http.delete("http://localhost:5501/deleteStudent/" + data._id).subscribe({
      next: (resultData: any) => {
        alert("Student Deleted Successfully");
        this.getAllStudent();
      },
      error: (err) => {
        console.error("Error deleting student. Check if your backend sends a valid JSON response back!", err);
        alert("Failed to delete student on server.");
      }
    });
  }

  // Helper method to keep things dry
  resetForm() {
    this.currentStudentId = '';
    this.studentName = '';
    this.rollno = 0;
    this.dept = '';
    this.year = 0;
    this.isUpdateFromActive = false;
  }

}