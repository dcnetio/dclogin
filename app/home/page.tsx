import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>
        <Link href="/test">test</Link>
      </div>
      <div>
        <Link href="/">back</Link>
      </div>
    </div>
  );
}
