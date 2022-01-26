ver="$1"
if [ "$ver" == "" ]; then
	echo "specify server version"
	exit 1
fi
#
cd src
rm -f *.zip
cd viewer
zip -r ../viewer.zip viewer resources
cd ..
mkdir ../dist/$ver
cp -rf . ../dist/${ver}/
rm -r *.zip
