const countrySelect = document.getElementById("countries");
const typeSelect = document.getElementById("type_filter");
const subjectInput = document.getElementById("subject_filter");
const tuitionSelect = document.getElementById("tuition_filter");

countrySelect.addEventListener("change", fetchUniversities);
typeSelect.addEventListener("change", fetchUniversities);
subjectInput.addEventListener("input", fetchUniversities);
tuitionSelect.addEventListener("change", fetchUniversities);

async function fetchUniversities() {
  const selectedCountries = Array.from(countrySelect.selectedOptions).map(opt => opt.value);
  const type = typeSelect.value;
  const subject = subjectInput.value.trim().toLowerCase();
  const tuition = tuitionSelect.value;

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  let allResults = [];

  for (const country of selectedCountries) {
    const url = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      allResults = allResults.concat(data.map(uni => ({ ...uni, country })));
    } catch (error) {
      console.error(`Error fetching data for ${country}:`, error);
    }
  }

  const publicKeywords = ["University of", "State", "National", "Technische", "Public"];
  const privateKeywords = ["Business School", "College", "Academy", "Private", "Institut"];

  const filtered = allResults.filter(uni => {
    const name = uni.name.toLowerCase();

    // Type filter
    if (type === "public" && !publicKeywords.some(k => name.includes(k.toLowerCase()))) return false;
    if (type === "private" && !privateKeywords.some(k => name.includes(k.toLowerCase()))) return false;

    // Subject keyword filter
    if (subject && !name.includes(subject)) return false;

    // Tuition filter (simulated)
    if (tuition !== "any") {
      const tuitionScore = name.length % 3; // Simulated value
      if (
        (tuition === "low" && tuitionScore !== 0) ||
        (tuition === "medium" && tuitionScore !== 1) ||
        (tuition === "high" && tuitionScore !== 2)
      ) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<p>No universities found.</p>";
  } else {
    filtered.forEach(uni => {
      resultsDiv.innerHTML += `
        <div class="university-card">
          <h3>${uni.name}</h3>
          <p><strong>Country:</strong> ${uni.country}</p>
          <p><a href="${uni.web_pages[0]}" target="_blank">Visit Website</a></p>
        </div>
      `;
    });
  }

  autoCopilotResponse(selectedCountries, type, subject, tuition, filtered.length);
}

function autoCopilotResponse(countries, type, subject, tuition, count) {
  const log = document.getElementById("copilot-log");
  let response = `🤖 Copilot: Found ${count} ${type !== "all" ? type : ""} universities`;

  if (countries.length > 0) {
    response += ` in ${countries.join(", ")}`;
  }

  if (subject) {
    response += ` related to "${subject}"`;
  }

  if (tuition !== "any") {
    response += ` with ${tuition} tuition`;
  }

  response += ".";

  if (count === 0) {
    response += ` Try adjusting filters or selecting more countries.`;
  } else {
    response += ` Explore their websites for course details and admissions info.`;
  }

  log.innerText = response;
}

// Initial load
fetchUniversities();
