chrome.runtime.onInstalled.addListener(async function () {
	// chrome.storage.sync.set({ color: "#3aa757" }, function () {
	// 	console.log("The color is green");
	// });

	// chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
	// 	chrome.declarativeContent.onPageChanged.addRules([
	// 		{
	// 			conditions: [
	// 				new chrome.declarativeContent.PageStateMatcher({
	// 					pageUrl: { hostEquals: "developer.chrome.com" },
	// 				}),
	// 			],
	// 			actions: [new chrome.declarativeContent.ShowPageAction()],
	// 		},
	// 	]);
	// });

	//create our context menus
	_contexts = [
        {id:"translate_context",title: "Translate word", contexts:["all"]},
        {id:"history_context",title: "Translation history", contexts:["all"]},
    ];

    _contexts.forEach((ctx) => {
        chrome.contextMenus.create(ctx,()=>{
            console.log('ctx created',ctx)
        });
    })


    
   
});
