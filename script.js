const nav=document.getElementById('mainNav');
document.getElementById('menuToggle').addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

let currentLanguage='en';
document.getElementById('languageToggle').addEventListener('click',()=>{
 currentLanguage=currentLanguage==='en'?'hi':'en';document.documentElement.lang=currentLanguage;
 document.querySelectorAll('[data-en][data-hi]').forEach(el=>el.innerHTML=el.dataset[currentLanguage]);
 document.getElementById('languageToggle').textContent=currentLanguage==='en'?'हिन्दी':'English';
});

const dailyCosts={India:{budget:1800,comfort:3500,premium:8000},Thailand:{budget:2600,comfort:5200,premium:11500},Japan:{budget:5500,comfort:9500,premium:19000},France:{budget:6500,comfort:11500,premium:23000},Italy:{budget:6200,comfort:10800,premium:22000},Switzerland:{budget:8500,comfort:14500,premium:29000},USA:{budget:7000,comfort:12500,premium:26000},Australia:{budget:6500,comfort:11500,premium:24000}};
document.getElementById('budgetForm').addEventListener('submit',e=>{e.preventDefault();const c=document.getElementById('tripCountry').value,t=Math.max(1,Math.min(20,Number(document.getElementById('travelers').value)||1)),d=Math.max(1,Math.min(90,Number(document.getElementById('days').value)||1)),s=document.getElementById('travelStyle').value;document.getElementById('budgetAmount').textContent='₹ '+(dailyCosts[c][s]*d*t).toLocaleString('en-IN');document.getElementById('budgetDetails').textContent=`${t} traveler(s) · ${d} day(s) · ${c} · ${s} estimate`;});

const destinationCards=[...document.querySelectorAll('.destination-card')];
document.getElementById('searchForm').addEventListener('submit',e=>{e.preventDefault();const q=document.getElementById('destinationSearch').value.trim().toLowerCase();let count=0;destinationCards.forEach(card=>{const match=!q||(card.dataset.search+' '+card.innerText).toLowerCase().includes(q);card.hidden=!match;if(match)count++;});document.getElementById('emptyState').hidden=count!==0;document.getElementById('searchMessage').textContent=q?(count?`${count} destination(s) found.`:'No matching destination found. Try Bali, Paris, Japan, Switzerland or New York.'):'Showing all popular destinations.';document.getElementById('destinations').scrollIntoView({behavior:'smooth'});});

const countryGrid=document.getElementById('countryGrid'),countrySearch=document.getElementById('countrySearch'),regionFilter=document.getElementById('regionFilter');
let countries=[];
const fallbackCountries=[
{name:{common:'India'},capital:['New Delhi'],region:'Asia',currencies:{INR:{name:'Indian rupee',symbol:'₹'}},languages:{hin:'Hindi',eng:'English'},flags:{png:'https://flagcdn.com/w320/in.png'},population:1400000000},
{name:{common:'Japan'},capital:['Tokyo'],region:'Asia',currencies:{JPY:{name:'Japanese yen',symbol:'¥'}},languages:{jpn:'Japanese'},flags:{png:'https://flagcdn.com/w320/jp.png'},population:124000000},
{name:{common:'France'},capital:['Paris'],region:'Europe',currencies:{EUR:{name:'Euro',symbol:'€'}},languages:{fra:'French'},flags:{png:'https://flagcdn.com/w320/fr.png'},population:68000000},
{name:{common:'United States'},capital:['Washington, D.C.'],region:'Americas',currencies:{USD:{name:'United States dollar',symbol:'$'}},languages:{eng:'English'},flags:{png:'https://flagcdn.com/w320/us.png'},population:335000000},
{name:{common:'Australia'},capital:['Canberra'],region:'Oceania',currencies:{AUD:{name:'Australian dollar',symbol:'$'}},languages:{eng:'English'},flags:{png:'https://flagcdn.com/w320/au.png'},population:27000000},
{name:{common:'Thailand'},capital:['Bangkok'],region:'Asia',currencies:{THB:{name:'Thai baht',symbol:'฿'}},languages:{tha:'Thai'},flags:{png:'https://flagcdn.com/w320/th.png'},population:71000000},
{name:{common:'Italy'},capital:['Rome'],region:'Europe',currencies:{EUR:{name:'Euro',symbol:'€'}},languages:{ita:'Italian'},flags:{png:'https://flagcdn.com/w320/it.png'},population:59000000},
{name:{common:'Switzerland'},capital:['Bern'],region:'Europe',currencies:{CHF:{name:'Swiss franc',symbol:'CHF'}},languages:{deu:'German',fra:'French',ita:'Italian'},flags:{png:'https://flagcdn.com/w320/ch.png'},population:8800000}
];
function safeText(v){return String(v??'Not available');}
function renderCountries(){
 const q=countrySearch.value.trim().toLowerCase(),r=regionFilter.value;
 const list=countries.filter(c=>(!q||c.name.common.toLowerCase().includes(q))&&(!r||c.region===r)).sort((a,b)=>a.name.common.localeCompare(b.name.common));
 document.getElementById('countryCount').textContent=`${list.length} countries shown`;
 countryGrid.innerHTML='';
 if(!list.length){countryGrid.innerHTML='<div class="no-countries">No matching country found. Try another search.</div>';return;}
 list.forEach(c=>{
  const card=document.createElement('button');card.type='button';card.className='country-card';
  const img=document.createElement('img');img.className='country-flag';img.src=c.flags?.png||c.flags?.svg||'';img.alt=`${c.name.common} flag`;img.loading='lazy';
  const box=document.createElement('span'),strong=document.createElement('strong'),small=document.createElement('small');
  strong.textContent=c.name.common;small.textContent=c.region||'Region unavailable';box.append(strong,small);card.append(img,box);card.addEventListener('click',()=>showCountry(c));countryGrid.append(card);
 });
}
function showCountry(c){
 const currencies=Object.values(c.currencies||{}).map(x=>x.name+(x.symbol?' ('+x.symbol+')':'')).join(', ')||'Not available';
 const languages=Object.values(c.languages||{}).join(', ')||'Not available';
 const capital=(c.capital||[]).join(', ')||'Not available';
 const population=c.population?Number(c.population).toLocaleString('en-US'):'Not available';
 const flag=c.flags?.png||c.flags?.svg||'';
 document.getElementById('modalCountryContent').innerHTML=`
 ${flag?`<img class="modal-flag" src="${flag}" alt="">`:''}
 <h3 id="modalCountryName">${safeText(c.name.common)}</h3>
 <div class="detail-list">
  <div class="detail-item"><small>Capital</small><strong>${safeText(capital)}</strong></div>
  <div class="detail-item"><small>Region</small><strong>${safeText(c.region)}</strong></div>
  <div class="detail-item"><small>Currency</small><strong>${safeText(currencies)}</strong></div>
  <div class="detail-item"><small>Languages</small><strong>${safeText(languages)}</strong></div>
  <div class="detail-item"><small>Population (approx.)</small><strong>${population}</strong></div>
  <div class="detail-item"><small>Country code</small><strong>${safeText(c.cca3)}</strong></div>
 </div><p class="modal-tip">Information is supplied by the REST Countries public data service. Population and country details may be updated by the data provider.</p>`;
 const modal=document.getElementById('countryModal');modal.classList.add('open');modal.setAttribute('aria-hidden','false');
}
function closeModal(){const m=document.getElementById('countryModal');m.classList.remove('open');m.setAttribute('aria-hidden','true');}
document.getElementById('modalClose').addEventListener('click',closeModal);
document.querySelector('[data-close-modal]').addEventListener('click',closeModal);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
countrySearch.addEventListener('input',renderCountries);regionFilter.addEventListener('change',renderCountries);
async function loadCountries(){
 try{
  const response=await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,currencies,languages,flags,population,cca3');
  if(!response.ok)throw new Error('Country service unavailable');
  const data=await response.json();
  countries=data.filter(c=>c.name?.common&&c.region).sort((a,b)=>a.name.common.localeCompare(b.name.common));
  document.getElementById('countryNote').textContent='Country information is loaded from the REST Countries public data service. The directory includes countries and some territories.';
 }catch(err){
  countries=fallbackCountries;
  document.getElementById('countryNote').textContent='Live country data could not be loaded. Showing a small offline sample. Connect to the internet and refresh to try again.';
 }
 renderCountries();
}
document.getElementById('year').textContent=new Date().getFullYear();
loadCountries();