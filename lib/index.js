"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const uuid_1 = require("uuid");
class MyCatalog {
    constructor(response, nrClass) {
        this.id = (0, uuid_1.v4)();
        this.name = response.name || "";
        this.nrClass = nrClass;
    }
}
class Grade {
    constructor(idStudent, nameStd, grade) {
        this.idStudent = (0, uuid_1.v4)();
        this.nameStd = nameStd;
        this.grade = grade;
    }
}
const studentArray = [];
function addStudent(student) {
    return __awaiter(this, void 0, void 0, function* () {
        studentArray.push(student);
        yield fs_1.default.writeFileSync("students.json", JSON.stringify(studentArray));
    });
}
function insertStudent() {
    inquirer_1.default.prompt([
        {
            type: "input",
            name: "student_Name",
            message: "Student name:",
            validate: (answer) => {
                if (answer.length === 0)
                    return "Please enter the name!";
                return true;
            }
        },
        {
            type: "input",
            name: "class_number",
            message: "Class number:",
            validate: (answer) => {
                if (answer <= 0 || answer >= 12) {
                    return "Please enter the class number!";
                }
                return true;
            }
        }
    ])
        .then(answers => {
        const newStudent = new MyCatalog(answers["student_Name"], answers["class_number"]);
        addStudent(newStudent);
        return main();
    });
}
function checkExistStudent(name) {
    for (const studentRecord of studentArray) {
        if (studentRecord.name === name) {
            return studentRecord;
        }
    }
    return undefined;
}
function upgrade() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.default.writeFileSync("grades.json", JSON.stringify(gradeArray));
            yield fs_1.default.writeFileSync("students.json", JSON.stringify(studentArray));
        }
        catch (_a) {
            console.log("Something wrong!");
        }
    });
}
const gradeArray = [];
function gradeStudent() {
    inquirer_1.default.prompt([
        {
            type: "input",
            name: "std_Name",
            message: "Student name:",
            validate: (answer) => {
                if (answer.length === 0)
                    return "Please enter the name!";
                return true;
            }
        },
        {
            type: "input",
            name: "grade_nr",
            message: "Grade number:",
            validate: (answer) => {
                if (answer <= 1 || answer >= 10) {
                    return "Grade is not valid!";
                }
                return true;
            }
        }
    ])
        .then(answers => {
        const searchStudent = checkExistStudent(answers["std_Name"]);
        if (searchStudent === undefined) {
            console.log("Student doesn't exist!");
        }
        else {
            const newGrade = new Grade(searchStudent.id, answers["std_Name"], answers["grade_nr"]);
            gradeArray.push(newGrade);
            upgrade();
            return main();
        }
    });
}
function seeStudent() {
    inquirer_1.default.prompt([
        {
            type: "input",
            name: "std_name",
            message: "Enter student name:",
            validate: (answer) => {
                if (answer.length === 0)
                    return "Please enter the name!";
                return true;
            }
        }
    ])
        .then(answers => {
        const nameStd = answers["std_name"];
        if (checkExistStudent(nameStd) === undefined) {
            console.log("Student doesn't exist!");
            return seeStudent();
        }
        else {
            return main();
        }
    });
}
function main() {
    inquirer_1.default.prompt([
        {
            type: "list",
            name: "welcome",
            message: "Choose an option:",
            choices: ["Insert a new student.", "Student's grade.", "See a student.", "Exit!"]
        }
    ]).then(answer => {
        if (answer["welcome"] === "Insert a new student.") {
            insertStudent();
        }
        else if (answer["welcome"] === "Student's grade.") {
            gradeStudent();
        }
        else if (answer["welcome"] === "See a student.") {
            seeStudent();
        }
        else if (answer["welcome"] === "Exist!") {
            return;
        }
    });
}
main();
