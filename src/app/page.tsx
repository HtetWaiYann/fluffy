import { Loader } from "@/components/Loader/Loader";

/** The landing page. Server component; sections are client components inside it. */
export default function Home() {
  return (
    <>
      <Loader />
      <main />
    </>
  );
}
