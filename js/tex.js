"use strict"

var texTiles = [null] // first el is null because air
for(let i = 1; i < 2; i++) {
  texTiles.push(new Image())
  texTiles[i].src = "tex/tile/" + i + ".png"
}
