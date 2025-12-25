# DC 登录中心

**_DCLogin_** 是一个去中心化的身份认证和云存储平台，主要解决以下问题：

#### 1. 统一的 Web3 身份登录

用户只需要一个账户就能登录所有支持 DCLogin 的 Web3 应用
类似于"用微信/谷歌账号登录"，但是去中心化的版本
不需要在每个应用都注册新账户

#### 2. 去中心化云存储服务

提供基于区块链和 P2P 网络的个人云存储空间
用户可以购买存储容量
数据存储在去中心化网络中，而不是某个公司的服务器

#### 3. 隐私保护的身份管理

用户完全控制自己的身份数据
使用零知识证明和可信执行环境(TEE)保护隐私
不依赖于中心化的身份提供商（如 Google、Facebook）

### 本地部署

<pre>
  <code>
  git clone https://github.com/dcnetio/dclogin.git
  cd dclogin
  npm install
  npm run dev
  启动成功后，打开浏览器访问 http://localhost:3000/
  </code>
</pre>
