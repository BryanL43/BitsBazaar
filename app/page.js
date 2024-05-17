"use client"
import { useRouter } from 'next/navigation'
import Image from 'next/image';

export default function Home() {
  const router = useRouter()

  return (
    <main>
      <div className='home'>
        <div className='intro'>
          <h1>Welcome to BitsBazaar</h1>
          <p>We provide high quality computer parts</p>
          <button onClick={() => router.push("/catalogue?search=all")}>Shop Now</button>
        </div>

        {/* <img id="slideImg" src='laptop1.jpeg'></img> */}
        <Image id="slideImg" width={300} height={300} src="/laptop1.jpeg" alt="Landing page laptop image"></Image>
      </div>
    </main>
  );
}