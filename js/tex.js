const texTiles = [null] // first el is null because air
for(let i = 1; i < src_texTiles.length; i++) {
  texTiles.push(new Image())
  texTiles[i].src = src_texTiles[i]
}

const texAnts = []
for(let i = 0; i < src_texAnts.length; i++) {
  texAnts.push(new Image())
  texAnts[i].src = src_texAnts[i]
}

const texUI = []
for(let i = 0; i < src_texUI.length; i++) {
  texUI.push(new Image())
  texUI[i].src = src_texUI[i]
}

const texColors = [
  "black",
  "#6e86bb",
  "#e2bc91",
  "#506c50",
  "#5a4639",
  "white"
]
