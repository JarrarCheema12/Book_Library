const B_list = document.getElementById('Book-List');
const btn = document.getElementById('toggleBtn');
const searchInput = document.getElementById('searchInput');
const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');
const sortSelect = document.getElementById('sortSelect');

let booksData = [];
let filteredData = [];
let currentPage = 1;
let apiPage = 1;
const booksPerPage = 5;
const apiLimit = 10;

// Fetch data from API
const fetchData = async () => {
    try {
        const response = await fetch(`https://api.freeapi.app/api/v1/public/books?page=${apiPage}&limit=${apiLimit}&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech`);
        const data = await response.json();
        booksData = [...booksData, ...data.data.data];
        filteredData = booksData;
        showData();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};


const showData = () => {
    B_list.innerHTML = '';
    let startIndex = (currentPage - 1) * booksPerPage;
    let endIndex = startIndex + booksPerPage;
    let dataToDisplay = filteredData.slice(startIndex, endIndex);

    if (dataToDisplay.length === 0) {
        B_list.innerHTML = "<h3>No books found.</h3>";
        return;
    }

    dataToDisplay.forEach(element => {
        let title = element.volumeInfo.title || "No Title";
        let author = element.volumeInfo.authors ? element.volumeInfo.authors.join(", ") : "Unknown Author";
        let publisher = element.volumeInfo.publisher || "Unknown Publisher";
        let publishedDate = element.volumeInfo.publishedDate || "N/A";
        let link = element.volumeInfo.imageLinks?.thumbnail || '';
        let infoLink = element.volumeInfo.infoLink || '#';

        let bookContainer = document.createElement('div');
        bookContainer.classList.add('book-item');


        bookContainer.addEventListener('click', () => {
            window.open(infoLink, '_blank');
        });

        let titleDisplay = document.createElement('h4');
        titleDisplay.innerText = `Title: ${title}`;
        bookContainer.appendChild(titleDisplay);

        let authorDisplay = document.createElement('h4');
        authorDisplay.innerText = `Author: ${author}`;
        bookContainer.appendChild(authorDisplay);

        let publisherDisplay = document.createElement('h4');
        publisherDisplay.innerText = `Publisher: ${publisher}`;
        bookContainer.appendChild(publisherDisplay);

        let dateDisplay = document.createElement('h4');
        dateDisplay.innerText = `Published: ${publishedDate}`;
        bookContainer.appendChild(dateDisplay);

        let img = document.createElement('img');
        img.src = link;
        img.alt = title;
        img.width = 150;
        bookContainer.appendChild(img);

        B_list.appendChild(bookContainer);
    });

    updatePaginationButtons();
};


btn.addEventListener('click', () => {
    B_list.classList.toggle('grid-view');
    B_list.classList.toggle('list-view');

    btn.value = B_list.classList.contains('list-view')
        ? 'Switch to Grid View'
        : 'Switch to List View';
});


nextBtn.addEventListener('click', () => {
    if (currentPage < Math.ceil(filteredData.length / booksPerPage)) {
        currentPage++;
        showData();
    } else {
        apiPage++; // Fetch new data
        fetchData();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showData();
    }
});


const updatePaginationButtons = () => {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === Math.ceil(filteredData.length / booksPerPage);
};


searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    filteredData = query === ""
        ? booksData
        : booksData.filter(book => book.volumeInfo.title.toLowerCase().includes(query));

    currentPage = 1;
    showData();
});


sortSelect.addEventListener('change', () => {
    const sortType = sortSelect.value;

    if (sortType === "title") {
        filteredData.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
    } else if (sortType === "publishedDate") {
        filteredData.sort((a, b) => (a.volumeInfo.publishedDate || "").localeCompare(b.volumeInfo.publishedDate || ""));
    }

    currentPage = 1;
    showData();
});


fetchData();
