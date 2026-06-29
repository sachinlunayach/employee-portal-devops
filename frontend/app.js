const employeeInput = document.getElementById("employeeId");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const result = document.getElementById("result");

const API_URL =
    "https://djrsvxg7njjaz.cloudfront.net/employee?id=";
const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

function showToast(

    message,

    type="success"

){

    toast.className="toast";

    toast.classList.add(type);

    toast.classList.add("show");

    toastMessage.innerText=message;

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

employeeInput.focus();

/* ===========================
   Show / Hide Clear Button
=========================== */

employeeInput.addEventListener("input", () => {

    clearBtn.style.display =
        employeeInput.value.trim() !== ""
            ? "block"
            : "none";

});

/* ===========================
   Clear Search
=========================== */

clearBtn.addEventListener("click", () => {

    employeeInput.value = "";

    clearBtn.style.display = "none";

    result.innerHTML = `

        <h3>Employee Details</h3>

        <p>

            Search an employee to view complete details.

        </p>

    `;

    employeeInput.focus();

});

/* ===========================
   Enter Key Search
=========================== */

employeeInput.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        searchEmployee();

    }

});

/* ===========================
   Search Button
=========================== */

searchBtn.addEventListener(

    "click",

    searchEmployee

);

/* ===========================
   Search Employee
=========================== */

async function searchEmployee() {

    const employeeId =
        employeeInput.value.trim();

    if (!employeeId) {

        result.innerHTML = `

           <div class="empty-state">

    <h2>

        🔍

    </h2>

    <h3>

        Employee ID Required

    </h3>

    <p>

        Enter an Employee ID to search.

    </p>

</div>

        `;
	    showToast(

        "Please enter Employee ID",

        "info"

    );

        employeeInput.focus();

        return;

    }

    try {

        searchBtn.disabled = true;

        searchBtn.innerText = "Searching...";

        result.innerHTML = `

            <div class="empty-state">

    <div class="spinner"></div>

    <h3>

        Searching...

    </h3>

</div>

        `;

        const response =
            await fetch(API_URL + employeeId);

        if (!response.ok) {

            throw new Error(
                "Employee Not Found"
            );

        }

        const employee =
            await response.json();

        result.innerHTML = `

            <h3>

                👤 ${employee.name}

            </h3>

            <div class="employee-info fade">

                <div class="info-row">

                    <span class="info-title">

                        Employee ID

                    </span>

                    <div style="display:flex;align-items:center;gap:10px;">

    <span class="info-value">

        ${employee.id}

    </span>

    <button

        class="copy-btn"

        onclick="copyEmployeeId('${employee.id}')">

        📋

    </button>

</div>

                </div>

                <div class="info-row">

                    <span class="info-title">

                        Role

                    </span>

                    <span class="info-value">

                        ${employee.role}

                    </span>

                </div>

                <div class="info-row">

                    <span class="info-title">

                        Salary

                    </span>

                    <span class="info-value">

                        ${employee.salary}

                    </span>

                </div>

                <div class="info-row">

                    <span class="info-title">

                        Status

                    </span>

                    <span class="status online">

                        Employee Found

                    </span>

                </div>

            </div>

        `;

	showToast(

    "Employee Found",

    "success"

);

    }

    catch (error) {

        result.innerHTML = `

            <div class="empty-state">

    <h2>

        ❌

    </h2>

    <h3>

        Employee Not Found

    </h3>

    <p>

        No employee found with ID

        <strong>${employeeId}</strong>

    </p>

</div>



        `;
	    
	     showToast(

        "Employee Not Found",

        "error"

    );

    }

    finally {

        searchBtn.disabled = false;

        searchBtn.innerText =
            "Search Employee";

    }

}

/* ===========================
   Load Employee Count
=========================== */

async function loadEmployeeCount(){

    try{

        const response = await fetch(

            "https://djrsvxg7njjaz.cloudfront.net/employees"

        );

        if(!response.ok) return;

        const data = await response.json();

        document.getElementById(

            "employeeCount"

        ).innerText = data.count;

    }

    catch(error){

        console.log(error);

    }

}

loadEmployeeCount();

function copyEmployeeId(id){

    navigator.clipboard.writeText(id);

    showToast(

        "Employee ID Copied",

        "success"

    );

}
