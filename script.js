const nav = document.getElementById('mainNav');
document.getElementById('menuToggle').addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

let currentLanguage = 'en';
const languageToggle = document.getElementById('languageToggle');
languageToggle.addEventListener('click', () => {
  currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('[data-en][data-hi]').forEach(el => {
    el.innerHTML = el.dataset[currentLanguage];
  });
  languageToggle.textContent = currentLanguage === 'en' ? 'हिन्दी' : 'English';
  document.getElementById('destinationSearch').placeholder = currentLanguage === 'en'
    ? 'Try Japan, Bali, Paris...' : 'जैसे Japan, Bali, Paris खोजें...';
  document.getElementById('searchMessage').textContent = '';
});

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('destinationSearch');
const cards = [...document.querySelectorAll('.destination-card')];
const emptyState = document.getElementById('emptyState');
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  let matches = 0;
  cards.forEach(card => {
    const found = !query || (card.dataset.search + ' ' + card.innerText).toLowerCase().includes(query);
    card.hidden = !found;
    if (found) matches++;
  });
  emptyState.hidden = matches !== 0;
  document.getElementById('searchMessage').textContent = query
    ? (matches ? `${matches} destination(s) found.` : 'No matching destination found. Try Bali, Paris, Japan, Switzerland or New York.')
    : 'Showing all popular destinations.';
  document.getElementById('destinations').scrollIntoView({behavior:'smooth'});
});

const dailyCosts = {
  India: {budget:1800, comfort:3500, premium:8000},
  Thailand: {budget:2600, comfort:5200, premium:11500},
  Japan: {budget:5500, comfort:9500, premium:19000},
  France: {budget:6500, comfort:11500, premium:23000},
  Italy: {budget:6200, comfort:10800, premium:22000},
  Switzerland: {budget:8500, comfort:14500, premium:29000},
  USA: {budget:7000, comfort:12500, premium:26000},
  Australia: {budget:6500, comfort:11500, premium:24000}
};
document.getElementById('budgetForm').addEventListener('submit', e => {
  e.preventDefault();
  const country = document.getElementById('tripCountry').value;
  const travelers = Math.max(1, Math.min(20, Number(document.getElementById('travelers').value) || 1));
  const days = Math.max(1, Math.min(90, Number(document.getElementById('days').value) || 1));
  const style = document.getElementById('travelStyle').value;
  const estimate = dailyCosts[country][style] * days * travelers;
  document.getElementById('budgetAmount').textContent = '₹ ' + estimate.toLocaleString('en-IN');
  document.getElementById('budgetDetails').textContent =
    `${travelers} traveler(s) · ${days} day(s) · ${country} · ${style} estimate`;
});
document.getElementById('year').textContent = new Date().getFullYear();
