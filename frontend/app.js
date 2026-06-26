const button = document.getElementById("searchBtn");
const result = document.getElementById("result");

button.addEventListener("click", async () => {

    const employeeId = document.getElementById("employeeId").value;

    if (!employeeId) {
        result.innerHTML = "<p>Please enter Employee ID</p>";
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:5000/employee?id=${employeeId}`
        );

        if (!response.ok) {
            throw new Error("Employee Not Found");
        }

        const employee = await response.json();

        result.innerHTML = `
            <h3>${employee.name}</h3>
            <p><strong>ID:</strong> ${employee.id}</p>
            <p><strong>Role:</strong> ${employee.role}</p>
            <p><strong>Salary:</strong> ${employee.salary}</p>
        `;

    } catch (error) {

        result.innerHTML = `
            <p style="color:red;">
                ${error.message}
            </p>
        `;

    }

});