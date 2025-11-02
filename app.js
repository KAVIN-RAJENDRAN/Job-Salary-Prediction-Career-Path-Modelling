const API = "http://localhost:5000";

document.getElementById("predictForm").onsubmit = async (e) => {
  e.preventDefault();
  const payload = {
    job_title: document.getElementById("job_title").value,
    experience_level: document.getElementById("experience_level").value,
    employment_type: document.getElementById("employment_type").value,
    company_size: document.getElementById("company_size").value,
    company_location: document.getElementById("company_location").value,
    employee_residence: document.getElementById("employee_residence").value,
    remote_ratio: Number(document.getElementById("remote_ratio").value || 0),
  };
  const resDiv = document.getElementById("predictResult");
  resDiv.textContent = "Predicting...";
  try {
    const res = await fetch(`${API}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      resDiv.innerHTML = `Predicted Salary (USD): <span style="color:green">$${data.predicted_salary_usd}</span><br>Category: <strong>${data.salary_category}</strong>`;
      // auto-fill career form starting salary
      document.getElementById("current_salary").value =
        data.predicted_salary_usd;
    } else {
      resDiv.textContent = "Error: " + (data.error || JSON.stringify(data));
    }
  } catch (err) {
    resDiv.textContent = "Network error: " + err;
  }
};

document.getElementById("careerForm").onsubmit = async (e) => {
  e.preventDefault();
  const payload = {
    current_salary: Number(
      document.getElementById("current_salary").value || 100000
    ),
    years: Number(document.getElementById("years").value || 5),
    annual_growth: Number(
      document.getElementById("annual_growth").value || 0.12
    ),
  };
  const resDiv = document.getElementById("careerResult");
  resDiv.textContent = "Simulating...";
  try {
    const res = await fetch(`${API}/career-path`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.sequence) {
      let html =
        "<table><tr><th>Year</th><th>Level</th><th>Salary (USD)</th></tr>";
      data.sequence.forEach((r) => {
        html += `<tr><td>${r.year}</td><td>${r.level}</td><td>$${r.salary}</td></tr>`;
      });
      html += "</table>";
      resDiv.innerHTML = html;
    } else {
      resDiv.textContent = "Error: " + JSON.stringify(data);
    }
  } catch (err) {
    resDiv.textContent = "Network error: " + err;
  }
};
