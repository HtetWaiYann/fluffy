import { Hero } from "@/components/Hero/Hero";
import { Loader } from "@/components/Loader/Loader";

export default function Home() {
  return (
    <>
      <Loader />
      <main>
        <Hero />
      </main>
    </>
  );
}
