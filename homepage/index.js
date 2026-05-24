/* Cookie functions */

function setCookie(name, value, exp_days) {
  var d = new Date();
  d.setTime(d.getTime() + exp_days * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  var cname = name + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/`;

  window.localStorage.removeItem(name);
}

/* Engine selection */

const englist = [
  "DuckDuckGo",
  "Google",
  "Ecosia",
  "Brave",
  "Bing",
  "Yahoo",
  "Wikipedia",
  "Qwant",
];
const queryurl = [
  "https://duckduckgo.com/?q=",
  "https://www.google.com/search?q=",
  "https://www.ecosia.org/search?q=",
  "https://search.brave.com/search?q=",
  "https://www.bing.com/search?q=",
  "https://search.yahoo.com/search?p=",
  "https://en.wikipedia.org/w/index.php?search=",
  "https://www.qwant.com/?q=",
];

function setSearchEngine(search) {
  if (englist.includes(search)) {
    setCookie("engine", search, 20000);
    return true;
  }
  return false;
}

function setSelectDefault() {
  document.getElementById("settings_engine").value = getCookie("engine");
}

function getSearchEngine(init) {
  let engine = getCookie("engine");

  let baseurl = null;
  for (let k = 0; k < englist.length; k++) {
    if (engine == englist[k]) {
      baseurl = queryurl[k];
    }
  }
  if (!baseurl) {
    console.log("Invalid default search engine (got " + engine + ")");
    engine = englist[0]; // default to DuckDuckGo
  }
  if (init) {
    setSearchEngine(engine);
    setPlaceholder(engine);
    setSelectDefault();
  }

  return baseurl;
}

function getQuickLinks() {
  let ql = document.querySelectorAll(".checkboxes_td input");
  for (let i = 0; i < ql.length; i++) {
    // get the name of all the possible quick links
    let style = !(getCookie(ql[i].id) == "false"); // set style to true if the cookie does not exist or is true
    let icon_class = document.getElementsByClassName(ql[i].id)[0];
    if (style) {
      icon_class.setAttribute(
        "style",
        "visibility: visible; display: inline-block"
      );
    } else {
      icon_class.setAttribute("style", "visibility: hidden; display: none");
    }
    document.getElementById(ql[i].id).checked = style;
  }
}

function onLoadWindow() {
  getSearchEngine(true);
  getQuickLinks();
}

function getTLD(url) {
  url = url.replace(/^(https?:\/\/|ftp:\/\/)/, "");
  let domain = url.split("/")[0];
  let parts = domain.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : null;
}

function searchWeb(event) {
  if (event.key === "Enter") {
    let textfield = document.getElementById("searchbar").value.trim();

    if (textfield) {
      // Detect URLs
      const urlRegex =
        /\b(?:https?|ftp):\/\/[^\s]+|\bwww\.[^\s]+|\b(?!\d+\.\d+$)(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?\b/;
      const rejectRegex = /\.[^a-zA-Z]{2,}$/; // TLD must be at least 2 characters long A-Z
      const schemeRegex = /^(?:ftp|https?):\/\//i; // if URL starts with http/https/ftp scheme
      const tldRegex = /[^a-zA-Z]/; // TLD must not contain non-alphabetic characters
      const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(?::\d{1,5})?$/; // IPv4 addresses and optional port
      let url;
      let tld = getTLD(textfield);
      let ipRegexEval = ipRegex.test(textfield);
      if (
        ((urlRegex.test(textfield) && !rejectRegex.test(textfield)) ||
          ipRegexEval) &&
        !/\s/.test(textfield) &&
        ((!tldRegex.test(tld) &&
          tld.length >= 2 &&
          tld.length <= 63 &&
          !ipRegexEval) ||
          ipRegexEval)
      ) {
        url = textfield; // URL detected

        if (!schemeRegex.test(url)) {
          url = "http://" + url;
        }
      } else {
        url = getSearchEngine(false) + encodeURIComponent(textfield); // Text
      }
      window.location.href = url;
    }
  }
}

function choose(val) {
  if (val) return "block";
  else return "none";
}

function showSettings() {
  if (typeof showSettings.openc == "undefined") showSettings.openc = 0;
  showSettings.openc++;

  showSettings.openc %= 2;

  let showMenu = `
        visibility: visible;
        transition: all 0.3s ease;
        transform: translateX(0px);

    `;
  let hideMenu = `
        visibility: hidden;
        transition: all 0.3s ease;
        transform: 
    `;
  let vw = window.innerWidth;
  if (vw >= 1536) {
    hideMenu += "translateX(-230.4px);";
  } else if (vw < 1536 && vw > 992) {
    hideMenu += "translateX(-15vw);";
  } else {
    hideMenu += "translateX(-148.8px);";
  }

  let settings_height = document.documentElement.getBoundingClientRect().height;
  document.querySelector(".settings_menu").style.cssText =
    "min-height: " + settings_height + "px";

  const settings = document.querySelector(".settings_menu");

  showSettings.openc
    ? (settings.style.cssText = showMenu)
    : (settings.style.cssText = hideMenu);

  document
    .getElementById("settings_open")
    .setAttribute("style", "display: " + choose(showSettings.openc));
  document
    .getElementById("settings")
    .setAttribute("style", "display: " + choose(!showSettings.openc));

  if (showSettings.openc == 1)
    // so the status message slides back in and disappears
    setStatus("");
}

function setPlaceholder(eng) {
  let searchbar = document.getElementById("searchbar");
  searchbar.placeholder = "Search with " + eng;
  searchbar.value = ""; // clear the search bar
}

function applyCheckbox() {
  let a = document.querySelectorAll(".checkboxes_td input");
  for (let i = 0; i < a.length; i++) {
    // loop over the elements
    let style = a[i].checked;
    setCookie(a[i].id, style, 20000); // save the state of the checkbox
  }
  getQuickLinks();
}

function setStatus(text) {
  document.getElementById("status").innerHTML = text;
}

function applySettings() {
  let engine = document.getElementById("settings_engine").value;
  if (setSearchEngine(engine)) setStatus("Settings applied successfully");

  applyCheckbox();

  setPlaceholder(engine);
  setSelectDefault();
}

function resetSettings() {
  engine = englist[0]; // reset to DuckDuckGo
  setCookie("engine", engine, 20000);
  let ql = document.querySelectorAll(".checkboxes_td input");
  for (let i = 0; i < ql.length; i++) {
    // reset the quick links to default
    setCookie(ql[i].id, "true", 20000);
  }
  getQuickLinks();
  setPlaceholder(englist[0]);
  setSelectDefault();
  setStatus("Settings reset to default");
}

window.addEventListener("load", onLoadWindow(), false);
