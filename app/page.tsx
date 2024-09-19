export default function Home() {
  return (
    <div>
      <h1>引入页面</h1>
      <a href="./home.html" target="_parent">首页</a>
      <iframe src="./iframe.html" />
    </div>
  );
}
