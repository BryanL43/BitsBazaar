"use client"
import { useRouter } from 'next/navigation'

export default async function Home() {
  const router = useRouter()

  return (
    <main>
      <div className='home'>
        <div className='intro'>
          <h1>Welcome to BitsBazaar</h1>
          <p>We provide high quality computer parts</p>
          <button onClick={() => router.push("/catalogue?search=all")}>Shop Now</button>
        </div>

        <img id="slideImg" src='laptop1.jpeg'></img>
      </div>
    </main>
  );
}