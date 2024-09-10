# Google Scholar - BibTeX to Clipboard

Adds a new button to your Google Scholar pages to directly add the BibTeX references to your clipboard. (This is a minimal modification of the [original script](https://github.com/henrieger/gscholar-bibtex-clipboard) by [Henrique Rieger](https://github.com/henrieger) that formats the copied BibTex in such a way that it can more directly be pasted into files).

## Installation

Add the [Tampermokey](https://www.tampermonkey.net/) extension to your browser. Then, click [this link](../../raw/main/gscholar-bibtex-clipboard.user.js) to install the script. A new tab should open asking for permission to install.

## General Usage

A new link with the text "BibTeX" will appear under each reference of your Google Scholar searches. Click it to copy the BibTeX to your clipboard.  

The first time you click on a "BibTex" link, Tampermonkey will ask for permission to use the script. Choose the option that suits you better, however, the "Always allow domain" option is prefered for a smooth experience. This will add the "googleusercontent.com" domain to the script's whitelist.

## Extended Usage

This script has been modified to remove the original "Import into BibTex" button, in favor of the direct copy-to-clipboard. If you want to keep the original button, you can change the script's code to add the new button instead of replacing the old one. To do so, change the following line in [the script](./gscholar-bibtex-clipboard.user.js):

```javascript
let remove_original=false;
```
