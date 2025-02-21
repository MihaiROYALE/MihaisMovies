document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById('search-btn');
    const searchContainer = document.getElementById('search-container');
    const closeBtn = document.getElementById('close-btn');
    const searchInput = document.getElementById('search-input');
    const openAllBtn = document.getElementById('open-all');
    const closeAllBtn = document.getElementById('close-all');
    const movies = document.querySelectorAll('.movie');

    // Stores which cases were open/closed before searching
    let movieStates = {};

    function saveMovieStates() {
        movieStates = {};
        movies.forEach(movie => {
            const checkbox = movie.querySelector('input[type="checkbox"]');
            if (checkbox) {
                movieStates[checkbox.id] = checkbox.checked;
            }
        });
    }

    function restoreMovieStates() {
        movies.forEach(movie => {
            const checkbox = movie.querySelector('input[type="checkbox"]');
            if (checkbox && movieStates.hasOwnProperty(checkbox.id)) {
                checkbox.checked = movieStates[checkbox.id];
            }
            movie.classList.remove('hidden');
            movie.querySelectorAll('div p').forEach(p => {
                p.classList.remove('hidden');
            });
        });
    }

    // Initialize states
    saveMovieStates();
    searchContainer.style.display = 'none';

    // Toggle search bar
    searchBtn.addEventListener('click', function () {
        if (searchContainer.style.display === 'flex') {
            closeSearchBar();
        } else {
            openSearchBar();
        }
    });

    function openSearchBar() {
        saveMovieStates(); // Save the current state before searching
        searchContainer.style.display = 'flex';
        searchInput.focus();
    }

    function closeSearchBar() {
        searchContainer.style.display = 'none';
        searchInput.value = ''; // Clear the search input
        restoreMovieStates(); // Restore previous state
    }

    // Close button
    closeBtn.addEventListener('click', closeSearchBar);

    // Search functionality
    searchInput.addEventListener('input', function () {
        const input = searchInput.value.toLowerCase().trim();

        if (input === "") {
            restoreMovieStates(); // Restore state when input is cleared
            return;
        }

        let anyMatch = false;

        movies.forEach(movie => {
            const checkbox = movie.querySelector('input[type="checkbox"]');
            const movieItems = movie.querySelectorAll('div p');

            let hasMatch = false;
            movieItems.forEach(p => {
                const textMatch = p.innerText.toLowerCase().includes(input);
                p.classList.toggle('hidden', !textMatch);
                if (textMatch) hasMatch = true;
            });

            const yearLabel = movie.querySelector('label').innerText.toLowerCase();
            const yearMatch = yearLabel.includes(input);

            if (hasMatch || yearMatch) {
                movie.classList.remove('hidden');
                if (checkbox) checkbox.checked = true;
                anyMatch = true;
            } else {
                movie.classList.add('hidden');
                if (checkbox) checkbox.checked = false;
            }
        });

        if (!anyMatch) {
            movies.forEach(movie => movie.classList.add('hidden'));
        }
    });

    // Open all
    openAllBtn.addEventListener('click', function () {
        movies.forEach(movie => {
            const checkbox = movie.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = true;
            movie.classList.remove('hidden');
            movie.querySelectorAll('div p').forEach(p => p.classList.remove('hidden'));
        });
        saveMovieStates();
    });

    // Close all
    closeAllBtn.addEventListener('click', function () {
        movies.forEach(movie => {
            const checkbox = movie.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = false;
        });
        saveMovieStates();
    });
});