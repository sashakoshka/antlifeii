all: clean js css
	cat html/begin.html html/apple.html         >  index.html
	echo "<style>"                              >> index.html
	cat build/style-min.css                     >> index.html
	echo "</style>"                             >> index.html
	
	cat html/middle.html                        >> index.html
	
	echo "<script>"                             >> index.html
	cat build/perlin-min.js                     >> index.html
	echo "</script><script>'use strict'"        >> index.html
	cat build/script-min.js html/end.html       >> index.html

js: clean-js
	echo "const titlecss = \`"                  >  build/script.js
	uglifycss style/title.css                   >> build/script.js
	echo \`                                     >> build/script.js
	
	echo "const gamecss = \`"                   >> build/script.js
	uglifycss style/game.css                    >> build/script.js
	echo \`                                     >> build/script.js
	
	echo "const src_texTiles = [null,"          >> build/script.js
	./base64.sh tex/tile/1.png       jsli       >> build/script.js
	./base64.sh tex/tile/2.png       jsli       >> build/script.js
	./base64.sh tex/tile/3.png       jsli       >> build/script.js
	./base64.sh tex/tile/4.png       jsli       >> build/script.js
	./base64.sh tex/tile/5.png       jsli       >> build/script.js
	echo "]"                                    >> build/script.js
	
	cat js/util.js js/lisence.js js/tex.js \
	    js/menu.js js/game.js                   >> build/script.js
	
	#cat build/script.js      > build/script-min.js
	uglifyjs build/script.js > build/script-min.js
	uglifyjs js/perlin.js    > build/perlin-min.js	

css: clean-css
	echo ":root{"                               >  build/style.css
	./base64.sh tex/grass-scroll.gif css        >> build/style.css
	./base64.sh tex/border.png       css        >> build/style.css
	./base64.sh tex/wood0.png        css        >> build/style.css
	./base64.sh tex/wood1.png        css        >> build/style.css
	./base64.sh tex/wood1-border.png css        >> build/style.css
	./base64.sh tex/pause.png        css        >> build/style.css
	./base64.sh tex/paper0.png       css        >> build/style.css
	./base64.sh tex/sky0.png         css        >> build/style.css
	echo "}"                                    >> build/style.css
	cat style/inline.css style/widget.css       >> build/style.css
	
	uglifycss build/style.css > build/style-min.css

clean: clean-js clean-css
	rm -f index.html

clean-js:
	rm -f build/script.js build/script-min.js build/perlin-min.js

clean-css:
	rm -f build/style.css build/style-min.css
