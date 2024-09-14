import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>
        <Link href="/home">home</Link>
      </div>
      <div>
        <Link href="/test">test</Link>
      </div>
    </div>
  );
}
