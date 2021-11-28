server=root@mbazarov.net:/app/teplo500/web/figma/demo-station/code-hosting
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
zip -r viewer.zip viewer/viewer viewer/resources
rsync -e "ssh -p 12322" -r *  $url
