docker 说明：
docker build --platform linux/amd64 -t wallet-web .

docker save -o wallet-web.tar wallet-web

scp wallet-web.tar beiniao@192.168.31.31:/home/beiniao/work/dclogin

在服务器中：
docker load -i wallet-web.tar

docker run -d \
 --name wallet-web \
 --network host \
 wallet-web

在访问浏览器端：

配置 Chrome 允许不安全的 HTTP (仅限开发调试)
如果你必须用 192.168.x.x 测试（比如你要用手机连电脑调试），你需要修改浏览器的 Flag 配置：

在 Chrome 地址栏输入：chrome://flags/#unsafely-treat-insecure-origin-as-secure
在 Insecure origins treated as secure 输入框中填入你的地址：
http://192.168.31.31:3000
将右侧下拉菜单改为 Enabled。
点击右下角的 Relaunch 重启浏览器。
