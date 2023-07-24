/**
 * @license MIT
 * @copyright 2023 bassu
 * @author bassu <basavarajakj06@gmail.com>
 */

"use strict";

/**
 * Import
 */

import { fetchData } from "./api";
import { $skeletonCard, cardQueries } from "./global";
import { RecipeItem, RecipeItem1 } from "./home";
import { getTime } from "./module";

/**
 * Accordion
 */

const /** {Node list} */ $accordions: NodeListOf<Element> = document.querySelectorAll("[data-accordion]");

/**
 * @param $element Accordion node
 */
const initAccordion = function ($element: Element) {

  const $button = $element.querySelector("[data-accordion-btn]");

  let isExpanded = false;

  $button?.addEventListener('click', function (this: HTMLElement) {
    isExpanded = !isExpanded;
    this.setAttribute('aria-expanded', String(isExpanded));
  });
}

for (const $accordion of $accordions) initAccordion($accordion);

/**
 * Filter bar toggle for mobile screen
 */

const $filterBar: Element | null = document.querySelector("[data-filter-bar]");
const $filterTogglers:NodeListOf<Element> = document.querySelectorAll("[data-filter-toggler]");
const $overlay: Element | null = document.querySelector('[data-overlay]');

for (const $filterToggler of Array.from($filterTogglers)) {
  
  $filterToggler.addEventListener('click', function () {
    $filterBar?.classList.toggle('active');
    $overlay?.classList.toggle('active');

    const bodyOverflow: string = document.body.style.overflow;
    document.body.style.overflow = bodyOverflow === "hidden" ? 'visible' : 'hidden';
  })
}

/**
 * Filter submit and clear
 */

const $filterSubmit = document.querySelector("[data-filter-submit]");
const $filterClear = document.querySelector("[data-filter-clear]");
const $filterSearch = $filterBar?.querySelector("input[type='search']") as HTMLInputElement;

$filterSubmit?.addEventListener('click', function () {
  
  const $filterCheckboxes = $filterBar?.querySelectorAll<HTMLInputElement>("input:checked");

  const queries: string[] = [];

  if ($filterSearch?.value) queries.push(`q=${encodeURIComponent($filterSearch.value)}`);

  if ($filterCheckboxes?.length) {
    for (const $checkbox of $filterCheckboxes) {
      const key = $checkbox.parentElement?.parentElement?.dataset.filter;
      const value = $checkbox.value;
      
      if (key !== undefined) {
        queries.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
    }
  }

  const queryString = queries.length ? `?${queries.join("&")}` : "";

  window.location.href = `/src/pages/recipes.html${queryString}`;
});

if ($filterSubmit instanceof HTMLButtonElement) {

  $filterSearch.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") $filterSubmit.click();
  });

}

$filterClear?.addEventListener('click', function () {
  
  const $filterCheckboxes = $filterBar?.querySelectorAll<HTMLInputElement>("input:checked");

  $filterCheckboxes?.forEach(element => element.checked = false);
  $filterSearch.value &&= "";
})

const queryStr = window.location.search.slice(1);
const queries = queryStr && queryStr.split('&').map(i => i.split("="));

const $filterCount = document.querySelector("[data-filter-count]") as HTMLElement | null;

if (queries.length && $filterCount) {
  $filterCount.style.display = "block";
  $filterCount.innerHTML = queries.length.toString();
} else if ($filterCount){
  $filterCount.style.display = "none";
}

queryStr && queryStr.split("&").forEach(i => {
  const [key, value] = i.split("=");
  if (key === 'q') {
    const $searchInput = $filterBar?.querySelector("input[type='search']");
    if ($searchInput instanceof HTMLInputElement) {
      $searchInput.value = decodeURIComponent(value.replace(/%20/g, " "));
    }
  } else {
    const $inputWithValue = $filterBar?.querySelector(`[value="${decodeURIComponent(value.replace(/%20/g, " "))}"]`);
    if ($inputWithValue instanceof HTMLInputElement) {
      $inputWithValue.checked = true;
    }
  }
});

const $filterBtn = document.querySelector("[data-filter-btn]");

window.addEventListener("scroll", () => {
  $filterBtn?.classList[window.scrollY >= 120 ? 'add' : 'remove']('active')
})

/**
 * Request recipes and render
 */

const $gridList = document.querySelector("[data-grid-list]");
const $loadMore = document.querySelector("[data-load-more]");
const defaultQuires = [
  ['mealType', 'breakfast'],
  ['mealType', 'dinner'],
  ['mealType', 'lunch'],
  ['mealType', 'snack'],
  ['mealType', 'teatime'],
  ...cardQueries
]

if ($gridList !== null) {
  $gridList.innerHTML = $skeletonCard.repeat(20);
}

let nextPageUrl: string;
const fallbackImage = '../../public/images/image-placeholder.svg';

const renderRecipes = (data: RecipeItem1) => {

  data.hits.map((item: RecipeItem, index: number) => {

    const {
      recipe: {
        image,
        label: title,
        totalTime: cookingTime,
        uri
      }
    } = item;
 

    // extracting recipeId
    const recipeId = uri.slice(uri.lastIndexOf('_') + 1);

    // save recipes
    const isSaved = window.localStorage.getItem(`recipe${recipeId}`);

    const $card = document.createElement("div");
    $card.classList.add("card");
    $card.style.animationDelay = `${ 100 * index }`

    $card.innerHTML = `
      <div class="card">
        <figure class="card-media img-holder">
          <img 
            src="${image}" 
            height="200" 
            loading="lazy" 
            alt="${title}" 
            onerror="this.onerror=null;this.src='${fallbackImage}';"
            class="img-cover"
          />
        </figure>

        <div class="card-body">

          <h3 class="title-small">
          <a href="./detail.html?recipe=${recipeId}" class="card-link">${title || 'UnTitled'
      }</a>
          </h3>

          <div class="meta-wrapper">

          <div class="meta-item">
            <span class="material-symbols-outlined" aria-hidden="true">schedule</span>

            <span class="label-medium">
            ${getTime(cookingTime).time || '<10'} ${getTime(cookingTime).timeUnit} 
            </span>
          </div>

          <button
            class="icon-btn has-state ${isSaved ? 'saved' : 'removed'}" 
            aria-label="Add to saved recipes" 
            onClick="saveRecipe(this, '${recipeId}')"
          >
            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
            <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
          </button>

          </div>

        </div>
      </div>
    `;

    $gridList?.appendChild($card)

  });  
}

let requestedBefore: boolean = true;

fetchData(queries || defaultQuires, data => {
  
  const { _links: { next } } = data;
  nextPageUrl = next?.href;

  if ($gridList) {
    $gridList.innerHTML = "";
  }

  requestedBefore = false;

  if (data.hits.length) {
    renderRecipes(data)
  } else {
    if ($loadMore) {
      $loadMore.innerHTML = `<p class="body-medium info-text">No recipe found!</p>`
    }
  }
});

const CONTAINER_MAX_WIDTH = 1200;
const CONTAINER_MIN_CARD = 6;

window.addEventListener('scroll', async () => {
  
  if ($loadMore && $loadMore.getBoundingClientRect().top < window.innerHeight && !requestedBefore && nextPageUrl) {
    
    $loadMore.innerHTML = $skeletonCard.repeat(Math.round(($loadMore?.clientWidth / (CONTAINER_MAX_WIDTH)) * CONTAINER_MIN_CARD));
    requestedBefore = true;

    const response = await fetch(nextPageUrl);
    const data = await response.json();


    const { _links: { next } } = data;

    nextPageUrl = next?.href;

    renderRecipes(data);
    $loadMore.innerHTML = "";
    requestedBefore = false;
  }

})