import fs from "fs";
import inquirer from 'inquirer';
import { v4 as uuid } from 'uuid';

class Student {
    public id: string;
    public name: string;
    public nrClass: number;

    constructor(response: { id?: string; name?: string}, nrClass: number ){
        this.id = uuid();
        this.name = response.name || "";
        this.nrClass = nrClass;
    }
}

class Grade {
    public idStudent: string;
    public nameStd: string;
    public grade: number;

    constructor(idStudent:string, nameStd:string, grade:number){
        this.idStudent=uuid();
        this.nameStd=nameStd;
        this.grade=grade;
    }
}

const studentArray:Array<Student> = [];

async function addStudent (student:Student):Promise<void>{
    studentArray.push(student);
    await fs.writeFileSync("students.json", JSON.stringify(studentArray));
    
}

function insertStudent(): void {
    inquirer.prompt([
        {
            type:"input",
            name:"student_Name",
            message:"Student name:",
            validate:(answer)=>{
                if(answer.length === 0)
                    return "Please enter the name!"
                return true;
            }  
        },
        {
            type:"input",
            name:"class_number",
            message:"Class number:",
            validate:(answer)=>{
                if (answer<=0 || answer>=12){
                    return "Please enter the class number!"
                }
                return true;
            }
        }
    ])
    .then (answers =>{
        const newStudent:Student = new Student(answers["student_Name"],answers["class_number"]);
        addStudent(newStudent);
        return main();
    })
}


function checkExistStudent(name:string):Student | undefined {
    for (const studentRecord of studentArray){
        if(studentRecord.name === name){
            return studentRecord;
        }
    }
    return undefined;
}

async function upgrade(){
    try{
        await fs.writeFileSync("grades.json",JSON.stringify(gradeArray));
        await fs.writeFileSync("students.json", JSON.stringify(studentArray));
    } catch{
        console.log("Something wrong!");
    }
}

const gradeArray:Array<Grade> = [];
function gradeStudent():void{
    inquirer.prompt([
        {
            type:"input",
            name:"std_Name",
            message:"Student name:",
            validate:(answer)=>{
                if(answer.length === 0)
                    return "Please enter the name!"
                return true;
            }  
        },
        {
            type:"input",
            name:"grade_nr",
            message:"Grade number:",
            validate:(answer)=>{
                if(answer<=1 || answer>=10){
                    return "Grade is not valid!"
                }
                return true;
            }  
        }
    ])
    .then(answers=>{
        const searchStudent:Student = checkExistStudent(answers["std_Name"]) as Student ;
        if (searchStudent === undefined){
            console.log("Student doesn't exist!");
        } else{
            const newGrade:Grade = new Grade(searchStudent.id, answers["std_Name"], answers["grade_nr"]);
            gradeArray.push(newGrade);
            upgrade();
            return main();
        }
    })
}

function seeStudent ():void{
    inquirer.prompt([
        {
            type:"input",
            name:"std_name",
            message:"Enter student name:",
            validate:(answer)=>{
                if(answer.length === 0)
                    return "Please enter the name!"
                return true;
            }
        }
    ])
    .then(answers=>{
        const nameStd:string = answers["std_name"];
        if (checkExistStudent(nameStd) === undefined){
            console.log("Student doesn't exist!");
            return seeStudent();
        } else{
            return main();
        }
    })
}

function main():void{
    inquirer.prompt([
        {
            type:"list",
            name:"welcome",
            message:"Choose an option:",
            choices:[ "Insert a new student.","Student's grade.","See a student.","Exit!"]
        }
    ]) .then(answer=>{
        if(answer["welcome"] === "Insert a new student."){
            insertStudent();
        }
        else if(answer["welcome"] === "Student's grade."){
            gradeStudent();
        }
        else if (answer["welcome"]==="See a student."){
            seeStudent();
        }
        else if(answer["welcome"] === "Exist!"){
            return ;
        }
    })
}

main();