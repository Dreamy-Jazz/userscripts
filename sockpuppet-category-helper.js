/*
Script by Dreamy Jazz with contributions by Writ Keeper
Replaces userlinks in sockpuppet categories with uses of the checkuser template.
Version 1.3.5
*/
$(document).ready(function() {
	mw.loader.using( [
	'mediawiki.api',
	'mediawiki.util',
] ).then( async () => {
 	if (mw.config.get('wgPageName').startsWith('Category:Wikipedia_sockpuppets_of') || mw.config.get('wgPageName').startsWith('Category:Suspected_Wikipedia_sockpuppets_of')) {
		$("div#mw-pages a[href^='/wiki/User:']").each(async function (index, element) {
			let text = $(element).text().replace("User:", "");
			if (mw.util.isIPAddress(text)) {
				text = "{{checkip|" + text + "}}";
			} else {
				text = "{{checkuser|" + text + "}}";
			}
			let value = await getParsedTemplateText(text);
			let $new = $(value);
			$(element).parent().prepend($new);
			$(element).attr("style", "display:none");
			if ($(element).attr("class") !== undefined) {
				$new.find('.cuEntry .plainlinks:nth-child(1) a').addClass($(element).attr("class"));
			}
    		});
  	}
.});
});

async function getParsedTemplateText(wikitext) {
	const api = new mw.Api();
	const response = await api.get({
		action: "parse",
		format: "json",
		prop: "text",
		text: wikitext,
		wrapoutputclass: "",
		disablelimitreport: 1,
		disableeditsection: 1,
		contentmodel: "wikitext"
	});
	return response.parse.text["*"];
}
