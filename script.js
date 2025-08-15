document.getElementById("searchForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const country = document.getElementById("country").value;
    const name = document.getElementById("name_filter").value;
    const type = document.getElementById("type_filter").value;

    const url = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}${name ? `&name=${encodeURIComponent(name)}` : ''}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        const publicKeywords = ["University of", "State", "National", "Technische", "Public"];
        const privateKeywords = ["Business School", "College", "Academy", "Private", "Institut"];

        const filtered = data.filter(uni => {
            const uniName = uni.name.toLowerCase();
            if (type === "public") {
                return publicKeywords.some(keyword => uniName.includes(keyword.toLowerCase()));
            } else if (type === "private") {
                return privateKeywords.some(keyword => uniName.includes(keyword.toLowerCase()));
            }
            return true;
        });

        if (filtered.length === 0) {
            resultsDiv.innerHTML = "<p>No universities found.</p>";
        } else {
            filtered.forEach(uni => {
                const courseInfo = `
                    <ul>
                        <li><strong>Courses:</strong> Visit the university website for full course listings.</li>
                        <li><strong>Tuition Fees:</strong> Fees vary by program. Check the Admissions or Tuition section.</li>
                    </ul>
                `;

                resultsDiv.innerHTML += `
                    <div class="university-card">
                        <h3>${uni.name}</h3>
                        <p><strong>Country:</strong> ${uni.country}</p>
                        <p><a href="${uni.web_pages[0]}" target="_blank">Visit Website</a></p>
                        ${courseInfo}
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("results").innerHTML = "<p>Something went wrong. Please try again later.</p>";
    }
});
