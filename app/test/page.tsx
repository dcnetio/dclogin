import Link from "next/link";

export default function Test() {
  return (
    <div>
      <div>
        <Link href="/home">home</Link>
      </div>
      <div>
        <Link href="/">back</Link>
      </div>
    </div>
  );
}
