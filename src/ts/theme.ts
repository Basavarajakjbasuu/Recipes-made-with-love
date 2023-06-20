/**
 * @license MIT
 * @copyright 2023 bassu
 * @author bassu <basavarajakj06@gmail.com>
 */

"use strict";

const $HTML :HTMLElement = document.documentElement;
const isDark :boolean = window.matchMedia("(prefers-color-scheme:dark").matches;


if (sessionStorage.getItem('theme')) {
    $HTML.dataset.theme = sessionStorage.getItem('theme')!;
} else {
    $HTML.dataset.theme = isDark ? "dark" : 'light';
}

let isPressed: boolean = false;

function themeChange(this: HTMLElement) {
    isPressed = !isPressed;

    this.setAttribute("aria-pressed", String(isPressed));
    $HTML.setAttribute("data-theme", ($HTML.dataset.theme === 'light' ? 'dark' : 'light'))

    sessionStorage.setItem('theme', $HTML.dataset.theme!)
}

window.addEventListener("load", function () {
    const $themeBtn: HTMLElement = document.querySelector("[data-theme-btn]")!;

    $themeBtn.addEventListener("click", themeChange);
} )