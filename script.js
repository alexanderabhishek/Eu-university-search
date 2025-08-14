document.getElementById("searchForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const country = document.getElementById("country").value;
    const name = document.getElementById("name_filter").value;
    const url = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}${name ? `&name=${encodeURIComponent(name)}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (data.length === 0) {
        resultsDiv.innerHTML = "<p>No universities found.</p>";
    } else {
        data.forEach(uni => {
            resultsDiv.innerHTML += `<p><strong>${uni.name}</strong> (${uni.country}) - <a href="${uni.web_pages[0]}" target="_blank">${uni.web_pages[0]}</a></p>`;
        });
    }
});
