#!/bin/sh
#https://unix.stackexchange.com/questions/247843/how-to-generate-a-data-uri-from-an-image-file
mimetype=$(file -bN --mime-type "$1")
content=$(base64 -w0 < "$1")

varname=$(basename $1 | sed 's/\(.*\)\..*/\1/')

case "$2" in
  css)
    echo "--tex-$varname:url('data:$mimetype;base64,$content');"
    ;;
  *)
    echo "data:$mimetype;base64,$content"
    ;;
esac
