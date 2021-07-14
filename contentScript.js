console.log("contentscript injected");

document.addEventListener("selectionchange", selectionHandler);
insertSCModalFoundation();

function selectionHandler(event) {
	let _selection = document.getSelection().toString().trim();

	if (_selection.length) {
		console.log("selection fired with content", _selection);
		chrome.runtime.sendMessage({ title: "TEXT_SELECTED", payload: _selection });
	}
}

chrome.runtime.onMessage.addListener((req, sender, res) => {
	console.log("responding to render message");

	debugger;
	switch (req.title) {
		case "SHOW_TRANSLATION": {
			showTranslationModal(req);
			break;
		}

		case "SHOW_HISTORY": {
			showHistoryModal(req);
			break;
		}
		default: {
			console.log("No a valid SpringCompanion Option");
		}
	}
});

function showTranslationModal({ title, payload }) {
	let payload_html = transformTranslationResults([payload]);
	let content = makeModalContent(title, payload_html);
	showModal(content);
}

function transformTranslationResults(translation_results) {
	return translation_results.map((p) => {
		return `
			<div className="tranlation">
				<span className="translation__input">${p.input}</span>
				<span className="translation__output">${p.output}</span>
			</div>
		`;
	});
}
function showHistoryModal({ title, payload }) {
	let payload_html = transformTranslationResults(payload);
	let content = makeModalContent(title, payload_html);
	showModal(content);
}

function dismissModal() {
	let foundation = document.querySelector(".sc_modal_foundation");
	foundation.classList.remove("show_foundation");
}

function showModal(modal_content) {
	let foundation = document.querySelector(".sc_modal_foundation");
	foundation.innerHTML = modal_content;
	foundation.classList.add("show_foundation");
}

function makeModalContent(title, translations_html) {
	return `
		<div id="popup2" class="overlay light">
			<a class="cancel" href="#"></a>
			<div class="popup">
				<h2>${title}</h2>
				<div class="content">
				${translations_html}
				</div>
			</div>
		</div>
	`;
}
function insertSCModalFoundation() {
	// let foundation = '<div className="sc_modal_foundation"></div>';
	let foundation = document.createElement("div");
	foundation.classList.add("sc_modal_foundation");
	document.querySelector("body").appendChild(foundation);
	console.log("foundation inserted", document.querySelector(".sc_modal_foundation"));
}
