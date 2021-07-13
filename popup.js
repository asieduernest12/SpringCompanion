// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//     // let color = element.target.value;
//     // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     //   chrome.tabs.executeScript(
//     //       tabs[0].id,
//     //       {code: 'document.body.style.backgroundColor = "' + color + '";'});
//     // });
//     alert('click working')
//   };

//inject script

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