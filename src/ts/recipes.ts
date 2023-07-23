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
import { addEventOnElements } from "./home";
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
  
  const $filterCheckboxes = $filterBar?.querySelectorAll("input:checked");

  const queries: string[] = [];

  if ($filterSearch?.value) queries.push(`q=${encodeURIComponent($filterSearch.value)}`);

  if ($filterCheckboxes?.length) {
    for (const $checkbox of $filterCheckboxes) {
      const key = $checkbox.parentElement?.parentElement?.dataset.filter;
      const value = $checkbox.value;
      queries.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
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