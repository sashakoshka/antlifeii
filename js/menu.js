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
          <p>Ant Life II is a fanmade sequel to Ant Life/Ants Life. It is licensed under the GPL, version 3.0.</p><p>Uses <a href='https://github.com/joeiddon/perlin'>this library</a> by joeiddon for terrain generation.</p>
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
