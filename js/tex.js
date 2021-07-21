var texTiles = [null] // first el is null because air
for(let i = 1; i < src_texTiles.length; i++) {
  texTiles.push(new Image())
  texTiles[i].src = src_texTiles[i]
}

const texColors = [
  "black",
  "#6e86bb",
  "#e2bc91",
  "#506c50",
  "#5a4639",
  "white"
]
