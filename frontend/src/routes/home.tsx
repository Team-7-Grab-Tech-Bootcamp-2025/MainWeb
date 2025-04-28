import { Link, useLoaderData } from "react-router";

export async function clientLoader() {
  return {
    title: "Home",
  };
}

export default function Home() {
  const data = useLoaderData();
  return (
    <div>
      {data.title}
      <Link to="/about">About</Link>
    </div>
  );
}
