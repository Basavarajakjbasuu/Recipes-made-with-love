/**
 * @license MIT
 * @copyright 2023 bassu
 * @author bassu <basavarajakj06@gmail.com>
 */

'use strict';

/**
 * Home page Search
 */

const $SearchField: HTMLInputElement | null = document.querySelector(
	'[data-search-field]'
);
const $SearchBtn: HTMLButtonElement | null =
	document.querySelector('[data-search-btn]');
const $SearchError: HTMLParagraphElement | null = document.querySelector(
	'[data-search-error]'
);

if ($SearchField && $SearchBtn) {
	$SearchBtn.addEventListener('click', function (this: HTMLElement) {
		if ($SearchField.value) {
			window.location.href = `/recipes.html?q=${
				($SearchField as HTMLInputElement).value
			}`;
		} else if ($SearchError) {
			$SearchError.setAttribute('aria-hidden', 'false');
		}
	});
}

/**
 * Search submit when press "Enter key"
 */

if ($SearchField && $SearchBtn) {
	$SearchField.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			$SearchBtn.click();
		}
	});
}

/**
 * Tab panel Navigation
 */

interface AddEventOnElementsOptions {
	$elements: NodeList;
	eventType: string;
	callback: EventListenerOrEventListenerObject;
}

const addEventOnElements = ({
	$elements,
	eventType,
	callback,
}: AddEventOnElementsOptions) => {
	for (const element of Array.from($elements)) {
		element.addEventListener(eventType, callback);
	}
};

const $tabBtns: NodeListOf<HTMLButtonElement> =
	document.querySelectorAll('[data-tab-btn]');
const $tabPanels: NodeListOf<HTMLElement> =
	document.querySelectorAll('[data-tab-panel]');

let $lastActiveTabBtn: HTMLElement | undefined = $tabBtns[0];
let $lastActiveTabPanel: HTMLElement | undefined = $tabPanels[0];

addEventOnElements({
	$elements: $tabBtns,
	eventType: 'click',
	callback: function (this: HTMLElement) {
		$lastActiveTabPanel?.setAttribute('hidden', 'true');
		$lastActiveTabBtn?.setAttribute('aria-selected', 'false');
		$lastActiveTabBtn?.setAttribute('tabindex', '-1');

		const $currentTabPanel: HTMLElement | null = document.querySelector(
			`#${this.getAttribute('aria-controls')}`
		);

		$currentTabPanel?.removeAttribute('hidden');
		this.setAttribute('aria-selected', 'true');
		this.setAttribute('tabindex', '0');

		$lastActiveTabPanel = $currentTabPanel;
		$lastActiveTabBtn = this;
	},
});

/**
 * Navigate Tab with arrow key
 */

addEventOnElements({

	$elements: $tabBtns,
	eventType: 'keydown',
	callback: function (this: HTMLElement, e :KeyboardEvent) {
		const $nextElement: HTMLElement | null = this.nextElementSibling;
		const $previousElement: HTMLElement | null = this.previousElementSibling;

        console.log($nextElement)
		if (e.key === 'ArrowRight' && $nextElement) {
			this.setAttribute('tabindex', '-1');
			$nextElement.setAttribute('tabindex', '0');
			$nextElement.focus();
		} else if ((e.key === 'ArrowLeft') && $previousElement) {
			this.setAttribute('tabindex', '-1');
			$previousElement?.setAttribute('tabindex', '0');
			$previousElement.focus();
        } else if (e.key === 'Tab') {
            this.setAttribute("tabindex", '-1');
            $lastActiveTabBtn?.setAttribute("tabindex", '0')
		}
	},
});
