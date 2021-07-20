var texTiles = [null] // first el is null because air
for(let i = 1; i < src_texTiles.length; i++) {
  texTiles.push(new Image())
  texTiles[i].src = src_texTiles[i]
}

const texColors = [
  "black",
  "#506c50",
  "#6e86bb",
  "brown",
  "yellow",
  "white"
]
