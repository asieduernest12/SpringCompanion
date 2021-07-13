# SpringCompanion
A chrome extension that assists with getting the translation for new words quickly while reading through resources online

Problem: this project is being made after realising i would like to read online resources in a language other than english for practice and not having a quick convinient tool
or approach to quickly glance the meaning of new or difficult words without having to open a new browser tab in order to use a search engine to look up the meaning of the words

this project is an immplementation of a chrome extension that will fit into the right button context menu of the browser which will have an entry for the SpringCompanion that opens
a flyout menu containing sample translations of highlighted word in english along with example sentences in the source language and english translations if possible.

This project is being developed initially with focus around portuguese word translations and will attempt to use a reletively available simple dictionary and api language and translations service. 

Feel free to contribute suggestion, bug reports, improvements and any other resource of your willingness.

# Functional requirements
1. search word (uses service/web worker,message passing), on search send message with word to search for ,
2. fetch word translation and example in language and add to history(storage api)
3. send response massage with fetch result to page 
4. show on screen using popup view (html card popup with dismiss, codepen) 


# Installtion
Todo: provide installation and usage steps

# References
[Chrome Extensions](https://developer.chrome.com/docs/extensions)
[Fetch Api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
[Rapid Api](https://rapidapi.com/collection/translation-apis?utm_source=google&utm_medium=cpc&utm_campaign=Alpha&utm_term=free%20translate%20api_e&gclid=CjwKCAjw87SHBhBiEiwAukSeUZaQT2XS2Pbv-SPW-cLs5TL5m4bSf4sxsSB2qD6i3Qd6idnMdK03HBoC3YkQAvD_BwE)
