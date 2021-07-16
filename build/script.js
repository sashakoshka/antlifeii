const titlecss = `
body{margin:32px;background-image:var(--tex-grass-scroll)}
main{width:256px;margin:auto}

@media(min-height:512px){
  html,body{height:100%;width:100%;scroll:none}
  body{
    overflow:hidden;position:fixed;
    margin:0;display:flex;flex-direction:column;
    align-items:center;justify-content:center}
}
`
const gamecss = `
html,body{width:100%;height:100%;scroll:none}
body{
  overflow:hidden;position:fixed;
  margin:0}

#view{
  position:fixed;top:0;left:0;
  width:100%;height:calc(100% - 128px)}

#view canvas{
  width:100%;height:100%}

#panel{
  position:fixed;bottom:8px;left:0;
  width:calc(100% - 32px);height:96px;
  padding:16px;
  border-image:var(--tex-border) 8 / 8px / 0 repeat;
  background-image:var(--tex-wood0);
  box-shadow:0 2px 4px rgba(0,0,0,0.5)}

@media(min-width:544px){
  body{display:block}
  #view{
    height:100%}
  #panel{
    left:calc(50% - 272px);
    width:512px}
}
`
const src_texTiles = [null,
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEVQaERYdEhIXERMYDhAVCxQbFBcgFBYdFQ0SCBogFRIUDxohGAoVDhkjFg8TEBwjFhskGQoLBxwmFxkdFD7x310AAAB5ElEQVQ4yzVTCZLkMAgDBD6S9Oz1/7+uhNOZqWofgASSbZrZhJlbuJtFmg23YYYYhkotdDG1YBS/yyyVxixLHQTTk3ce/LOAT4VHYDNvmCMHY67t8Mjo4iqWjOVqE1mYOebF1IZgPgPer2w1FuF1CC5KW7dyW1PwwY8E4BhKCwSMrH3qXKyTd+TH/+0OQGvRB9w/qsftVumGbRRxjrPHYStMlSMs81mQ2UZyovhhahGEDLbb9jtFMtTG7i5uNf2rDovb1Qq+M1VRTmxYZb3oQuCkpQznTybiIHm4XiFELyI/Ku2qw3GkZSV/xTQr8r69x6CIPH2F5qD9bzZ0Juyh45bwiHtmq7Y5RTJixkDkjxekd8SKRzBRrXoP3gqkgyg7k52s6iuCcgB1Opq0FPwhgzNT+uADeYIs2ZIwWRaXzADfh+5pL6L7kq/UJmZwsWkSy1u3pmI+xOQiE1Vvbyn/mX/9LdN7mdBeO8jalRKBSSw519FlnhlAOpAQT3qUk+selbcA3ar3zvvFRJtGco1zQRXCnktEdLJ2A8vAXVrTQpMdXq/b+RziXm3xwPcB0J98cqQoHBeg/Em19ODsDwa+qoUeKuZp1/B4KxQKdnxofhlBFrQfReDf8qhWIfqF6XCQzrS2zH/slQh3YgBXkwAAAABJRU5ErkJggg==',
]
var texTiles = [null] // first el is null because air
for(let i = 1; i < src_texTiles.length; i++) {
  texTiles.push(new Image())
  texTiles[i].src = src_texTiles[i]
}
function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))}
function scrub(el) {el.textContent=""}
function fade(duration) {
  document.body.style.opacity = 0
  setTimeout(() => {document.body.style.opacity = 1}, duration ?? 0)
}

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
          <p>Ant Life II is a fanmade sequel to Ant Life/Ants Life. It is licensed under the GPL, version 3.0. Rigt click this page and select &quot;View Page Source&quot; for more information.</p>
          <button onclick="initMenu('title')">&lt;&lt; Back</button>
        </div>
      </main>
      `
      break
  }
}

var panel,              // bottom panel
      buttonSwitchView, // switch from map to hill
    view,               // either contains map or hill
    map,                // main gameplay canvas
      mapctx,
    hill,               // anthil management canvas
      hillctx,
    buttonPause,        // pause button
    terrain             // holds all tiles in the terrain

var resizeObserver = new ResizeObserver((entries) => {
  let rect = entries[0].contentRect
  let el   = view.firstChild
  
  el.width  = view.clientWidth
  el.height = view.clientHeight
  
  el.ant_paint()
})

async function initGame(slot) { // 0 will be multiplayer
  document.body.style.opacity = 0
  await sleep(1000)
  setStyle(gamecss)
  scrub(document.body)
  
  // build terrain
  terrain = new Array(256)
  for(let i = 0; i < terrain.length; i++) {
    terrain[i] = new Array(256)
    terrain[i].fill(1)
  }
  
  // create UI elements
  view = document.createElement("div"); {
    view.setAttribute("id", "view")
    document.body.appendChild(view)
  }
  
  panel = document.createElement("div"); {
    panel.setAttribute("id", "panel")
    document.body.appendChild(panel)
    
    buttonSwitchView = document.createElement("button"); {
      buttonSwitchView.innerText = "Manage Hill"
      panel.appendChild(buttonSwitchView)
    }
  }
    
  map = document.createElement("canvas"); {
    mapctx = map.getContext("2d")
    map.ant_paint = map_paint
    map_paint()
  }
  
  hill = document.createElement("canvas"); {
    hillctx = hill.getContext("2d")
    hill.ant_paint = hill_paint
    hill_paint()
  }
  
  view.appendChild(map)
  
  buttonPause = document.createElement("button"); {
    buttonPause.setAttribute("class", "pause")
    document.body.appendChild(buttonPause)
  }
  
  resizeObserver.observe(view)
  fade()
}

function map_paint() {
  for(var row = 0; row < terrain.length; row++)
  for(var col = 0; col < terrain[row].length; col++) {
    var tile = terrain[row][col]
    // TODO: check if out of bounds
    if(tile > 0)
      mapctx.drawImage(
        texTiles[tile],
        col * 32, row * 32, 32, 32)
  }
}

function hill_paint() {

}

initMenu("title")
fade(200)
