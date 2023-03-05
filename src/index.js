import './css/styles.css';
import debounce from 'lodash.debounce';
import notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(event) {
  const searchQuery = event.target.value.trim();

  if (searchQuery === '') {
    clearCountryList();
    clearCountryInfo();
    return;
  }

  fetchCountries(searchQuery).then(countries => {
    if (countries.length > 10) {
      clearCountryList();
      notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    } else if (countries.length >= 2 && countries.length <= 10) {
      renderCountryList(countries);
      clearCountryInfo();
    } else {
      renderCountryInfo(countries);
      clearCountryList();
    }
  });
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="country-item"><img class="country-image" src="${flags.svg}" alt="${flags.alt}" width="25" height="15"><span>${name.common}</span></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markup = country
    .map(({ name, flags, capital, population, languages }) => {
      return `
      <p><img class="country-image" src="${flags.svg}" alt="${
        flags.alt
      }" width="25" height="15">${name.common}</p>
      <p><b class="country-text">Capital: </b>${capital}</p>
      <p><b class="country-text">Population: </b>${population}</p>
      <p><b class="country-text">Languages: </b>${Object.values(languages).join(
        ', '
      )}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
