/**
 * @license MIT
 * @copyright 2023 bassu
 * @author bassu <basavarajakj06@gmail.com>
 */

"use strict";

declare global {
    interface Window {
        ACCESS_POINT: string;
        saveRecipe: (element: HTMLElement, recipeId: string) => void
    }
}
  
window.ACCESS_POINT = "https://api.edamam.com/api/recipes/v2"

export const fetchData = async function (queries: [string, string][], successCallback: (data: any) => void) {
    const query: string = queries
                ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join("&");
    

    const url = `${window.ACCESS_POINT}?app_id=${import.meta.env.VITE_APP_ID}&app_key=${import.meta.env.VITE_API_KEY}&type=${import.meta.env.VITE_TYPE}${query ? `&${query}` : ""}` 

    const response = await fetch(url);

    if (response.ok) {
        const data = await response.json();
        successCallback(data);
    }
}