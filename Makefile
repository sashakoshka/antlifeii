all: clean js css
	cat html/before-css.html build/style.css html/middle.html build/script.js \
	    html/after-js.html                      >  index.html

js: clean-js
	echo "const titlecss = \`"                  >  build/script.js
	cat style/title.css                         >> build/script.js
	echo \`                                     >> build/script.js
	
	echo "const gamecss = \`"                   >> build/script.js
	cat style/game.css                          >> build/script.js
	echo \`                                     >> build/script.js
	
	echo "const src_texTiles = [null,"          >> build/script.js
	./base64.sh tex/tile/1.png       jsli       >> build/script.js
	echo "]"                                    >> build/script.js
	
	cat js/tex.js js/game.js                    >> build/script.js

css: clean-css
	echo ":root{"                               >  build/style.css
	./base64.sh tex/grass-scroll.gif css        >> build/style.css
	./base64.sh tex/border.png       css        >> build/style.css
	./base64.sh tex/wood0.png        css        >> build/style.css
	./base64.sh tex/wood1.png        css        >> build/style.css
	./base64.sh tex/wood1-border.png css        >> build/style.css
	./base64.sh tex/pause.png        css        >> build/style.css
	./base64.sh tex/paper0.png       css        >> build/style.css
	echo "}"                                    >> build/style.css
	cat style/inline.css style/widget.css       >> build/style.css

clean: clean-js clean-css
	rm -f index.html

clean-js:
	rm -f build/script.js

clean-css:
	rm -f build/style.css
