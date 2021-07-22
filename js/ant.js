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
  }
}
