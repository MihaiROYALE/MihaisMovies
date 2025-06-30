/* =========================================================
   0.  NORMALISE FOR FUZZY SEARCH
   ========================================================= */
function normalise(str) {
  return str.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');
}

/* =========================================================
   1.  THEME TOGGLE  (persists via localStorage)
   ========================================================= */
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme  = localStorage.getItem('theme');
if (savedTheme === 'light') document.body.classList.add('light');
updateIcon();

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem(
    'theme',
    document.body.classList.contains('light') ? 'light' : 'dark'
  );
  updateIcon();
});
function updateIcon() {
  themeToggle.name = document.body.classList.contains('light')
    ? 'moon-outline' : 'sunny-outline';
}

/* =========================================================
   2.  BUILD MOVIE INDEX  (title + poster + url + rating)
   ========================================================= */
const movies = [...document.querySelectorAll('.movie-card')].map(card => {
  const img  = card.querySelector('.poster');
  const link = card.querySelector('a');
  const rating = parseInt(card.dataset.rating, 10) || 0;   // read once

  return {
    title  : img.alt.trim(),
    key    : normalise(img.alt),
    url    : link.href,
    poster : img.src,
    rating : rating                                     // ← keep rating
  };
});

/* =========================================================
   3.  SEARCH BAR UI
   ========================================================= */
const searchWrapper = document.getElementById('searchWrapper');
const searchBar     = document.getElementById('searchBar');
const iconSearch    = document.querySelector('.search-icon');
const container     = document.querySelector('.container');
const h1            = container.querySelector('h1');

const resultsHeader = document.createElement('h2');
resultsHeader.id    = 'resultsHeader';
resultsHeader.textContent = 'Results';
resultsHeader.style.display = 'none';

const resultsRow    = document.createElement('div');
resultsRow.id       = 'searchResults';
resultsRow.className = 'movie-scroll';

h1.insertAdjacentElement('afterend', resultsHeader);
resultsHeader.insertAdjacentElement('afterend', resultsRow);

let searchOpen = false;
iconSearch.addEventListener('click', () => searchOpen ? closeSearch() : openSearch());

function openSearch() {
  const rect = iconSearch.getBoundingClientRect();
  searchWrapper.style.top  = `${rect.top}px`;
  searchWrapper.style.left = `${rect.right + 8}px`;
  searchWrapper.style.display = 'block';
  searchBar.value = '';
  searchBar.focus();
  resultsRow.innerHTML = '';
  resultsHeader.style.display = 'none';
  searchOpen = true;
  document.addEventListener('click', outsideClick);
}
function closeSearch() {
  searchWrapper.style.display = 'none';
  resultsRow.innerHTML = '';
  resultsHeader.style.display = 'none';
  searchOpen = false;
  document.removeEventListener('click', outsideClick);
}
function outsideClick(e) {
  if (!searchWrapper.contains(e.target) &&
      !iconSearch.contains(e.target)   &&
      !resultsRow.contains(e.target)) closeSearch();
}

/* =========================================================
   4.  LIVE FUZZY SEARCH  (max 5 results)
   ========================================================= */
searchBar.addEventListener('input', () => {
  const key = normalise(searchBar.value.trim());
  resultsRow.innerHTML = '';

  if (!key) { resultsHeader.style.display = 'none'; return; }

  const matches = movies.filter(m => m.key.includes(key)).slice(0, 5);
  if (!matches.length) { resultsHeader.style.display = 'none'; return; }

  resultsHeader.style.display = 'block';
  matches.forEach(renderMatchCard);
});

function renderMatchCard(m) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  if (m.rating) card.dataset.rating = m.rating;  // ✅ copy rating

  const link = document.createElement('a'); link.href = m.url;

  const img  = document.createElement('img');
  img.src = m.poster; img.alt = m.title; img.className = 'poster';

  const title = document.createElement('p');
  title.className = 'movie-title'; title.textContent = m.title;

  link.appendChild(img); card.appendChild(link); card.appendChild(title);
  injectStars(card);                         // ✅ add stars
  resultsRow.appendChild(card);
}

/* =========================================================
   5.  STAR RATING  (reads data-rating="1-5")
   ========================================================= */
function injectStars(card) {
  const rating = parseInt(card.dataset.rating, 10);
  if (!rating || rating < 1 || rating > 5) return;

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const div   = document.createElement('div');
  div.className = 'movie-rating';
  div.textContent = stars;
  card.appendChild(div);
}

/* inject stars into the original cards already in the DOM */
document.querySelectorAll('.movie-card').forEach(injectStars);