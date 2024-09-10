// ==UserScript==
// @name          gscholar-bibtex-clipboard
// @description   add a bibtex link in Google Scholar to Clipboard
// @homepage      https://github.com/ColinConwell/GScholar-BibTex-Copy
// @author        Henrique Rieger <henriquerieger2001@gmail.com>
// @author        Martin Monperrus <martin.monperrus@gnieh.org>
// @author        Nicolas Harrand <harrand@kth.se>
// @author        Colin Conwell <conwell@g.harvard.edu>
// @license       MIT
// @version       0.1
// @match         https://scholar.google.com/*
// @match         https://scholar.google.fr/*
// @match         https://scholar.google.se/*
// @match         https://scholar.google.de/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js
// @grant         GM_xmlhttpRequest
// @grant         GM_setClipboard
// ==/UserScript==

var $ = window.jQuery;

let remove_original=true;
// Set to true to keep the original "Import into BibTeX" link

function formatBibTeX(bibtex) {
  // Remove any existing line breaks
  bibtex = bibtex.replace(/\n/g, ' ').trim();

  // Extract the entry type and key
  let match = bibtex.match(/^(@\w+\s*{\s*[\w\-:]+\s*,)/);
  let entryStart = match ? match[1] : '';
  let rest = bibtex.slice(entryStart.length).trim();

  // Split the remaining content into fields
  let fields = rest.split(/,\s*(?=[a-z]+\s*=)/);

  // Start formatted BibTeX with entry type and key
  let formattedBibTeX = entryStart + '\n';

  // Format each field
  fields.forEach((field, index) => {
    field = field.trim();
    if (field) {
      // Remove trailing comma and closing brace if present
      field = field.replace(/,\s*$/, '').replace(/}\s*$/, '');
      formattedBibTeX += '  ' + field + (index < fields.length - 1 ? '},' : '') + '\n';
    }
  });

  // Close the entry
  formattedBibTeX += '}';

  return formattedBibTeX;
}

function main() {
  const url = new URL(window.location.href);
  const isFavsPage = url.searchParams.has("scilib");
  const authuser = url.searchParams.get("authuser");

  $(".gs_r").each((index, result) => {
    const text = $(result).find(".gs_rt").text();
    const whereList = $(result).find(".gs_fl");
    const where = $(whereList.get(whereList.length - 1));
    const container = $("<pre/>");
    where.after(container);

    const codeContainer = $('<div style="background-color: #EEEEEE; border-radius: 5px; padding: 0 10px 0 10px; border-color: darkgray; border-style: solid; border-width:1px;"/>');
    const code = $('<pre style="white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -pre-wrap;white-space: -o-pre-wrap;word-wrap: break-word;"/>');
    codeContainer.append(code);

    const noteLink = $('<a href="javascript:void(0)">Copy BibTeX</a>');
    noteLink.click(() => {
      const elem = $(result).find("a.gs_nph").get(0);
      const articleId = $(result).attr("data-aid");
      const citationId = $(result).attr("data-cid");

      let url;
      if (isFavsPage) {
        url = "https://scholar.google.com/scholar?scila=" + citationId + "&output=cite";
      } else {
        url = "https://scholar.google.com/scholar?q=info:" + articleId + ":scholar.google.com/&output=cite";
      }

      if (authuser != null) {
        url += "&authuser=" + authuser;
      }

      $.ajax({ "url": url })
        .done((data) => {
          const citationUrl = $(data).find(".gs_citi").attr("href");
          GM_xmlhttpRequest({
            method: "GET",
            url: citationUrl,
            onload: function (responseDetails) {
              const bibtex = responseDetails.responseText;
              const formattedBibTeX = formatBibTeX(bibtex);
              code.text(formattedBibTeX);
              container.after(codeContainer);
              container.text("-- Copied BibTeX to clipboard! --\n");

              // Copy formatted BibTeX to clipboard
              GM_setClipboard(formattedBibTeX);
            },
          });
        });
    });

    where.append(noteLink);

    // Remove the original "Import into BibTeX" link if flag is set
    if (remove_original) {
      where.find('a.gs_nta.gs_nph').filter(function() {
        return $(this).text() === 'Import into BibTeX';
      }).remove();
    }

  });
}

main();