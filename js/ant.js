let antsCount = 0

class Ant {
  constructor(x, y, type) {
    this.x = x
    this.y = y
    this.lastLand = {x: 0, y: 0}
    this.type = type ?? 0
    
    // have a unique ant id
    this.id = antsCount ++
    
    switch(type) {
      case 0:
        this.maxHealth = 4
        break
      case 1:
        this.maxHealth = 8
        break
      case 2:
        this.maxHealth = 6
        break
    }
    
    this.health = this.maxHealth
    this.cargo = null
    this.cargoCount = 0
    this.dir = 2
  }
  
  hurt(damage) {
    this.health -= damage
    if(this.health <= 0) this.die()
  }
  
  die() {
    ants = ants.filter((ant) => {
      return ant.id !== this.id
    })
  }
  
  get tileOn() {
    return terrain[Math.round(this.y)]?.[Math.round(this.x)] ?? 0
  }
  
  step(distance) {
    if(this.tileOn < 3) distance /= 2 // move slower on sand
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
    let tile = this.tileOn
    if(tile === 1) {
      let xr = Math.round(this.x)
      let yr = Math.round(this.y)
      
      if(this.lastLand.x < this.x) {
        this.face(3)
      } else if(this.lastLand.x > this.x) {
        this.face(1)
      } else if(this.lastLand.y < this.y){
        this.face(0)
      } else {
        this.face(2)
      }
      
      if(Math.random() < 0.1) this.hurt(1)
    } else {
      this.lastLand.x = this.x
      this.lastLand.y = this.y
      if(Math.random() < (tile === 2 ? 0.01 : 0.02)) // turn slower on sand
        this.face(Math.random() * 4)
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
    }
  }
}
