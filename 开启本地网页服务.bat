@echo off
pushd  web
egret build
echo %CD%
popd
pause