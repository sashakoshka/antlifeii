let panel,               // bottom panel
      minimap,           // minimap canvas
        minimapctx,
      foodSpan,
      foodBar,
      antSpan,
      antBar,
      controlPanel,      // shows info, controls about current selection
    view,                // either contains map or hill
    map,                 // main gameplay canvas
      mapctx,
      terrain_buf,
        terrain_bufctx,
      entity_buf,
        entity_bufctx,
    hill,                // anthil management canvas
      hillctx,
    buttonPause,         // pause button
    terrain,             // holds all tiles in the terrain
    ants,                // holds all ants
    antsMax,
    food,
    foodMax,
    
    touchStart = {},     // holds the touch start coordinates
    transStart = {},     // holds the position of the canvas contents at start
    touchOff   = {},     // holds the current touch coordinates
    trans  = {x:0, y:0}, // holds the current canvas contents position
    transE = {x:0, y:0}, // holds canvas position after easing function
    dragging   = false,  // if mouse is dragging
    viewMoving = false,  // if view is moving
    touchMoved,          // if the touch moved
    
    selectionType,       // what is currently being selected
    selectionObj,        // the object that is being selected

    easeInterval,        // easing interval
    tickInterval,        // animation interval
    
    animFrame            // goes from 0-15 every tick

const resizeObserver = new ResizeObserver((entries) => {
  const rect = entries[0].contentRect
  
  terrain_buf.width  = view.clientWidth
  terrain_buf.height = view.clientHeight
  terrain_buf.ant_paint()
  
  entity_buf.width  = view.clientWidth
  entity_buf.height = view.clientHeight
  entity_buf.ant_paint()
  
  map.width  = view.clientWidth
  map.height = view.clientHeight
  map.ant_paint()
  
  minimap.ant_paint()
})

async function initGame(slot) { // 0 will be multiplayer
  await fadeOut()
  setStyle(gamecss)
  scrub(document.body)
  
  // build terrain
  
  perlin.seed()
  terrain = new Array(256)
  for(let i = 0; i < terrain.length; i++) {
    terrain[i] = new Array(256)
  }
  for(let y = 0; y < terrain.length;    y++)
  for(let x = 0; x < terrain[y].length; x++) {
    if(Math.sqrt(Math.pow(x - 128, 2) + Math.pow(y - 128, 2)) < 4) {
      terrain[y][x] = 4
    } else {
      let num = perlin.get(x / 64, y / 64)
      if(num < -0.1) {
        terrain[y][x] = 1
      } else if(num < Math.random() / 20) {
        terrain[y][x] = 2
      } else {
        terrain[y][x] = 3
      }
    }
  }
  
  perlin.seed()
  for(let y = 0; y < terrain.length;    y++)
  for(let x = 0; x < terrain[y].length; x++) {
    let num = perlin.get(x / 64, y / 64)
    if(num < -0.2 + Math.random() / 10 && terrain[y][x] === 3) {
      terrain[y][x] = 4
    }
  }
  
  terrain[128][128] = 5
  
  // wipe entities
  ants = []
  
  // reset variables
  trans.x = Math.round((terrain   .length * -32 + window.innerWidth ) / 2)
  trans.y = Math.round((terrain[0].length * -32 + window.innerHeight) / 2)
  transE.x = trans.x
  transE.y = trans.y
  
  selectionType = 0
  selectionObj = 0
  
  animFrame = 0
  
  antsMax = 8192
  food = 16
  foodMax = 128
  
  // create UI elements
  
  document.addEventListener("mouseup", (e) => {
    e.preventDefault()
    dragging = false
  })
  document.addEventListener("touchend", (e) => {
    //e.preventDefault()
    dragging = false
  })
  
  view = document.createElement("div"); {
    view.setAttribute("id", "view")
    document.body.appendChild(view)
  }
  
  panel = document.createElement("div"); {
    panel.setAttribute("id", "panel")
    minimap = document.createElement("canvas"); {
      minimapctx = minimap.getContext("2d")
      minimap.ant_paint = minimap_paint
      minimap.setAttribute("width",  128)
      minimap.setAttribute("height", 128)
      minimap.setAttribute("id", "minimap")
      
      // click on the minimap to move
      minimap.addEventListener("mousedown", (e) => {
        let rect = e.target.getBoundingClientRect()
        
        trans.x -= Math.round(e.clientX - rect.left - 64.5) * 32
        trans.y -= Math.round(e.clientY - rect.top  - 64) * 32
      })
      
      minimap_paint()
      panel.appendChild(minimap)
    }
    
    // right of the minimap, has bars and info
    let panelRightCol = document.createElement("div"); {
      let barContainer = document.createElement("div"); {
        barContainer.setAttribute("id", "barcontainer")
      
        // shows amount of food
        foodSpan = document.createElement("span")
        barContainer.appendChild(foodSpan)
        foodBar = document.createElement("progress")
        barContainer.appendChild(foodBar)
        
        // shows amount of ants
        antSpan = document.createElement("span")
        barContainer.appendChild(antSpan)
        antBar = document.createElement("progress")
        barContainer.appendChild(antBar)
        
        updateBars()
        panelRightCol.appendChild(barContainer)
      }
      
      // shows info, controls about currently selected whatever
      controlPanel = document.createElement("div")
      controlPanel.setAttribute("id", "controlpanel")
      panelRightCol.appendChild(controlPanel)
      
      panel.appendChild(panelRightCol)
    }
    
    document.body.appendChild(panel)
  }
    
  map = document.createElement("canvas"); {
    mapctx = map.getContext("2d")
    map.ant_paint = map_paint
    
    // touch dragging to pan
    map.addEventListener("touchstart", (e) => {
      e.preventDefault()
      const touch = e.changedTouches[0]
      
      touchStart.x = touch.clientX
      touchStart.y = touch.clientY
      transStart.x = trans.x
      transStart.y = trans.y
      
      dragging = true
      touchMoved = false
    })
    map.addEventListener("touchmove", (e) => {
      e.preventDefault()
      const touch = e.changedTouches[0]
      trans.x = touch.clientX - touchStart.x + transStart.x
      trans.y = touch.clientY - touchStart.y + transStart.y
      touchMoved = true
    })
    map.addEventListener("touchend", (e) => {
      const touch = e.changedTouches[0]
      if(!touchMoved) {
        processTap(touch.clientX, touch.clientY)
      }
    })
    
    // right click and drag to pan
    map.addEventListener("mousedown", (e) => {touchMoved = false})
    map.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      
      touchStart.x = e.clientX
      touchStart.y = e.clientY
      transStart.x = trans.x
      transStart.y = trans.y
      
      dragging = true
      touchMoved = false
    })
    map.addEventListener("mousemove", (e) => {
      e.preventDefault()
      if(dragging) {
        trans.x = e.clientX - touchStart.x + transStart.x
        trans.y = e.clientY - touchStart.y + transStart.y
        touchMoved = true
      }
    })
    map.addEventListener("mouseup", (e) => {
      if(!touchMoved) {
        processTap(e.clientX, e.clientY)
      }
    })
    
    // should not stop when moving over panel
    panel.addEventListener("mousemove", (e) => {
      if(dragging) {
        e.preventDefault()
        trans.x = e.clientX - touchStart.x + transStart.x
        trans.y = e.clientY - touchStart.y + transStart.y
      }
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
    })
    
    // create terrain buffer
    terrain_buf = document.createElement("canvas"); {
      terrain_bufctx = terrain_buf.getContext("2d")
      terrain_buf.ant_paint = terrain_buf_paint
    }
    
    // create entity buffer
    entity_buf = document.createElement("canvas"); {
      entity_bufctx = entity_buf.getContext("2d")
      entity_buf.ant_paint = entity_buf_paint
    }
  }
  
  hill = document.createElement("canvas"); {
    hillctx = hill.getContext("2d")
    hill.ant_paint = hill_paint
  }
  
  view.appendChild(map)
  
  // create pause button
  buttonPause = document.createElement("button"); {
    buttonPause.setAttribute("class", "pause")
    buttonPause.addEventListener("click", async () => {
      await fadeOut()
      clearInterval(easeInterval)
      clearInterval(tickInterval)
      resizeObserver.disconnect()
      initMenu("title")
      await fadeIn()
    })
    document.body.appendChild(buttonPause)
  }
  
  // easing interval, for smooth panning
  easeInterval = setInterval(() => {
    if(trans.x !== transE.x || trans.y !== transE.y) {
      viewMoving = true
      transE.x += Math.round((trans.x - transE.x) / 2)
      transE.y += Math.round((trans.y - transE.y) / 2)
      terrain_buf.ant_paint()
      entity_buf.ant_paint()
      map.ant_paint()
      minimap.ant_paint()
      if(Math.abs(transE.x - trans.x) < 2) transE.x = trans.x
      if(Math.abs(transE.y - trans.y) < 2) transE.y = trans.y
    } else viewMoving = false
  }, 32) // around 30 fps
  
  tickInterval = setInterval(tick, 50)
  
  resizeObserver.observe(view)
  await fadeIn()
}

function minimap_paint() {
  let viewW = Math.round(view.clientWidth  / 32),
      viewH = Math.round(view.clientHeight / 32)
  
  let colC = Math.round(transE.x / -32 - (128 - viewW) / 2)
  let row  = Math.round(transE.y / -32 - (128 - viewH) / 2)
  let col
  
  for(let y = 0; y < 128; y++) {
    col = colC
    for(let x = 0; x < 128; x++) {
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
  
  minimapctx.fillStyle = "transparent"
  minimapctx.strokeStyle = "white"
  
  minimapctx.strokeRect(
    Math.round((128 - viewW) / 2) + 0.5, Math.round((128 - viewH) / 2) + 0.5,
    viewW, viewH
  )
}

function map_paint() {
  mapctx.clearRect(0, 0, map.width, map.height)
  mapctx.drawImage(terrain_buf, 0, 0)
  mapctx.drawImage(entity_buf, 0, 0)
}

function terrain_buf_paint() {
  terrain_bufctx.clearRect(0, 0, terrain_buf.width, terrain_buf.height)

  terrain_bufctx.save()
  terrain_bufctx.translate(transE.x, transE.y)
  
  // get borders for screen and round to nearest tile
  let borderNW = {
    x: Math.floor((0 - transE.x) / 32),
    y: Math.floor((0 - transE.y) / 32)}
  let borderSE = {
    x: Math.ceil((terrain_buf.width  - transE.x) / 32),
    y: Math.ceil((terrain_buf.height - transE.y) / 32)}
  
  // dont render tiles out of bounds
  if(borderNW.x < 0) borderNW.x = 0
  if(borderNW.y < 0) borderNW.y = 0
  if(borderSE.x >= terrain   .length) borderSE.x = terrain   .length
  if(borderSE.y >= terrain[0].length) borderSE.y = terrain[0].length
  
  // render all visible tiles
  for(let row = borderNW.y; row < borderSE.y; row++)
  for(let col = borderNW.x; col < borderSE.x; col++) {
    let tile = terrain[row][col]
    // check if air
    if(tile > 0) {
      terrain_bufctx.drawImage(texTiles[tile], col * 32, row * 32, 32, 32)
    }
  }
  
  terrain_bufctx.restore()
}

function entity_buf_paint() {
  entity_bufctx.clearRect(0, 0, entity_buf.width, entity_buf.height)
  
  entity_bufctx.save()
  entity_bufctx.translate(transE.x, transE.y)
  
  // get borders for screen and round to nearest tile
  let borderNW = {
    x: Math.floor((0 - transE.x) / 32) - 1,
    y: Math.floor((0 - transE.y) / 32) - 1}
  let borderSE = {
    x: Math.ceil((terrain_buf.width  - transE.x) / 32),
    y: Math.ceil((terrain_buf.height - transE.y) / 32)}
  
  for(let ant of ants) {
    if (
      ant.x > borderNW.x && ant.y > borderNW.y &&
      ant.x < borderSE.x && ant.y < borderSE.y
    ) {
      entity_bufctx.drawImage (
        texAnts[ant.type],
        (animFrame < 8) * 32 + (ant.cargoCount > 0) * 64, ant.dir * 32,
        32, 32,
        ant.x * 32, ant.y * 32,
        32, 32
      )
    }
  }
  
  if(selectionType > 0) {
    let selX = 0, selY = 0 // center of what is being selected
    switch(selectionType) {
      case 1: // anthill
        selX = 128 + 0.5
        selY = 128 + 0.5
        break
      case 2: // ant
        selX = selectionObj.x + 0.5
        selY = selectionObj.y + 0.5
        break
    }
    entity_bufctx.drawImage(
      texUI[0],
      (animFrame < 8) * 48, 0, 48, 48,
      selX * 32 - 24, selY * 32 - 32, 48, 48
    )
  }
  
  entity_bufctx.restore()
}

function hill_paint() {

}

function tick() {
  animFrame ++
  animFrame %= 16

  // tick ants
  for(let ant of ants) {
    ant.tick()
  }
  
  if(!viewMoving) {
    entity_buf.ant_paint()
    map.ant_paint()
  }
}

function updateBars() {
  foodSpan.innerText = "Food (" + food + "/" + foodMax + ")"
  foodBar.setAttribute("max", foodMax)
  foodBar.setAttribute("value", food)
  antSpan.innerText = "Ants (" + ants.length + "/" + antsMax + ")"
  antBar.setAttribute("max", antsMax)
  antBar.setAttribute("value", ants.length)
}

function processTap(x, y) {
  let selX = Math.floor((x - transE.x) / 32),
      selY = Math.floor((y - transE.y) / 32)
  
  selectionType = 0
  controlPanel.textContent = ""
  if(selX === 128 && selY === 128) {
    selectionType = 1
  } else {
    for(let ant of ants) {
      if(selX === Math.round(ant.x) && selY === Math.round(ant.y)) {
        selectionType = 2
        selectionObj = ant
      }
    }
  }
  
  switch (selectionType) {
    case 1:
      let makeAntButton = document.createElement("button"); {
        makeAntButton.innerText = "Make Ants"
        makeAntButton.addEventListener("click", (e) => {
          ants.push(new Ant(128, 128, 0))
        })
        controlPanel.appendChild(makeAntButton)
      }
      break
    case 2:
      let stats = "[Health: " + selectionObj.health +
                  "/" + selectionObj.maxHealth +
                  "] [Breath: " + selectionObj.breath +
                  "/" + 7 + "]\n"
      switch(selectionObj.type) {
        case 0:
          stats = "Worker Ant " + stats +
                  "Worker ants can collect food for the colony, but they " +
                  "cannot fight against hostile creatures."
          break
        case 1:
          stats = "Soldier Ant " + stats +
                  "Soldier Ants serve to protect the colony from hostile " +
                  "entities."
          break
        case 2:
          stats = "Builder Ant " + stats +
                  "Builder ants cannot collect food or fight, but can " +
                  "be used to upgrade the colony and terraform."
          break
      }
      controlPanel.innerText = stats
  }
  
  entity_buf.ant_paint()
  map.ant_paint()
}

if(urlParams.get("initGame")) {
  initGame(urlParams.get("initGame"))
} else {
  initMenu("title")
  fadeIn()
}
