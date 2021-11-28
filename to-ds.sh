server=www-data@mbazarov.net:/app/teplo500/web/figma/demo-station/code-hosting
#
ver="$1"
if [ "$ver" == "" ]; then
	echo "specify server version"
	exit 1
fi
url="${server}/${ver}/"
#
cd dist
rm -f *.zip
cd viewer
zip -r ../viewer.zip viewer resources
cd ..
rsync -e "ssh -p 12322" -r *  $url
rm -r *.zip
