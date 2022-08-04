import { Request, Response } from "express";

import bodyParser from "body-parser";
import fs from "fs";
import { v4 as uuid } from "uuid";

const express = require('express');
const app = express();
const port = 3000;

// const app: Application = express();
// app.use(bodyParser.json());

app.use(bodyParser.json());

// type Students ={
//     id:string;
//     name:string;
//     nrClass:number;
// };

class Students {
    public id: string;
    public name: string;
    public nrClass: number;
  
    constructor(name: string, nrClass: number) {
      this.id = uuid();
      this.name = name || "";
      this.nrClass = nrClass;
    }
  }

// type Grade = {
//     id:string;
//     idStudent: string;
//     subject: string;
//     grade: number;
// };

class Grade {
  public id: string;
  public idStudent: string;
  public subject: string;
  public grade: number;

  constructor(idStudent: string, subject: string, grade: number) {
    this.id = uuid();
    this.idStudent = idStudent;
    this.subject = subject;
    this.grade = grade;
  }
}

let studentArray:Array<Students> = [];
let gradeArray:Array<Grade> = [];

readStudents();
readGrade();

app.get('/seeStudents', (_req: Request, res: Response) => {
  res.send(studentArray);
});

app.get('/seeGrade',(_req: Request, res: Response) => {
  res.send(gradeArray);
});

app.get('/garde/:name', (req: Request, res: Response) => {
  const studentName = req.params.name;
  const studentObject = checkForStudent(studentName);
  const studentId = studentObject?.id;
  const studentGradeArray = gradeArray.filter((gradeArray)=>gradeArray.idStudent == studentId);
  res.send(studentGradeArray);
});

app.post('/insertStudent', (req:Request, res:Response) =>{
  const newStudent:Students = new Students(req.body.name, req.body.nrClass);  
  if (!newStudent){
    res.status(404).send("No student sent!");
  }
  const newStudentObject:Students = {id:uuid(), name:newStudent.name, nrClass:newStudent.nrClass};
  studentArray.push(newStudentObject);
  res.send({...newStudentObject, status:200} as Students);
  writeStudents();
});

app.post("/gradeStudent", (req:Request, res:Response) => {
  const studentRecord = checkForStudent(req.params.name);
  if (!studentRecord){
     res.status(404).send("Error!");
  }
  const newGrade: Grade = new Grade (req.body.idStudent, req.body.subject, req.body.grade);
  const newGradeObject:Grade = {id:uuid(), idStudent:newGrade.idStudent, subject:newGrade.subject, grade:newGrade.grade};
  gradeArray.push(newGradeObject);
  res.send({...newGradeObject, status:200} as Grade);
  writeGrade();

  // const newGrade: Grade = new Grade (req.body.idStudent, req.body.subject, req.body.grade);
  // if (!newGrade){
  //   res.status(404).send("Error!");
  // }
  // const newGradeObject:Grade = {id:uuid(), idStudent:newGrade.idStudent, subject:newGrade.subject, grade:newGrade.grade};
  // gradeArray.push(newGradeObject);
  // res.send({...newGradeObject, status:200} as Grade);
  // writeGrade();

})

function readStudents (): void {
    try {
        const newStudent:Array<Students> = JSON.parse(fs.readFileSync("students.json",'utf-8'));
        for (let i=0; i<newStudent.length; i++){
          studentArray.push(newStudent[i]);
        }
      } catch {
        console.log("Something wrong!");
      }
}

function readGrade (): void {
    try {
        const newGrade:Array<Grade> = JSON.parse(fs.readFileSync("grades.json",'utf-8'));
        for (let i=0; i<newGrade.length; i++){
          gradeArray.push(newGrade[i]);
        }
      } catch {
        console.log("Something wrong!");
      }
}

function checkForStudent (name:string | undefined){
    for (const studentRecord of studentArray) {
        if (studentRecord.name === name) {
          return studentRecord;
        }
      }
      return undefined;
}

function writeStudents (): void {
    try {
        fs.writeFileSync("students.json", JSON.stringify(studentArray));
      } catch {
        console.log("Something wrong!");
      }
}

function writeGrade (): void {
    try {
        fs.writeFileSync("grades.json", JSON.stringify(gradeArray));
      } catch {
        console.log("Something wrong!");
      }
}

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
  });