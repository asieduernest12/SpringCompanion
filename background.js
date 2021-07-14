chrome.runtime.onInstalled.addListener(async function (tab, statusInfo, response) {
	//create our context menus
	_contexts = [
		{ id: "translate_context", title: "Translate word", contexts: ["all"] },
		{ id: "history_context", title: "Translation history", contexts: ["all"] },
		{ id: "clear_context", title: "Clear history", contexts: ["all"] },
	];

	_contexts.forEach((ctx) => {
		chrome.contextMenus.create(ctx, () => {
			console.log("ctx created", ctx);
		});
	});

	updateHistoryContext();
});
chrome.contextMenus.onClicked.addListener((onClickData, tabInfo) => {
	switch (onClickData.menuItemId) {
		case "history_context": {
			console.log("history listener");
			historyContextClickHandler(onClickData, tabInfo);

			break;
		}
		case "clear_context": {
			clearHistory();
		}
	}
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

async function historyContextClickHandler(onClickData, tabInfo) {
	chrome.storage.sync.get(["historic_tranlations"], (storage) => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			console.log("send message historic_tranlations", storage.historic_tranlations);
			chrome.tabs.sendMessage(tabs[0].id, { title: "SHOW_HISTORY", payload: storage.historic_tranlations });
		});
	});
}
async function translateWord(_word) {
	console.log("translation started");
	// word = getContextTranslationSourceWord();
	word = _word.trim();

	if (!isSingleWord(word)) throw new Error("Multiple word translation not supported");

	let translator = TranlationFactory().azureTranlate();
	let response = await fetchTranslation(translator.makeRequestObj(word, "en"));
	let parsed_response = translator.parseResponse(response);
	console.log("all clear and response is", parsed_response);
	saveTranslation(word, parsed_response);

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { title: "SHOW_TRANSLATION", payload: { input: word, output: parsed_response, example: "" } });
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

		function makeRequestObj(word, ouput_lang) {
			return {
				url: `https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&to=${ouput_lang}&%3CREQUIRED%3E&textType=plain&profanityAction=NoAction`,
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

	function googleTranlate(word, ouput_lang) {
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
					target: ouput_lang,
					// source: "en",
				}),
			},
		};
	}
}

function saveTranslation(query, result) {
	chrome.storage.sync.get(["historic_tranlations"], ({ historic_tranlations = {} }) => {
		// storage.historic_tranlations = storage.historic_tranlations ?? {};
		historic_tranlations[query] = { input: query, output: result };
		chrome.storage.sync.set({ historic_tranlations }, () => {
			console.log("saved");
			updateHistoryContext();
		});
	});
}

async function getHistoryTranslations() {
	let { historic_tranlations } = await chrome.storage.sync.get(["historic_tranlations"]);
	return historic_tranlations;
}

function clearHistory() {
	console.log("clearing history");
	chrome.storage.sync.set({ historic_tranlations: {} }, () => {
		updateHistoryContext();
	});
}

function updateHistoryContext() {
	chrome.storage.sync.get(["historic_tranlations"], ({ historic_tranlations }) => {
		chrome.contextMenus.update("history_context", { title: `Translation History ${Object.values(historic_tranlations).length}`, onclick: historyContextClickHandler });
	});
}
