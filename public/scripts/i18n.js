// Texts for the browser scripts, in the person's language.
//
// They come from config/locales/<language>.yml (key "js") through
// <body data-i18n="{...}">. Usage: plannerText("start_hint", { time: "09:00" }).
(function () {
  let texts = {};
  try {
    texts = JSON.parse(document.body.dataset.i18n || "{}");
  } catch (error) {
    texts = {};
  }

  window.plannerText = function (key, values) {
    const text = texts[key] || key;
    return text.replace(/%\{(\w+)\}/g, function (match, name) {
      return values && name in values ? String(values[name]) : match;
    });
  };
})();
