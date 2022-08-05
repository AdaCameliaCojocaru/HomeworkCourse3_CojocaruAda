import { Request, Response } from "express";

import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import { v4 as uuid } from "uuid";

const express = require('express');
const app = express();
const port = 4000;

// const app: Application = express();
// app.use(bodyParser.json());

app.use(cors());

app.use(bodyParser.json());

type Students ={
    id:string;
    name:string;
    nrClass:number;
};

// class Students {
//     public id: string;
//     public name: string;
//     public nrClass: number;
  
//     constructor(name: string, nrClass: number) {
//       this.id = uuid();
//       this.name = name || "";
//       this.nrClass = nrClass;
//     }
//   }

type Grade = {
    id:string;
    idStudent: string;
    subject: string;
    grade: number;
};

// class Grade {
//   public id: string;
//   public idStudent: string;
//   public subject: string;
//   public grade: number;

//   constructor(idStudent: string, subject: string, grade: number) {
//     this.id = uuid();
//     this.idStudent = idStudent;
//     this.subject = subject;
//     this.grade = grade;
//   }
// }

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
  if (!req.body.name) {
    res.status(400).send("Please enter the name!");
    return;
  } else if (req.body.classNr <= 0 || req.body.classNr >= 12 || isNaN(req.body.classNr)) {
      res.status(400).send("Please enter the correct class number!");
      return;
  }
  const newStudent: Students = {
      id: uuid(),
      name: req.body.name,
      nrClass: req.body.nrClass,
    };
    studentArray.push(newStudent);
    res.send(newStudent);
    writeStudents();
  //const newStudent:Students = new Students(req.body.name, req.body.nrClass);  
  if (!newStudent){
    res.status(404).send("No student sent!");
  }
  studentArray.push(newStudent);
  res.send(newStudent);
  writeStudents();
});

// app.post(route, function(req, res){
//   //this is a callback function
// })

app.post("/gradeStudent", (req:Request, res:Response) => {
  const existingStudent = checkForStudent(req.body.studentName);
  if (!req.body.studentName) {
    res.status(400).send("Please enter the name!");
    return;
  } else if (!req.body.subject) {
    res.status(400).send("Please enter the subject!");
    return;
  } else if (isNaN(req.body.grade) || req.body.grade <= 1 || req.body.grade >= 10) {
    res.status(400).send("Please enter the correct number grade!");
    return;
  } else if (existingStudent === undefined) {
    res.status(400).send("This student does not exist!");
    return;
  }
  const grade: Grade = {
    id: uuid(),
    idStudent: existingStudent.id,
    subject: req.body.subject,
    grade: req.body.grade,
  };
  gradeArray.push(grade);
  res.send(grade);
  writeGrade();

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