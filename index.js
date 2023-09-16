function switchDisp(visible) {
  let dsp = "none;";
  let hdn = "hidden;";
  if (visible) {
    dsp = "block";
    hdn = "visible;";
  }
  let config = "display: " + dsp + "visibility: " + hdn;
  return config;
}

function showNavbar() {
  if (typeof showNavbar.openc == "undefined") {
    showNavbar.openc = 0;
  }
  showNavbar.openc++;
  showNavbar.openc %= 2;

  document.querySelector(".navbar_cross").style.cssText = switchDisp(
    showNavbar.openc
  );
  document.querySelector(".navbar_menu").style.cssText = switchDisp(
    !showNavbar.openc
  );
  document.querySelector(".navbar").style.cssText = switchDisp(
    !showNavbar.openc
  );
}

function loadFile(filename, divname) {
  let file = new XMLHttpRequest();
  file.open("GET", `${filename}.html`);
  var changeval = document.getElementById(divname);
  if(changeval == null)
  {
	changeval.innerHTML = `Cannot find '${divname}' div`;
  }
  file.onreadystatechange = function () {
    changeval.innerHTML = file.responseText;
  };
  file.onerror = function () {
	changeval.innerHTML = `Failed to retrieve file contents from '${filename}.html'`;
	console.log("Error : " + file.responseText);

  };
  file.send();
}

function loadWebsite() {
  let divnames = ["navbar", "footer", "copyright"];
  for (let div of divnames) {
    loadFile(div, div);
  }
}

window.onload = loadWebsite();
