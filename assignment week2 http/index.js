const http = require("http");
const url = require("url");
const fs = require('fs');
const hostname = "127.0.0.1";
const port = 3001;


// Function to read data from a JSON file
function readDataFromFile(filename) {
  try {
    const data = fs.readFileSync(filename);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading data from ${filename}: ${error.message}`);
    return [];
  }
}

// Function to write data to a JSON file
function writeDataToFile(filename, data) {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`Data written to ${filename}`);
  } catch (error) {
    console.error(`Error writing data to ${filename}: ${error.message}`);
  }
}



const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;
  const method = req.method;

  // Handling routes
  if (path === "/students" && method === "GET") {
    // Handle GET request for fetching all students
    getAllStudents(req, res);
  } else if (path === "/students" && method === "POST") {
    // Handle POST request for adding a student
    addStudent(req, res);
  } else if (path.startsWith("/students/") && method === "GET") {
    // Handle GET request for fetching a specific student by ID
    getStudentById(req, res);
  } else if (path.startsWith("/students/") && method === "PUT") {
    // Handle PUT request for updating a student
    updateStudent(req, res);
  } else if (path.startsWith("/students/") && method === "DELETE") {
    // Handle DELETE request for deleting a student
    deleteStudent(req, res);
  }
  //   } else {
  //     // Route not found
  //     res.statusCode = 404;
  //     res.setHeader('Content-Type', 'text/plain');
  //     res.end('Not Found');
  //   }
  // Handling routes for courses
  else if (path === "/courses" && method === "GET") {
    getAllCourses(req, res);
  } else if (path === "/courses" && method === "POST") {
    addCourse(req, res);
  } else if (path.startsWith("/courses/") && method === "GET") {
    getCourseById(req, res);
  } else if (path.startsWith("/courses/") && method === "PUT") {
    updateCourse(req, res);
  } else if (path.startsWith("/courses/") && method === "DELETE") {
    deleteCourse(req, res);
  }
  // Handling routes for departments
  else if (path === "/departments" && method === "GET") {
    getAllDepartments(req, res);
  } else if (path === "/departments" && method === "POST") {
    addDepartment(req, res);
  } else if (path.startsWith("/departments/") && method === "GET") {
    getDepartmentById(req, res);
  } else if (path.startsWith("/departments/") && method === "PUT") {
    updateDepartment(req, res);
  } else if (path.startsWith("/departments/") && method === "DELETE") {
    deleteDepartment(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Dummy data for demonstration
 let students = [];

// Function to generate unique student ID
function generateStudentId() {
  return "S" + Math.random().toString(36).substr(2, 9);
}

// Function to add a student
function addStudent(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const jsonData = JSON.parse(body);
    const { name, email, password, departmentId } = jsonData;

    let students = readDataFromFile("students.json");

    // Check if email already exists
    const existingStudent = students.find((student) => student.email === email);
    if (existingStudent) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain");
      res.end("Email already exists");
      return;
    }

    const newStudent = {
      id: generateStudentId(),
      name,
      email,
      password,
      departmentId,
    };
    students.push(newStudent);

    writeDataToFile("students.json", students);

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(newStudent));
  });
}

// Function to get all students
function getAllStudents(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(students));
}

// Function to get a student by ID
function getStudentById(req, res) {
  const studentId = req.url.split("/")[2];
  const student = students.find((student) => student.id === studentId);

  if (student) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(student));
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Student not found");
  }
}

// Function to update a student
function updateStudent(req, res) {
  const studentId = req.url.split("/")[2];
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const jsonData = JSON.parse(body);
    const { name, email, password, departmentId } = jsonData;
    let students = readDataFromFile('students.json');
    const studentIndex = students.findIndex(
      (student) => student.id === studentId
    );
    if (studentIndex !== -1) {
      students[studentIndex] = {
        ...students[studentIndex],
        name: name || students[studentIndex].name,
        email: email || students[studentIndex].email,
        password: password || students[studentIndex].password,
        departmentId: departmentId || students[studentIndex].departmentId,
      };
      writeDataToFile('students.json', students);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(students[studentIndex]));
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("Student not found");
    }
  });
}

// Function to delete a student
function deleteStudent(req, res) {
  const studentId = req.url.split("/")[2];
  let students = readDataFromFile('students.json');
  const studentIndex = students.findIndex(
    (student) => student.id === studentId
  );

  if (studentIndex !== -1) {
   
    writeDataToFile('students.json', students); students.splice(studentIndex, 1);
    res.statusCode = 204;
    res.end();
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Student not found");
  }
}
// Dummy data for demonstration
//  let courses = [];

// Function to generate unique course ID
function generateCourseId() {
  return "C" + Math.random().toString(36).substr(2, 9);
}

// Add Course API
function addCourse(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const jsonData = JSON.parse(body);
    const { name, content, departmentId } = jsonData;
    let courses = readDataFromFile("courses.json");
    const newCourse = {
      id: generateCourseId(),
      name,
      content,
      departmentId,
    };
    courses.push(newCourse);
    writeDataToFile("courses.json", courses);
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(newCourse));
  });
}

// Delete Course API
function deleteCourse(req, res) {
  const courseId = req.url.split("/")[2];
  let courses = readDataFromFile("courses.json");

  const courseIndex = courses.findIndex((course) => course.id === courseId);

  if (courseIndex !== -1) {
    courses.splice(courseIndex, 1);
    writeDataToFile("courses.json", courses);
    res.statusCode = 204;
    res.end();
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Course not found");
  }
}

// Update Course API
function updateCourse(req, res) {
  const courseId = req.url.split("/")[2];
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const jsonData = JSON.parse(body);
    const { name, content, departmentId } = jsonData;
    let courses = readDataFromFile('courses.json');

    const courseIndex = courses.findIndex((course) => course.id === courseId);
    if (courseIndex !== -1) {
      courses[courseIndex] = {
        ...courses[courseIndex],
        name: name || courses[courseIndex].name,
        content: content || courses[courseIndex].content,
        departmentId: departmentId || courses[courseIndex].departmentId,
      };
      writeDataToFile('courses.json', courses);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(courses[courseIndex]));
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("Course not found");
    }
  });
}

// Get All Courses API
function getAllCourses(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(courses));
}

// Get Specific Course by ID API
function getCourseById(req, res) {
  const courseId = req.url.split("/")[2];
  const course = courses.find((course) => course.id === courseId);

  if (course) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(course));
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Course not found");
  }
}
// Dummy data for demonstration
// let departments = [];

// Function to generate unique department ID
function generateDepartmentId() {
  return "D" + Math.random().toString(36).substr(2, 9);
}

// Add Department API
function addDepartment(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const jsonData = JSON.parse(body);
    const { name } = jsonData;
    let departments = readDataFromFile('departments.json');
    const newDepartment = {
      id: generateDepartmentId(),
      name,
    };
    departments.push(newDepartment);
    writeDataToFile('departments.json', departments);
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(newDepartment));
  });
}

// Update Department API
function updateDepartment(req, res) {
  const departmentId = req.url.split("/")[2];
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const jsonData = JSON.parse(body);
    const { name } = jsonData;
    let departments = readDataFromFile('departments.json');
    const departmentIndex = departments.findIndex(
      (department) => department.id === departmentId
    );
    if (departmentIndex !== -1) {
      departments[departmentIndex] = {
        ...departments[departmentIndex],
        name: name || departments[departmentIndex].name,
      };
      writeDataToFile('departments.json', departments);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(departments[departmentIndex]));
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("Department not found");
    }
  });
}

// Delete Department API
function deleteDepartment(req, res) {
  const departmentId = req.url.split("/")[2];
  let departments = readDataFromFile('departments.json');
  const departmentIndex = departments.findIndex(
    (department) => department.id === departmentId
  );

  if (departmentIndex !== -1) {
    departments.splice(departmentIndex, 1);
    writeDataToFile('departments.json', departments);
    res.statusCode = 204;
    res.end();
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Department not found");
  }
}

// Get All Departments API
function getAllDepartments(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(departments));
}

// Get Specific Department by ID API
function getDepartmentById(req, res) {
  const departmentId = req.url.split("/")[2];
  const department = departments.find(
    (department) => department.id === departmentId
  );

  if (department) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(department));
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Department not found");
  }
}
