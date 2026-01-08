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

