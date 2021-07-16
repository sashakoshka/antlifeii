all: clean
	cat html/before-css.html           \
	    style/tex.css style/widget.css \
	    html/middle.html           >  index.html
	    
	    echo "const titlecss = \`" >> index.html
	    cat style/title.css        >> index.html
	    echo \`                    >> index.html
	    
	    echo "const gamecss = \`"  >> index.html
	    cat style/game.css         >> index.html
	    echo \`                    >> index.html
	    
	cat js/tex.js js/game.js           \
	    html/after-js.html         >> index.html
clean:
	rm -f index.html
