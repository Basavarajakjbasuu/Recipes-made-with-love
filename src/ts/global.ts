/**
 * @license MIT
 * @copyright 2023 bassu
 * @author bassu <basavarajakj06@gmail.com>
 */

"use strict";

import { fetchData } from "./api";

export const cardQueries: string [][]  = [
    ["field", "uri"],
    ["field", "label"],
    ["field", "image"],
    ["field", "totalTime"],
]

export const $skeletonCard = `
    <div class="card skeleton-card">

        <div class="skeleton card-banner"></div>

        <div class="card-body">

            <div class="skeleton card-title"></div>

            <div class="skeleton card-text"></div>

        </div>

    </div>
`;

const ROOT = "https://api.edamam.com/api/recipes/v2";

window.saveRecipe = function (element, recipeId) {
    const isSaved :string | null = window.localStorage.getItem(`recipe${recipeId}`);
    window.ACCESS_POINT = `${ROOT}/${recipeId}`;

    if (!isSaved) {
        fetchData(cardQueries, function (data: any) {
            window.localStorage.setItem(`recipe${recipeId}`, JSON.stringify(data));
            element.classList.toggle("saved");
            element.classList.toggle("removed");
            showNotification("Added to Recipe book")
        });
        window.ACCESS_POINT = ROOT;
    } else {
        window.localStorage.removeItem(`recipe${recipeId}`);
        element.classList.toggle("saved");
        element.classList.toggle("removed");
        showNotification("Removed from Recipe book")
    }
}

const $snackbarContainer = document.createElement("div");
$snackbarContainer.classList.add("snackbar-container");

document.body.appendChild($snackbarContainer);

function showNotification(message) {
    const $snackbar = document.createElement("div");
    $snackbar.classList.add("snackbar");
    $snackbar.innerHTML = `
        <p class="body-medium">${message}</p>
    `;

    $snackbarContainer.appendChild($snackbar);
    $snackbarContainer.addEventListener("animationend", e => $snackbarContainer.removeChild($snackbar))
}