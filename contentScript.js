translateWord();
async function translateWord() {
	console.log("translation started");
	word = document.getSelection().toString().trim();
	if (!isSingleWord(word)) throw new Error("Multiple word translation not supported");

	let translator = TranlationFactory().azureTranlate();
	let response = await fetchTranslation(translator.makeRequestObj(word));
	let parsed_response = translator.parseResponse(response);
	console.log("all clear and response is", parsed_response);
	saveQuery(word, parsed_response);
	alert("successful " + parsed_response);
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

function saveQuery(query, result) {
	chrome.storage.sync.set({ query, result }, () => {
		console.log("query saved");
	});
}
