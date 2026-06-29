/* =====================================================
   Configuration
===================================================== */

const API_BASE =
    "https://djrsvxg7njjaz.cloudfront.net";

/* =====================================================
   Elements
===================================================== */

const searchInput =
    document.getElementById("searchEmployeeId");

const searchBtn =
    document.getElementById("searchEmployeeBtn");

const clearSearchBtn =
    document.getElementById("clearSearchBtn");

const employeeId =
    document.getElementById("employeeId");

const employeeName =
    document.getElementById("employeeName");

const employeeRole =
    document.getElementById("employeeRole");

const employeeSalary =
    document.getElementById("employeeSalary");

const addBtn =
    document.getElementById("addEmployeeBtn");

const updateBtn =
    document.getElementById("updateEmployeeBtn");

const deleteBtn =
    document.getElementById("deleteEmployeeBtn");

const resetBtn =
    document.getElementById("resetFormBtn");

const refreshBtn =
    document.getElementById("refreshEmployeesBtn");

const employeeTableBody =
    document.getElementById("employeeTableBody");

const employeeCount =
    document.getElementById("employeeTableCount");

const totalEmployees =
    document.getElementById("totalEmployees");

const backendStatus =
    document.getElementById("backendStatus");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const loadingOverlay =
    document.getElementById("loadingOverlay");

/* =====================================================
   Toast
===================================================== */

function showToast(

    message,

    type = "success"

){

    toast.className = "toast";

    toast.classList.add(type);

    toast.classList.add("show");

    toastMessage.innerText = message;

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

/* =====================================================
   Loading
===================================================== */

function showLoading(){

    loadingOverlay.classList.remove("hidden");

}

function hideLoading(){

    loadingOverlay.classList.add("hidden");

}

/* =====================================================
   Reset Form
===================================================== */

function clearForm(){

    employeeId.value="";

    employeeName.value="";

    employeeRole.value="";

    employeeSalary.value="";

}

/* =====================================================
   Render Employee Table
===================================================== */

function renderEmployees(employees){

    employeeTableBody.innerHTML="";

    employeeCount.innerText =
        `${employees.length} Employees`;

    totalEmployees.innerText =
        employees.length;

    if(employees.length===0){

        employeeTableBody.innerHTML=`

        <tr>

            <td colspan="4">

                No Employees Found

            </td>

        </tr>

        `;

        return;

    }

    employees.forEach(employee=>{

        employeeTableBody.innerHTML+=`

        <tr>

            <td>${employee.id}</td>

            <td>${employee.name}</td>

            <td>${employee.role}</td>

            <td>${employee.salary}</td>

        </tr>

        `;

    });

}

/* =====================================================
   Load All Employees
===================================================== */

async function loadEmployees(){

    try{

        showLoading();

        const response =
        await fetch(

            API_BASE+"/employees"

        );

        if(!response.ok){

            throw new Error();

        }

        const data =
        await response.json();

        renderEmployees(

            data.employees

        );

    }

    catch(error){

        showToast(

            "Unable to load employees",

            "error"

        );

    }

    finally{

        hideLoading();

    }

}

/* =====================================================
   Backend Health
===================================================== */

async function checkBackend(){

    try{

        const response =
        await fetch(

            API_BASE+"/health"

        );

        if(!response.ok){

            throw new Error();

        }

        backendStatus.innerHTML=

        "🟢 Backend Healthy";

    }

    catch{

        backendStatus.innerHTML=

        "🔴 Backend Offline";

    }

}

/* =====================================================
   Search Employee
===================================================== */

async function searchEmployee(){

    const id = searchInput.value.trim();

    if(!id){

        showToast(

            "Please enter Employee ID",

            "info"

        );

        searchInput.focus();

        return;

    }

    try{

        showLoading();

        const response = await fetch(

            `${API_BASE}/employee?id=${id}`

        );

        if(!response.ok){

            throw new Error();

        }

        const employee = await response.json();

        employeeId.value = employee.id;

        employeeName.value = employee.name;

        employeeRole.value = employee.role;

        employeeSalary.value = employee.salary;

        showToast(

            "Employee Found",

            "success"

        );

    }

    catch(error){

        clearForm();

        showToast(

            "Employee Not Found",

            "error"

        );

    }

    finally{

        hideLoading();

    }

}

/* =====================================================
   Search Button
===================================================== */

searchBtn.addEventListener(

    "click",

    searchEmployee

);

/* =====================================================
   Enter Key Search
===================================================== */

searchInput.addEventListener(

    "keydown",

    function(event){

        if(event.key==="Enter"){

            searchEmployee();

        }

    }

);

/* =====================================================
   Clear Search Button
===================================================== */

searchInput.addEventListener(

    "input",

    ()=>{

        clearSearchBtn.style.display =

        searchInput.value.trim()

        ? "block"

        : "none";

    }

);

clearSearchBtn.addEventListener(

    "click",

    ()=>{

        searchInput.value="";

        clearSearchBtn.style.display="none";

        clearForm();

        searchInput.focus();

    }

);

/* =====================================================
   Fill Search Box From Form
===================================================== */

employeeId.addEventListener(

    "input",

    ()=>{

        searchInput.value =

        employeeId.value;

    }

);

/* =====================================================
   Initial Load
===================================================== */

window.addEventListener(

    "load",

    ()=>{

        loadEmployees();

        checkBackend();

        searchInput.focus();

    }

);

/* =====================================================
   Add Employee
===================================================== */

addBtn.addEventListener(

    "click",

    async ()=>{

        if(

            !employeeId.value ||

            !employeeName.value ||

            !employeeRole.value ||

            !employeeSalary.value

        ){

            showToast(

                "Please fill all fields",

                "info"

            );

            return;

        }

        try{

            showLoading();

            const response = await fetch(

                `${API_BASE}/employee`,

                {

                    method:"POST",

                    headers:{

                        "Content-Type":"application/json"

                    },

                    body:JSON.stringify({

                        id:Number(employeeId.value),

                        name:employeeName.value,

                        role:employeeRole.value,

                        salary:employeeSalary.value

                    })

                }

            );

            if(!response.ok){

                throw new Error();

            }

            showToast(

                "Employee Added Successfully",

                "success"

            );

            clearForm();

            searchInput.value="";

            clearSearchBtn.style.display="none";

            loadEmployees();

        }

        catch(error){

            showToast(

                "Unable to Add Employee",

                "error"

            );

        }

        finally{

            hideLoading();

        }

    }

);

/* =====================================================
   Update Employee
===================================================== */

updateBtn.addEventListener(

    "click",

    async ()=>{

        if(

            !employeeId.value

        ){

            showToast(

                "Search Employee First",

                "info"

            );

            return;

        }

        try{

            showLoading();

            const response = await fetch(

                `${API_BASE}/employee/${employeeId.value}`,

                {

                    method:"PUT",

                    headers:{

                        "Content-Type":"application/json"

                    },

                    body:JSON.stringify({

                        name:employeeName.value,

                        role:employeeRole.value,

                        salary:employeeSalary.value

                    })

                }

            );

            if(!response.ok){

                throw new Error();

            }

            showToast(

                "Employee Updated Successfully",

                "success"

            );

            loadEmployees();

        }

        catch(error){

            showToast(

                "Unable to Update Employee",

                "error"

            );

        }

        finally{

            hideLoading();

        }

    }

);

/* =====================================================
   Delete Employee
===================================================== */

deleteBtn.addEventListener(

    "click",

    async ()=>{

        if(!employeeId.value){

            showToast(

                "Select an Employee First",

                "info"

            );

            return;

        }

        const confirmed = confirm(

            `Delete Employee ${employeeName.value}?`

        );

        if(!confirmed){

            return;

        }

        try{

            showLoading();

            const response = await fetch(

                `${API_BASE}/employee/${employeeId.value}`,

                {

                    method:"DELETE"

                }

            );

            if(!response.ok){

                throw new Error();

            }

            showToast(

                "Employee Deleted Successfully",

                "success"

            );

            clearForm();

            searchInput.value="";

            clearSearchBtn.style.display="none";

            loadEmployees();

        }

        catch(error){

            showToast(

                "Unable to Delete Employee",

                "error"

            );

        }

        finally{

            hideLoading();

        }

    }

);

/* =====================================================
   Reset Form
===================================================== */

resetBtn.addEventListener(

    "click",

    ()=>{

        clearForm();

        searchInput.value="";

        clearSearchBtn.style.display="none";

        searchInput.focus();

        showToast(

            "Form Reset",

            "info"

        );

    }

);

/* =====================================================
   Refresh Employee List
===================================================== */

refreshBtn.addEventListener(

    "click",

    ()=>{

        loadEmployees();

        checkBackend();

        showToast(

            "Employee List Refreshed",

            "success"

        );

    }

);

/* =====================================================
   Table Row Click
===================================================== */

employeeTableBody.addEventListener(

    "click",

    function(event){

        const row = event.target.closest("tr");

        if(!row){

            return;

        }

        const cells = row.querySelectorAll("td");

        if(cells.length < 4){

            return;

        }

        employeeId.value =

            cells[0].innerText;

        employeeName.value =

            cells[1].innerText;

        employeeRole.value =

            cells[2].innerText;

        employeeSalary.value =

            cells[3].innerText;

        searchInput.value =

            cells[0].innerText;

    }

);
/* =====================================================
   Live Backend Status Refresh
===================================================== */

setInterval(

    checkBackend,

    30000

);

/* =====================================================
   Auto Refresh Employee List
===================================================== */

setInterval(

    loadEmployees,

    60000

);

/* =====================================================
   Better Fetch Error Handler
===================================================== */

async function handleResponse(response){

    if(response.ok){

        return response.json();

    }

    let message="Something went wrong";

    try{

        const data=

        await response.json();

        if(data.message){

            message=data.message;

        }

    }

    catch{}

    throw new Error(message);

}

/* =====================================================
   Keyboard Shortcuts
===================================================== */

document.addEventListener(

    "keydown",

    function(event){

        // Ctrl + F

        if(

            event.ctrlKey &&

            event.key==="f"

        ){

            event.preventDefault();

            searchInput.focus();

        }

        // Escape

        if(

            event.key==="Escape"

        ){

            clearForm();

            searchInput.value="";

            clearSearchBtn.style.display="none";

        }

    }

);

/* =====================================================
   Auto Focus
===================================================== */

searchInput.focus();

/* =====================================================
   Dashboard Initialization
===================================================== */

async function initializeDashboard(){

    showLoading();

    await Promise.all([

        loadEmployees(),

        checkBackend()

    ]);

    hideLoading();

}

initializeDashboard();