
let translate_btn = document.querySelector("#translate_btn");
console.log("button found", translate_btn);

translate_btn.onclick = async  ()=> {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files:[ "contentScript.js"],
	});
};


document.addEventListener("selectionchange", (event)=>{
    console.log('selection triggered',event);
})

console.log('popup script loaded')