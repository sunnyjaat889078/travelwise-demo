
const nav = document.getElementById('mainNav');

document.getElementById('menuToggle').addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

// Language Toggle
let currentLanguage = 'en';

document.getElementById('languageToggle').addEventListener('click', () => {
  currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll('[data-en][data-hi]').forEach(el => {
    el.innerHTML = el.dataset[currentLanguage];
  });

  document.getElementById('languageToggle').textContent =
    currentLanguage === 'en' ? 'हिन्दी' : 'English';
});

// Travel Budget
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
  const travelers = Math.max(1, Math.min(20,
    Number(document.getElementById('travelers').value) || 1
  ));
  const days = Math.max(1, Math.min(90,
    Number(document.getElementById('days').value) || 1
  ));
  const style = document.getElementById('travelStyle').value;

  const total = dailyCosts[country][style] * days * travelers;

  document.getElementById('budgetAmount').textContent =
    '₹ ' + total.toLocaleString('en-IN');

  document.getElementById('budgetDetails').textContent =
    `${travelers} traveler(s) · ${days} day(s) · ${country} · ${style} estimate`;
});

// Destination Search
const destinationCards = [
  ...document.querySelectorAll('.destination-card')
];

document.getElementById('searchForm').addEventListener('submit', e => {
  e.preventDefault();

  const query = document.getElementById('destinationSearch')
    .value.trim().toLowerCase();

  let count = 0;

  destinationCards.forEach(card => {
    const match = !query ||
      (card.dataset.search + ' ' + card.innerText)
        .toLowerCase().includes(query);

    card.hidden = !match;
    if (match) count++;
  });

  document.getElementById('emptyState').hidden = count !== 0;

  document.getElementById('searchMessage').textContent =
    query
      ? (count ? `${count} destination(s) found.` : 'No matching destination found.')
      : 'Showing all popular destinations.';

  document.getElementById('destinations')
    .scrollIntoView({behavior:'smooth'});
});

// Country Explorer
const countryGrid = document.getElementById('countryGrid');
const countrySearch = document.getElementById('countrySearch');
const regionFilter = document.getElementById('regionFilter');

let countries = [];

const fallbackCountries = [
  {name:{common:'India'},capital:['New Delhi'],region:'Asia',
   currencies:{INR:{name:'Indian rupee',symbol:'₹'}},
   languages:{hin:'Hindi',eng:'English'},
   flags:{png:'https://flagcdn.com/w320/in.png'},population:1400000000},

  {name:{common:'Japan'},capital:['Tokyo'],region:'Asia',
   currencies:{JPY:{name:'Japanese yen',symbol:'¥'}},
   languages:{jpn:'Japanese'},
   flags:{png:'https://flagcdn.com/w320/jp.png'},population:124000000},

  {name:{common:'France'},capital:['Paris'],region:'Europe',
   currencies:{EUR:{name:'Euro',symbol:'€'}},
   languages:{fra:'French'},
   flags:{png:'https://flagcdn.com/w320/fr.png'},population:68000000},

  {name:{common:'United States'},capital:['Washington, D.C.'],region:'Americas',
   currencies:{USD:{name:'US dollar',symbol:'$'}},
   languages:{eng:'English'},
   flags:{png:'https://flagcdn.com/w320/us.png'},population:335000000},

  {name:{common:'Australia'},capital:['Canberra'],region:'Oceania',
   currencies:{AUD:{name:'Australian dollar',symbol:'$'}},
   languages:{eng:'English'},
   flags:{png:'https://flagcdn.com/w320/au.png'},population:27000000},

  {name:{common:'Thailand'},capital:['Bangkok'],region:'Asia',
   currencies:{THB:{name:'Thai baht',symbol:'฿'}},
   languages:{tha:'Thai'},
   flags:{png:'https://flagcdn.com/w320/th.png'},population:71000000},

  {name:{common:'Italy'},capital:['Rome'],region:'Europe',
   currencies:{EUR:{name:'Euro',symbol:'€'}},
   languages:{ita:'Italian'},
   flags:{png:'https://flagcdn.com/w320/it.png'},population:59000000},

  {name:{common:'Switzerland'},capital:['Bern'],region:'Europe',
   currencies:{CHF:{name:'Swiss franc',symbol:'CHF'}},
   languages:{deu:'German',fra:'French',ita:'Italian'},
   flags:{png:'https://flagcdn.com/w320/ch.png'},population:8800000}
];

function safeText(value) {
  return String(value ?? 'Not available').replace(/[&<>"']/g, char => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  })[char]);
}

// Render Countries
function renderCountries() {
const rawQuery = countrySearch.value.trim().toLowerCase();
const hindiCountryNames = {'भारत':'india','जापान':'japan','फ्रांस':'france','इटली':'italy','अमेरिका':'united states','ऑस्ट्रेलिया':'australia','थाईलैंड':'thailand','स्विट्जरलैंड':'switzerland'};
const query = hindiCountryNames[rawQuery] || rawQuery;  
  const region = regionFilter.value;

  const list = countries.filter(country => {
    return (
      (!query || country.name.common.toLowerCase().includes(query)) &&
      (!region || country.region === region)
    );
  }).sort((a,b) =>
    a.name.common.localeCompare(b.name.common)
  );

  document.getElementById('countryCount').textContent =
    `${list.length} countries shown`;

  countryGrid.innerHTML = '';

  if (!list.length) {
    countryGrid.innerHTML =
      '<div class="no-countries">No matching country found.</div>';
    return;
  }

  list.forEach(country => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'country-card';

    const img = document.createElement('img');
    img.className = 'country-flag';
    img.src = country.flags?.png || country.flags?.svg || '';
    img.alt = `${country.name.common} flag`;
    img.loading = 'lazy';

    const box = document.createElement('span');
    const strong = document.createElement('strong');
    const small = document.createElement('small');

    strong.textContent = country.name.common;
    small.textContent = country.region || 'Region unavailable';

    box.append(strong, small);
    card.append(img, box);

    card.addEventListener('click', () => showCountry(country));
    countryGrid.append(card);
  });
}

// Country Details
function showCountry(country) {
  const currencies = Object.values(country.currencies || {})
    .map(x => x.name + (x.symbol ? ' (' + x.symbol + ')' : ''))
    .join(', ') || 'Not available';

  const languages = Object.values(country.languages || {})
    .join(', ') || 'Not available';

  const capital = (country.capital || []).join(', ') || 'Not available';

  const population = country.population
    ? Number(country.population).toLocaleString('en-US')
    : 'Not available';

  const flag = country.flags?.png || country.flags?.svg || '';

  document.getElementById('modalCountryContent').innerHTML = `
    ${flag ? `<img class="modal-flag" src="${safeText(flag)}" alt="">` : ''}

    <h3 id="modalCountryName">${safeText(country.name.common)}</h3>

    <div class="detail-list">
      <div class="detail-item">
        <small>Capital</small>
        <strong>${safeText(capital)}</strong>
      </div>

      <div class="detail-item">
        <small>Region</small>
        <strong>${safeText(country.region)}</strong>
      </div>

      <div class="detail-item">
        <small>Currency</small>
        <strong>${safeText(currencies)}</strong>
      </div>

      <div class="detail-item">
        <small>Languages</small>
        <strong>${safeText(languages)}</strong>
      </div>

      <div class="detail-item">
        <small>Population (approx.)</small>
        <strong>${population}</strong>
      </div>

      <div class="detail-item">
        <small>Country code</small>
        <strong>${safeText(country.cca3)}</strong>
      </div>
    </div>

    <p class="modal-tip">
      Country information is provided by the REST Countries public data service.
    </p>
  `;

  const modal = document.getElementById('countryModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}

// Close Country Modal
function closeModal() {
  const modal = document.getElementById('countryModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}

document.getElementById('modalClose')
  .addEventListener('click', closeModal);

document.querySelector('[data-close-modal]')
  .addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Country Search and Region Filter
countrySearch.addEventListener('input', renderCountries);
regionFilter.addEventListener('change', renderCountries);

// Load World Countries
async function loadCountries() {
  const note = document.getElementById('countryNote');
countries = fallbackCountries;
renderCountries();
note.textContent = 'Showing sample countries while live directory loads.';
  try {
    const response = await fetch(
    'https://restcountries.conventus.de/v3.1/all?fields=name,capital,region,currencies,languages,flags,population,cca3'
    );

    if (!response.ok) {
      throw new Error('Country service unavailable');
    }

    const data = await response.json();

    countries = data.filter(country =>
  country.name?.common &&
  country.region
).sort((a, b) =>
  a.name.common.localeCompare(b.name.common)
);

    note.textContent =
      'Country information loaded from the REST Countries public data service.';

  } catch (error) {
    countries = fallbackCountries;

    note.textContent =
      'Live country data unavailable. Showing offline sample countries.';
  }

  renderCountries();
}

// Current Year
document.getElementById('year').textContent =
  new Date().getFullYear();

// Start Website
loadCountries();
     
