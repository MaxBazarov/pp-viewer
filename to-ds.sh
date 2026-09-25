ver="$1"
if [ "$ver" == "" ]; then
	echo "specify server version"
	exit 1
fi
#
cd src
rm -f *.zip
cd viewer
zip -r ../viewer.zip js resources
cd ..
mkdir ../dist/$ver
cp -rf . ../dist/${ver}/
#
suop="$2"
if [ "$suop" == ""  ]; then
    scp -r ../dist/${ver} root@suop-ux.cloud.rt-dc.ru:/var/www/suop-ux/ds/pp-viewer/dist/
fi
#
rm -r *.zip