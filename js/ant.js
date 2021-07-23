class Ant {
  constructor(x, y, type) {
    this.x = x
    this.y = y
    this.type = type
    
    switch(type) {
      case 0:
        maxHealth: 4
        break
      case 1:
        maxHealth: 8
        break
      case 2:
        maxHealth: 6
        break
    }
    
    this.heath = this.maxHealth
    this.cargo = null
    this.cargoCount = 0
    this.dir = 2
  }
  
  step(distance) {
    switch(this.dir) {
      case 0: this.y -= distance; break
      case 1: this.x += distance; break
      case 2: this.y += distance; break
      case 3: this.x -= distance; break
    }
  }
  
  face(dir) {
    dir = Math.floor(dir)
    this.dir = dir
  }
  
  tick() {
    this.step(0.125)
    if(Math.random() < 0.1) this.face(Math.random() * 4)
    if(this.y > terrain.length - 1) {
      this.dir = 0
      this.step(0.125)
    } else if(this.x > terrain[0].length - 1) {
      this.dir = 3
      this.step(0.125)
    } else if(this.y < 0) {
      this.dir = 2
      this.step(0.125)
    } else if(this.x < 0) {
      this.dir = 1
      this.step(0.125)
    }
    // TODO: check other bounds
  }
}
