npm config get registry
npm config set registry=http://registry.npmjs.org
echo '请进行登陆相关操作'
npm login
echo 'publish......'
npm publish
npm config set registry=https:registry.npm.taobao.org
echo 'finished!'
exit