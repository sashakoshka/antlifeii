// fuck you apple! suck my cock!
document.addEventListener("gesturestart", (e) => {
  e.preventDefault()
})

const urlParams = new URLSearchParams(window.location.search);

function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))}
function scrub(el) {el.textContent=""}
async function fadeOut() {document.body.style.opacity = 0; await sleep(1000)}
async function fadeIn()  {document.body.style.opacity = 1}

function setStyle(css) {
  let sheet = document.getElementById("statestyle")
  if(sheet) document.head.removeChild(sheet)
  
  sheet = document.createElement("style")
  sheet.setAttribute("id", "statestyle")
  sheet.textContent = css
  
  document.head.appendChild(sheet)
}

function initMenu(menu) {
  setStyle(titlecss)
  switch(menu) {
    case "title":
      document.body.innerHTML = `
      <main>
        <center class=title>Ant Life II</center>
        <form class=menu>
          <input type=text name=name>
          <input type=password name=password>
          <input type=submit value=Login>
          <a onclick="initMenu('saves')">Play offline</a>
          <a onclick="initMenu('about')">About</a>
        </form>
      </main>`
      break
    case "saves":
      document.body.innerHTML = `
      <main>
        <div class=menu>
          <button onclick="initGame(1)">Slot 1</button>
          <button onclick="initGame(2)">Slot 2</button>
          <button onclick="initGame(3)">Slot 3</button>
          <button onclick="initGame(4)">Slot 4</button>
          <button onclick="initMenu('title')">&lt;&lt; Back</button>
        </div>
      </main>`
      break
    case "about":
      document.body.innerHTML = `
      <main>
        <div class=scroll>
          <p>Ant Life II is a fanmade sequel to Ant Life/Ants Life. It is licensed under the GPL, version 3.0.</p>
          <button onclick="initMenu('license')">View License</button>
          <button onclick="initMenu('title')">&lt;&lt; Back</button>
        </div>
      </main>
      `
      break
    case "license": {
      scrub(document.body)
      let main = document.createElement("main")
          main.style.width = "100%"
          main.style.maxWidth = "608px"
      let scroll = document.createElement("div")
          scroll.className = "scroll"
          scroll.style.maxWidth = "100%"
      let licensePre = document.createElement("pre")
          licensePre.className = "license"
          licensePre.innerText = lisence
      let back = document.createElement("button")
          back.innerText = "<< Back"
          back.onclick = () => {initMenu("about")}
      scroll.appendChild(licensePre)
      scroll.appendChild(back)
      main.appendChild(scroll)
      document.body.appendChild(main)
      break  
    }
  }
}

let panel,               // bottom panel
    view,                // either contains map or hill
    minimap,             // minimap canvas
      minimapctx,
    map,                 // main gameplay canvas
      mapctx,
    hill,                // anthil management canvas
      hillctx,
    buttonPause,         // pause button
    terrain,             // holds all tiles in the terrain
    
    touchStart = {},     // holds the touch start coordinates
    transStart = {},     // holds the position of the canvas contents at start
    touchOff   = {},     // holds the current touch coordinates
    trans  = {x:0, y:0}, // holds the current canvas contents position
    transE = {x:0, y:0}, // holds canvas position after easing function
    easeInterval         // easing interval

const resizeObserver = new ResizeObserver((entries) => {
  let rect = entries[0].contentRect
  let el   = view.firstChild
  
  el.width  = view.clientWidth
  el.height = view.clientHeight
  
  el.ant_paint()
})

async function initGame(slot) { // 0 will be multiplayer
  if(!urlParams.get("initGame")) await fadeOut()
  setStyle(gamecss)
  scrub(document.body)
  
  // build terrain
  terrain = new Array(256)
  for(let i = 0; i < terrain.length; i++) {
    terrain[i] = new Array(256)
  }
  for(let y = 0; y < terrain.length;    y++)
  for(let x = 0; x < terrain[y].length; x++)
    terrain[y][x] = Math.floor(Math.random() * 2) + 1
  
  terrain[128][128] = 5
  
  // reset variables
  trans.x = Math.round((terrain   .length * -32 + window.innerWidth ) / 2)
  trans.y = Math.round((terrain[0].length * -32 + window.innerHeight) / 2)
  transE.x = trans.x
  transE.y = trans.y
  
  // create UI elements
  view = document.createElement("div"); {
    view.setAttribute("id", "view")
    document.body.appendChild(view)
  }
  
  panel = document.createElement("div"); {
    panel.setAttribute("id", "panel")
    document.body.appendChild(panel)
  }
  
  minimap = document.createElement("canvas"); {
    minimapctx = minimap.getContext("2d")
    minimap.ant_paint = minimap_paint
    minimap.setAttribute("width",  96)
    minimap.setAttribute("height", 96)
    minimap.setAttribute("id", "minimap")
    minimap_paint()
    panel.appendChild(minimap)
  }
    
  map = document.createElement("canvas"); {
    mapctx = map.getContext("2d")
    map.ant_paint = map_paint
    
    map.addEventListener("touchstart", (e) => {
      e.preventDefault()
      let touch = e.changedTouches[0]
      
      touchStart.x = touch.clientX
      touchStart.y = touch.clientY
      transStart.x = trans.x
      transStart.y = trans.y
      
      map.ant_paint()
    })
    map.addEventListener("touchmove", (e) => {
      e.preventDefault()
      let touch = e.changedTouches[0]
      trans.x = touch.clientX - touchStart.x + transStart.x
      trans.y = touch.clientY - touchStart.y + transStart.y
      map.ant_paint()
    })
    map.addEventListener("wheel", (e) => {
      if(e.shiftKey) {
        trans.x -= e.deltaY * 2
        trans.y -= e.deltaX * 2
      } else {
        trans.x -= e.deltaX * 2
        trans.y -= e.deltaY * 2
      }
      trans.x = Math.round(trans.x)
      trans.y = Math.round(trans.y)
      map.ant_paint()
    })
    
    map.ant_paint()
  }
  
  hill = document.createElement("canvas"); {
    hillctx = hill.getContext("2d")
    hill.ant_paint = hill_paint
    hill_paint()
  }
  
  view.appendChild(map)
  
  buttonPause = document.createElement("button"); {
    buttonPause.setAttribute("class", "pause")
    buttonPause.addEventListener("click", async () => {
      await fadeOut()
      initMenu("title")
      clearInterval(easeInterval)
      await fadeIn()
    })
    document.body.appendChild(buttonPause)
  }
  
  easeInterval = setInterval(() => {
    if(trans.x !== transE.x || trans.y !== transE.y) {
      transE.x += Math.round((trans.x - transE.x) / 2)
      transE.y += Math.round((trans.y - transE.y) / 2)
      map.ant_paint()
      minimap.ant_paint()
      if(Math.abs(transE.x - trans.x) < 2) transE.x = trans.x
      if(Math.abs(transE.y - trans.y) < 2) transE.y = trans.y
    }
  }, 32) // around 30 fps
  
  resizeObserver.observe(view)
  await fadeIn()
}

function minimap_paint() {
  
  let viewW = Math.round(view.clientWidth  / 32),
      viewH = Math.round(view.clientHeight / 32)
  
  let colC = Math.round(transE.x / -32 - (96 - viewW) / 2)
  let row  = Math.round(transE.y / -32 - (96 - viewH) / 2)
  let col
  
  for(let y = 0; y < 96; y++) {
    col = colC
    for(let x = 0; x < 96; x++) {
      if(
        row < 0 || row >= terrain.length ||
        col < 0 || col >= terrain[0].length
      )    minimapctx.fillStyle = "black"
      else minimapctx.fillStyle = texColors[terrain[row][col]]
      
      minimapctx.fillRect(x, y, 2, 2)
      col++
    }
    row++
  }
  
  minimapctx.fillStyle = "none"
  minimapctx.strokeStyle = "white"
  
  minimapctx.strokeRect(
    Math.round((96 - viewW) / 2) + 0.5, Math.round((96 - viewH) / 2) + 0.5,
    viewW, viewH
  )
}

function map_paint() {
  mapctx.clearRect(0, 0, map.width, map.height);

  mapctx.save()
  mapctx.translate(transE.x, transE.y)
  
  let borderNW = {
    x: (0 - transE.x) / 32 - 1,
    y: (0 - transE.y) / 32 - 1
  }
  
  let borderSE = {
    x: (map.width  - transE.x) / 32,
    y: (map.height - transE.y) / 32
  }
  
  for(let row = 0; row < terrain.length; row++)
  for(let col = 0; col < terrain[row].length; col++) {
    let tile = terrain[row][col]
    // check if out of bounds
    if(
      tile > 0 &&
      col > borderNW.x && row > borderNW.y &&
      col < borderSE.x && row < borderSE.y
    ) mapctx.drawImage(texTiles[tile], col * 32, row * 32, 32, 32)
  }
  mapctx.restore()
}

function hill_paint() {

}

if(urlParams.get("initGame")) {
  initGame(urlParams.get("initGame"))
} else {
  initMenu("title")
  fadeIn()
}
