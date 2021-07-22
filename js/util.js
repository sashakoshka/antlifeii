const urlParams = new URLSearchParams(window.location.search);

function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))}
function scrub(el) {el.textContent=""}
async function fadeOut() {document.body.style.opacity = 0; await sleep(1000)}
async function fadeIn()  {document.body.style.opacity = 1}
function noDrag(el) {
  el.addEventListener("onselectstart", (e)=>{e.preventDefault();return false})
  el.addEventListener("onDrag",        (e)=>{e.preventDefault();return false})
  el.addEventListener("onDrop",        (e)=>{e.preventDefault();return false})
}

function setStyle(css) {
  let sheet = document.getElementById("statestyle")
  if(sheet) document.head.removeChild(sheet)
  
  sheet = document.createElement("style")
  sheet.setAttribute("id", "statestyle")
  sheet.textContent = css
  
  document.head.appendChild(sheet)
}

