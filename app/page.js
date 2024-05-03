import prisma from "@/prisma/Client";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main> 
      <div className='home'>
        <div className='intro'>
            <h1>Welcome to BitsBazaar</h1>
            <p>We provide high quality computer parts</p>
            <button>Shop Now</button>
        </div>

        <img id="slideImg" src='laptop1.jpeg'></img>
      </div>
    </main>
  );
}
