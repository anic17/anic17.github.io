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

function loadContent(containerId, contentFile) {
  fetch(contentFile)
    .then(response => response.text())
    .then(data => {
      document.getElementById(containerId).innerHTML = data;
    })
    .catch(error => console.error("Error loading content: ", error));
}
function loadWebsite() {
  const names = {
    navbar: "/navbar.html",
    footer: "/footer.html",
    copyright: "/copyright.html",
  };
  for (const [div, filename] of Object.entries(names)) {
    loadContent(div, filename);
  }

  //let r = document.querySelector(':root').style.setProperty('--navbar-height', '70px');

}

window.onload = loadWebsite();
