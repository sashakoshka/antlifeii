all: clean
	cat html/before-css.html                    >  index.html
	
	./base64.sh tex/grass-scroll.gif css        >> index.html
	./base64.sh tex/border.png       css        >> index.html
	./base64.sh tex/wood0.png        css        >> index.html
	./base64.sh tex/wood1.png        css        >> index.html
	./base64.sh tex/wood1-border.png css        >> index.html
	./base64.sh tex/pause.png        css        >> index.html
	echo "}"                                    >> index.html
	cat style/widget.css html/middle.html       >> index.html
	
	echo "const titlecss = \`"                  >> index.html
	cat style/title.css                         >> index.html
	echo \`                                     >> index.html
	
	echo "const gamecss = \`"                   >> index.html
	cat style/game.css                          >> index.html
	echo \`                                     >> index.html
	
	cat js/tex.js js/game.js html/after-js.html >> index.html

js:
	

css:
	

clean:
	rm -f index.html build/*
