all: clean
	cat html/before-css.html \
	    style/font.css style/tex.css style/widget.css \
	    html/middle.html     \
	    js/tex.js js/game.js \
	    html/after-js.html   \
	    > index.html
clean:
	rm -f index.html
