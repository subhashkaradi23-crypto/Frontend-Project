const addStudentBtn = document.getElementById("addStudentBtn");
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
let attendanceChart = null;
const logoutBtn =  document.getElementById("logoutBtn");
const dashboardMenu =
document.getElementById("dashboardMenu");

const studentsMenu =
document.getElementById("studentsMenu");

const analyticsMenu =
document.getElementById("analyticsMenu");

const dashboardSection =
document.getElementById("dashboardSection");

const studentsSection =
document.getElementById("studentsSection");

const analyticsSection =
document.getElementById("analyticsSection");

console.log("JS Loaded");
const downloadReportBtn =
document.getElementById("downloadReportBtn");


function showSection(section) {

    dashboardSection.style.display = "none";
    studentsSection.style.display = "none";
    analyticsSection.style.display = "none";

    section.style.display = "block";

    document
        .querySelectorAll(".menu-item")
        .forEach(item =>
            item.classList.remove("active")
        );
}


dashboardMenu.addEventListener("click", () => {

    showSection(dashboardSection);

    dashboardMenu.classList.add("active");
});


studentsMenu.addEventListener("click", () => {

    showSection(studentsSection);

    studentsMenu.classList.add("active");
});


analyticsMenu.addEventListener("click", () => {

    showSection(analyticsSection);

    analyticsMenu.classList.add("active");
});


showSection(dashboardSection);

dashboardMenu.classList.add("active");
if(
    localStorage.getItem(
        "isLoggedIn"
    ) !== "true"
){
    window.location.href =
    "login.html";
}
 
// Load students from Local Storage
let students =
    JSON.parse(localStorage.getItem("students")) || [];

// Save students to Local Storage
function saveStudents() {
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}

// Add Student
addStudentBtn.addEventListener("click", () => {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();

    if (
        name === "" ||
        email === "" ||
        course === "" ||
        rollNumber === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    const student = {
        id: Date.now(),
        name,
        email,
        course,
        rollNumber,
        attendance: "Absent"
    };

    students.push(student);

    saveStudents();

    renderStudents();

    // Clear Form
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("course").value = "";
    document.getElementById("rollNumber").value = "";
});
searchInput.addEventListener("input", () => {

    const searchValue =
        searchInput.value.toLowerCase();

    const filteredStudents =
        students.filter(student =>

            student.name
                .toLowerCase()
                .includes(searchValue)

            ||

            student.course
                .toLowerCase()
                .includes(searchValue)

            ||

            student.rollNumber
                .toLowerCase()
                .includes(searchValue)
        );

    renderStudents(filteredStudents);

});

// Render Students
function renderStudents(studentList = students) {

    studentTableBody.innerHTML = "";

    studentList.forEach((student, index) => {

        studentTableBody.innerHTML += `
        <tr>

            <td>${index + 1}</td>

            <td>${student.name}</td>

            <td>${student.course}</td>

            <td>${student.rollNumber}</td>

            <td>
                <span class="${
                    student.attendance === "Present"
                        ? "present-badge"
                        : "absent-badge"
                }">
                    ${student.attendance}
                </span>
            </td>

            <td>

                ${
                    student.attendance === "Absent"
                        ? `
                        <button
                            class="present-btn"
                            onclick="markPresent(${student.id})">
                            Present
                        </button>
                        `
                        : ""
                }

                <button
                    class="edit-btn"
                    onclick="editStudent(${student.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </td>

        </tr>
        `;
    });

    updateDashboard();
}

// Dashboard Update
function updateDashboard() {
 

    const totalStudents = students.length;

    const presentStudents = students.filter(
        student => student.attendance === "Present"
    ).length;

    const absentStudents = students.filter(
        student => student.attendance === "Absent"
    ).length;

    const attendancePercentage =
        totalStudents > 0
            ? Math.round(
                (presentStudents / totalStudents) * 100
            )
            : 0;

    document.getElementById("totalStudents").textContent =
        totalStudents;

    document.getElementById("presentStudents").textContent =
        presentStudents;

    document.getElementById("absentStudents").textContent =
        absentStudents;

    document.getElementById("attendancePercentage").textContent =
        attendancePercentage + "%";
        updateChart();
}


function updateChart() {
 

    const canvas = document.getElementById("attendanceChart");

    if (!canvas) return;

    const presentStudents = students.filter(
        student => student.attendance === "Present"
    ).length;

    const absentStudents = students.filter(
        student => student.attendance === "Absent"
    ).length;

    const ctx = canvas.getContext("2d");

    if (
        attendanceChart &&
        typeof attendanceChart.destroy === "function"
    ) {
        attendanceChart.destroy();
    }

    attendanceChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Present",
                "Absent"
            ],

            datasets: [{
                data: [
                    presentStudents,
                    absentStudents
                ],

                backgroundColor: [
                    "#22c55e",
                    "#ef4444"
                ],

                borderWidth: 2
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

// Delete Student
function deleteStudent(id) {

    students = students.filter(
        student => student.id !== id
    );

    saveStudents();

    renderStudents();
}

// Mark Present
function markPresent(id) {

    students = students.map(student => {

        if (student.id === id) {
            return {
                ...student,
                attendance: "Present"
            };
        }

        return student;
    });

    saveStudents();

    renderStudents();
}
function editStudent(id) {

    const student = students.find(
        student => student.id === id
    );

    const newName = prompt(
        "Enter Student Name",
        student.name
    );

    const newCourse = prompt(
        "Enter Course",
        student.course
    );

    const newRollNumber = prompt(
        "Enter Roll Number",
        student.rollNumber
    );

    if (
        newName &&
        newCourse &&
        newRollNumber
    ) {

        student.name = newName;
        student.course = newCourse;
        student.rollNumber = newRollNumber;

        saveStudents();

        renderStudents();
    }
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (
        document.body.classList.contains("dark-mode")
    ) {

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        localStorage.setItem(
            "theme",
            "light"
        );
    }
});

// Dark Mode

const savedTheme =
localStorage.getItem("theme");

if(savedTheme === "dark"){

    document.body.classList.add("dark-mode");

    themeToggle.textContent =
    "☀️ Light Mode";
}
if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "isLoggedIn"
            );

            window.location.href =
            "login.html";
        }
    );
}
function showSection(section) {

    dashboardSection.style.display = "none";
    studentsSection.style.display = "none";
    analyticsSection.style.display = "none";

    section.style.display = "block";
}

dashboardMenu.addEventListener("click", () => {

    showSection(dashboardSection);

});

studentsMenu.addEventListener("click", () => {

    showSection(studentsSection);

});

analyticsMenu.addEventListener("click", () => {

    showSection(analyticsSection);

});
function downloadCSV() {

    let csvContent =
        "Name,Course,Roll Number,Attendance\n";

    students.forEach(student => {

        csvContent +=
            `${student.name},${student.course},${student.rollNumber},${student.attendance}\n`;

    });

    const blob = new Blob(
        [csvContent],
        { type: "text/csv" }
    );

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "attendance_report.csv";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
}
if(downloadReportBtn){

    downloadReportBtn.addEventListener(
        "click",
        downloadCSV
    );

}
 
// Initial Render
renderStudents();
showSection(dashboardSection);