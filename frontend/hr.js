/* ==========================================
   API Configuration
========================================== */

const API_BASE = window.location.origin;


/* ==========================================
   DOM Elements
========================================== */

const searchBtn = document.getElementById("searchEmployee");

const updateBtn = document.getElementById("updateEmployee");

const deleteBtn = document.getElementById("deleteEmployee");

const addBtn = document.getElementById("addEmployee");

const refreshBtn = document.getElementById("refreshEmployees");

const toast = document.getElementById("toast");

const employeeTable = document.getElementById("employeeTable");

const employeeCount = document.getElementById("employeeCount");


/* ==========================================
   Toast
========================================== */

function showToast(message, success = true) {

    toast.innerText = message;

    toast.style.background = success ? "#16a34a" : "#dc2626";

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* ==========================================
   Loading
========================================== */

function setLoading(button, loading) {

    if (loading) {

        button.disabled = true;

        button.dataset.text = button.innerText;

        button.innerText = "Please Wait...";

    } else {

        button.disabled = false;

        button.innerText = button.dataset.text;

    }

}


/* ==========================================
   Search Employee
========================================== */

async function searchEmployee() {

    const id = document.getElementById("searchId").value.trim();

    if (!id) {

        showToast("Enter Employee ID", false);

        return;

    }

    try {

        setLoading(searchBtn, true);

        const response = await fetch(`${API_BASE}/employee?id=${id}`);

        if (!response.ok) {

            throw new Error();

        }

        const employee = await response.json();

        document.getElementById("employeeId").value = employee.id;

        document.getElementById("employeeName").value = employee.name;

        document.getElementById("employeeRole").value = employee.role;

        document.getElementById("employeeSalary").value = employee.salary;

        showToast("Employee Loaded");

    }

    catch {

        showToast("Employee Not Found", false);

    }

    finally {

        setLoading(searchBtn, false);

    }

}


/* ==========================================
   Update Employee
========================================== */

async function updateEmployee() {

    const id = document.getElementById("employeeId").value;

    if (!id) {

        showToast("Search Employee First", false);

        return;

    }

    const body = {

        name: document.getElementById("employeeName").value,

        role: document.getElementById("employeeRole").value,

        salary: document.getElementById("employeeSalary").value

    };

    try {

        setLoading(updateBtn, true);

        const response = await fetch(

            `${API_BASE}/employee/${id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(body)

            }

        );

        if (!response.ok) {

            throw new Error();

        }

        showToast("Employee Updated Successfully");

        searchEmployee();

    }

    catch {

        showToast("Update Failed", false);

    }

    finally {

        setLoading(updateBtn, false);

    }

}


/* ==========================================
   Events
========================================== */

searchBtn.addEventListener(

    "click",

    searchEmployee

);

updateBtn.addEventListener(

    "click",

    updateEmployee

);

/* ==========================================
   Load All Employees
========================================== */

async function loadEmployees() {

    try {

        refreshBtn.disabled = true;

        refreshBtn.innerText = "Loading...";

        employeeTable.innerHTML = `
            <tr>
                <td colspan="4">
                    Loading Employees...
                </td>
            </tr>
        `;

        const response = await fetch(
            `${API_BASE}/employees`
        );

        if (!response.ok) {

            throw new Error();

        }

        const data = await response.json();

        employeeCount.innerText = data.count;

        renderEmployeeTable(
            data.employees
        );

    }

    catch {

        employeeTable.innerHTML = `
            <tr>
                <td colspan="4">
                    Failed to load employees.
                </td>
            </tr>
        `;

        employeeCount.innerText = "--";

        showToast(
            "Unable to load employees",
            false
        );

    }

    finally {

        refreshBtn.disabled = false;

        refreshBtn.innerText = "Refresh";

    }

}


/* ==========================================
   Render Employee Table
========================================== */

function renderEmployeeTable(employees) {

    employeeTable.innerHTML = "";

    if (employees.length === 0) {

        employeeTable.innerHTML = `
            <tr>
                <td colspan="4">
                    No Employees Found
                </td>
            </tr>
        `;

        return;

    }

    employees.forEach(employee => {

        employeeTable.innerHTML += `

            <tr class="fade">

                <td>

                    ${employee.id}

                </td>

                <td>

                    ${employee.name}

                </td>

                <td>

                    ${employee.role}

                </td>

                <td>

                    ${employee.salary}

                </td>

            </tr>

        `;

    });

}


/* ==========================================
   Refresh Button
========================================== */

refreshBtn.addEventListener(

    "click",

    loadEmployees

);


/* ==========================================
   Page Load
========================================== */

window.addEventListener(

    "load",

    () => {

        loadEmployees();

    }

);

/* ==========================================
   Add Employee
========================================== */

async function addEmployee() {

    const body = {

        id: Number(document.getElementById("newId").value),

        name: document.getElementById("newName").value.trim(),

        role: document.getElementById("newRole").value.trim(),

        salary: document.getElementById("newSalary").value.trim()

    };

    if (

        !body.id ||

        !body.name ||

        !body.role ||

        !body.salary

    ) {

        showToast(

            "Please fill all fields",

            false

        );

        return;

    }

    try {

        setLoading(addBtn, true);

        const response = await fetch(

            `${API_BASE}/employee`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(body)

            }

        );

        if (!response.ok) {

            throw new Error();

        }

        showToast(

            "Employee Added Successfully"

        );

        document.getElementById("newId").value = "";

        document.getElementById("newName").value = "";

        document.getElementById("newRole").value = "";

        document.getElementById("newSalary").value = "";

        loadEmployees();

    }

    catch {

        showToast(

            "Unable to Add Employee",

            false

        );

    }

    finally {

        setLoading(addBtn, false);

    }

}


/* ==========================================
   Delete Employee
========================================== */

async function deleteEmployee() {

    const id = document.getElementById("employeeId").value;

    if (!id) {

        showToast(

            "Search Employee First",

            false

        );

        return;

    }

    const confirmDelete = confirm(

        `Delete Employee ${id}?`

    );

    if (!confirmDelete) {

        return;

    }

    try {

        setLoading(deleteBtn, true);

        const response = await fetch(

            `${API_BASE}/employee/${id}`,

            {

                method: "DELETE"

            }

        );

        if (!response.ok) {

            throw new Error();

        }

        showToast(

            "Employee Deleted"

        );

        document.getElementById("employeeId").value = "";

        document.getElementById("employeeName").value = "";

        document.getElementById("employeeRole").value = "";

        document.getElementById("employeeSalary").value = "";

        loadEmployees();

    }

    catch {

        showToast(

            "Delete Failed",

            false

        );

    }

    finally {

        setLoading(deleteBtn, false);

    }

}


/* ==========================================
   Event Listeners
========================================== */

addBtn.addEventListener(

    "click",

    addEmployee

);

deleteBtn.addEventListener(

    "click",

    deleteEmployee

);


/* ==========================================
   Auto Refresh
========================================== */

setInterval(

    () => {

        loadEmployees();

    },

    30000

);
