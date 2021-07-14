console.log("contentscript injected");

document.addEventListener("selectionchange", selectionHandler);

function selectionHandler(event) {
	let _selection = document.getSelection().toString().trim();

	if (_selection.length) {
		console.log("selection fired with content", _selection);
		chrome.runtime.sendMessage({ title: "text_selected", payload: _selection });
	}
}
