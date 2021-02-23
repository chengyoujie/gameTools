@echo off
pushd  web
egret startserver web  --port 3000 --serveronly
echo %CD%
popd
pause