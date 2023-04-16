const API_URL = "https://openlibrary.org";
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const bookDetails = document.querySelector("#book-details");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = searchInput.value;
  try {
    const response = await fetch(`${API_URL}/search.json?q=${query}`);
    const data = await response.json();
    const books = data.docs;
    displaySearchResults(books);
  } catch (error) {
    console.error(error);
  }
});

function displaySearchResults(books) {
  searchResults.innerHTML = "";
  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");
    bookElement.innerHTML = `
      <h2>${book.title}</h2>
      <p><strong>Author(s):</strong> ${book.author_name ? book.author_name.join(", ") : "N/A"}</p>
      <p><strong>Year of Publication:</strong> ${book.first_publish_year || "N/A"}</p>
      <button class="details-button" data-book-key="${book.key}">Details</button>
    `;
    searchResults.appendChild(bookElement);
    const detailsButton = bookElement.querySelector(".details-button");
    detailsButton.addEventListener("click", async () => {
      const bookKey = detailsButton.getAttribute("data-book-key");
      try {
        const response = await fetch(`${API_URL}/works/${bookKey}.json`);
        const data = await response.json();
        const authorNames = data.authors.map((author) => author.name).join(", ");
        const firstPublishYear = data.first_publish_year || "N/A";
        bookDetails.innerHTML = `
          <h2>${data.title}</h2>
          <p><strong>Author(s):</strong> ${authorNames}</p>
          <p><strong>Year of Publication:</strong> ${firstPublishYear}</p>
          <p><strong>Subject(s):</strong> ${data.subjects.map((subject) => subject.name).join(", ")}</p>
          <p><strong>Number of Pages:</strong> ${data.number_of_pages || "N/A"}</p>
        `;
      } catch (error) {
        console.error(error);
      }
    });
  });
}
