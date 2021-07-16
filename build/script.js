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
  margin:0;
  background-image:var(--tex-sky0)}

#view{
  position:fixed;top:0;left:0;
  width:100%;height:calc(100% - 128px)}

#view canvas{
  width:100%;height:100%}

#panel{
  position:fixed;left:0;bottom:0;
  width:calc(100% - 32px);height:96px;
  padding:16px;
  border-image:var(--tex-border) 8 / 8px / 0 repeat;
  background-image:var(--tex-wood0);
  box-shadow:0 2px 4px rgba(0,0,0,0.5);
  transition:bottom 0.2s}

@media(min-width:544px){
  body{display:block}
  #view{
    height:100%}
  #panel{
    left:calc(50% - 272px);bottom:8px;
    width:512px}
}
`
const src_texTiles = [null,
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEVQaERYdEhIXERMYDhAVCxQbFBcgFBYdFQ0SCBogFRIUDxohGAoVDhkjFg8TEBwjFhskGQoLBxwmFxkdFD7x310AAAB5ElEQVQ4yzVTCZLkMAgDBD6S9Oz1/7+uhNOZqWofgASSbZrZhJlbuJtFmg23YYYYhkotdDG1YBS/yyyVxixLHQTTk3ce/LOAT4VHYDNvmCMHY67t8Mjo4iqWjOVqE1mYOebF1IZgPgPer2w1FuF1CC5KW7dyW1PwwY8E4BhKCwSMrH3qXKyTd+TH/+0OQGvRB9w/qsftVumGbRRxjrPHYStMlSMs81mQ2UZyovhhahGEDLbb9jtFMtTG7i5uNf2rDovb1Qq+M1VRTmxYZb3oQuCkpQznTybiIHm4XiFELyI/Ku2qw3GkZSV/xTQr8r69x6CIPH2F5qD9bzZ0Juyh45bwiHtmq7Y5RTJixkDkjxekd8SKRzBRrXoP3gqkgyg7k52s6iuCcgB1Opq0FPwhgzNT+uADeYIs2ZIwWRaXzADfh+5pL6L7kq/UJmZwsWkSy1u3pmI+xOQiE1Vvbyn/mX/9LdN7mdBeO8jalRKBSSw519FlnhlAOpAQT3qUk+selbcA3ar3zvvFRJtGco1zQRXCnktEdLJ2A8vAXVrTQpMdXq/b+RziXm3xwPcB0J98cqQoHBeg/Em19ODsDwa+qoUeKuZp1/B4KxQKdnxofhlBFrQfReDf8qhWIfqF6XCQzrS2zH/slQh3YgBXkwAAAABJRU5ErkJggg==',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAMFBMVEVifrhpgbVohL5uhrttird0jMFujsF0j715k8h5lMN9lr9/m8qEnMWGodGKo8yTq9RDlxW2AAACF0lEQVQozwXBX0gTcRwA8O9vo6S3322NrCDcrlW+3fnt2C4plIrRi3/269dtiL0sypfA44h12KIaYyehPaxr92tMH32qF5EMsXeJ7EFCpVwPEf3RTQgiI/X6fIAxjWtZe+FHpvbRY1oN4ulAQnja2EbL2HqdLAuIMTSEmxlb/DwhyinHAyN1it9uCbtQu9shTdRb4J43DXsTQ+caCTPbcJdh9nTFEbmuYqSCIqfZa5ALN7b/Mt3VEFdV2tcDM1F/+rctuMksFiM1hH/8ExYTi5t8fJ1LMACQaFpyWu1c4+ziKyVMJAgPCZZk2uChAQhUICBDfHlv9v6KDEfeSGQwmD4IyYS3NmmpFM4QIAHRCyUWt4XaZhIKpJdEAKrj2tSqemxfIZeUdkkC4OWK5qWPvs/3PSDywtxZyBphfetZxJmaGyQSv5GE3Yo0cpPfuowPKQ2WFAL+LNHF9iNKeigGPRyBlbp7x2iOEqoSiFzNp4BN7y85LkOKhKZkKQzY7fszLj61a2ZnkcIF6P9u1G03FCvgPd+ScRKe/IJ2z9Xre2/1L9LxkgrcCiW9ql1/4Q8zPKyVATNB43rTM4ZrVYXMP38HHSfM7NAO4pUNM2c0vBbQA9/EPO9ibdbJJaUr+wFox8b2DnbPGYjrKvYrEA3503/0nzbLu1YUHBmcwi6vXmu03MetKglWYvD15Up8XWT8URzfDdgD0n8/w80Z82zgSAAAAABJRU5ErkJggg==',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAMFBMVEVBLyNJNipKNyZPOypOOy9PQTNTQDNVQS9aRjlWSDpYSDVeTjtiTT9eT0BqWUt2ZlfBjTP+AAACK0lEQVQozwEgAt/9AED1YjzNR066OkaFTdQ4kdkAVfx4WVTl3mwWOqQUk13A7ACN5Vg0HWbKRibZxSxcw9TmAGGZwmNziTYFF4i23c2FtFoAYuYRQUGB1mVZg1DldxiByAAUQFRRO81JdowBz9RlaBNQABgH3NRu0MiN5QX2lUldCEMASJjtdGld/VyQnNGIM4YYnABniLswyX6ITMS4XjyGOSxaAOnpgRNn0waakFWGnSlMzpwAhKSEUYxd3IRE5lzUJVlhlwC89n0XgRBDFJ6FyU1myFjtAOxhSEyUQZiXHAXBnIDw3oYA6VHum4OryOztEZHJldb8UQAiAVERAYFcVEQMt2eg2CQAAEbtFxFc4DtKITqFZGOEZ94AbZUb1NlROGQcGY2Q/HtehAB2Y34YR0ZK7UEzyEnjTIVXAHdlVpRMj4/kWIWAyRR4LGEAFBhdykUxFgKAFKese5QXJwBBRORkmZ586YDoyMmDFVUXAG1CWRJ3OVEcE9nVVBETbkUA5mjkbPbFFbss5UbJEhjtIwCUTHWVR6bc5VB0aKIW7+BtAFhozBSRcR6ENsQ2ZS3pXFYAiR6VwcDZ7RZc0FThnIjtSwBw3D0UnGkREUgk39bsHIFeABRkAx19vEHBfRnBRkUImBQAVfWFTc5SHcVlWsSZ2E6OnQBA7JM3UWWurSckpmSAN5DMAI3sTWdM5OlJBoyhGJncwe0AhMWBFDkWxyMX0daZjGXVk63I8diD42OVAAAAAElFTkSuQmCC',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAMFBMVEXhrIfjtYDjtYblto/ivJHivJfhvJ7ewqfiwpzhxKPkx6zlyrXizLDjz7jo07zp18YLrQ+cAAACKUlEQVQozwXB0U8ScRwA8O9j/0K9u2lPbXiKPhaE0LmaHOcd4nqAQ06opuaZgHMroaG22rjfcb/fwB7yZNyiFwOnwnwCOqdzU6ezmT201bD50hrJwtXnAw8un9PlwEOD59VQxYGOAV+RRPzoi9vchwMa2S9DtE64fiXHWc+VYb5SvQRX6tDni7AdPdmT9BnW5iFZuMP4VqpZjzx3IvW+C0O3V0068hlR9+4d8NjyBrrbNiqv93P5xrU/xZczLAM43JoTyVUKZSTDihw6jIZ3bq8v5ehCZIGIigdDvS6zQuF6dozPznbQ5RIktWVZz8wo4lrK8GOfCjuNYI9k8lJpaXdI1Mk5tJZD7kkmUnNT2gz69bUCdefPaIHUdktWGU/XmghMXU9NVm2Utd7IJV4cm24Bd8FY3Ae0OODXJpGA9yA9nVnRk31KyL453vJkEIjCqxF+MHGRnNNtv+elGPACVjxLH76lDJRzBegYUDZicBzbOXEXpYlid4GJOZL1x+n1sc/vCXJRnZB3TVGx+ZjHaZwIFP+Wg0bg+6NmhjUczZG88+aFBYpDqvZscmtjANmT5n+NKJBgybUq39eEKsb0D6JCalhdXc6edi1oTDEY3eiHgTLtjxCzxda2dXzeW3kCfqlzMaE7C9j9adDeMcWC1PQtnvloTVW0yM7CZgmEFkooqdnFeDsJTPSMb0L4r5u5t37K2bdR79r2xxYEpjUqHkdsO8pNpdWK/B9+7RKcG5toXgAAAABJRU5ErkJggg==',
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAMFBMVEUAAAAZAAAbFQsmHBQzJRtBLh1AMCVOOy9QOypMPzJYRzRbRjpWSDtfTkFnWUx1aVwIsgIBAAABq0lEQVQoz03Qv2/TUBAH8C8MSGxI/AFElBlVTYWExAI2QyXGgmBEmBdMglhQ7DY/Rmq5YkOBh52sJpVYY7VumNrEgee3mii4bImg/jGiSq0hQBNz2310d7o7lI/UV4Fa39KV7Zq/2f+Ktyeb7za+H1QKuqW4zU6ETz8MWS5rhQesrTe/vJ/AZvvSXSIu31Ys70Pb34LqS0I+L+SXJamnrdsOlBeisLSE3MLFFUmuPGmgQMhN/I3LC9eMpyoU8noRp3GFFj2ohMzhnLmuY9wRLszgfPOjh/Lqo9xpfqbEfRfW3uqsANfjIMJ0jazlKB3BF6V5BeJ0A4+FWxnwEQFR8hm0ogNUpf/gamLBksQMLoUutHtCbg7PPRtlImbAXW0Ke4sZDFR0G3J2HGutYUJ7D2dQ8iIN/Sql5N+UGzweN2FUB3I4nnadvZPw0DCwWx/0wjSlZpikkRPpeBmYDR6HQRL/Oo4q7RbeKCslk7Pjb8kJo8XPKujPoclpPWZ8wkb1Py+M+kqDcs9cc5SOtr+D7mHNqUwOTdnpP2OBHcPZtgu14s59beiz7u7Q/Q1lM9KYOOscXwAAAABJRU5ErkJggg==',
]
var texTiles = [null] // first el is null because air
for(let i = 1; i < src_texTiles.length; i++) {
  texTiles.push(new Image())
  texTiles[i].src = src_texTiles[i]
}
const urlParams = new URLSearchParams(window.location.search);

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
  if(!urlParams.get("initGame")) await sleep(1000)
  setStyle(gamecss)
  scrub(document.body)
  
  // build terrain
  terrain = new Array(256)
  for(let i = 0; i < terrain.length; i++) {
    terrain[i] = new Array(256)
    terrain[i].fill(1)
  }
  terrain[32][32] = 5
  
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

if(urlParams.get("initGame")) {
  initGame(urlParams.get("initGame"))
} else {
  initMenu("title")
  fade(200)
}
