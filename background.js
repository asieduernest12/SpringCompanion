chrome.runtime.onInstalled.addListener(async function (tab, statusInfo, response) {
	//create our context menus
	_contexts = [
		{ id: "translate_context", title: "Translate word", contexts: ["all"] },
		{ id: "history_context", title: "Translation history", contexts: ["all"] },
	];

	_contexts.forEach((ctx) => {
		chrome.contextMenus.create(ctx, () => {
			console.log("ctx created", ctx);
		});
	});

	// debugger;
	// console.log({ statusInfo });
	// chrome.scripting.executeScript({
	// 	target: { tabId: tab.id },
	// 	files: ["contentScript.js"],
	// });
});

chrome.runtime.onMessage.addListener((req, sender, res) => {
	//update context menu with selection payload
	if (req.title == "TEXT_SELECTED") {
		console.log("responding to text_selected msg");
		chrome.contextMenus.update("translate_context", { title: `Translate: ${req.payload}`, onclick: translateContextClickHandler });
	}
});

function translateContextClickHandler(onClickData, tabInfo) {
	translateWord(onClickData.selectionText ?? "");
}
async function translateWord(_word) {
	console.log("translation started");
	// word = getContextTranslationSourceWord();
	word = _word.trim();

	if (!isSingleWord(word)) throw new Error("Multiple word translation not supported");

	let translator = TranlationFactory().azureTranlate();
	let response = await fetchTranslation(translator.makeRequestObj(word));
	let parsed_response = translator.parseResponse(response);
	console.log("all clear and response is", parsed_response);
	saveTranslation(word, parsed_response);

	chrome.tabs.query({ active: true, currentWindow: true }, function ([tab]) {
		chrome.tabs.sendMessage(tab.id, { title: "SHOW_TRANSLATION", payload: { input: word, output: parsed_response, example: "" } }, function (response) {
			console.log(response.farewell);
		});
	});
	// alert("successful " + parsed_response);
}

function isSingleWord(word) {
	return ["", word].join("").split(" ").length == 1;
}

function fetchTranslation({ url, config }) {
	return fetch(url, config).then((res) => res.json());
}

function TranlationFactory() {
	return {
		googleTranlate,
		azureTranlate,
	};

	function azureTranlate() {
		return {
			makeRequestObj,
			parseResponse,
		};

		function makeRequestObj(word) {
			return {
				url: "https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&to=fr&%3CREQUIRED%3E&textType=plain&profanityAction=NoAction",
				config: {
					method: "POST",
					headers: {
						"content-type": "application/json",
						"x-rapidapi-key": "3e74cc98aamsh476224a114481c4p1f5868jsn7598fabc0572",
						"x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
					},
					body: JSON.stringify([
						{
							Text: word,
						},
					]),
				},
			};
		}
		function parseResponse(response) {
			return response[0].translations[0].text;
		}
	}

	function googleTranlate(word) {
		return {
			url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
			config: {
				method: "POST",
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					"accept-encoding": "application/gzip",
					"x-rapidapi-key": "3e74cc98aamsh476224a114481c4p1f5868jsn7598fabc0572",
					"x-rapidapi-host": "google-translate1.p.rapidapi.com",
				},
				body: JSON.stringify({
					q: word,
					target: "es",
					source: "en",
				}),
			},
		};
	}
}

function saveTranslation(query, result) {
	chrome.storage.sync.set({ query, result }, () => {
		console.log("query saved");
	});
}

async function getContextTranslationSourceWord() {
	// let _context = chrome.contextMenus.
}
