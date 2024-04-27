import prisma from "@/prisma/Client";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main> 
      <Link href="/signin">Signin</Link>
    </main>
  );
}
