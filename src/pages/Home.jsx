import HomePageComponent from "../components/HomePageComponent";

export default function Home( {searchQuery} ) {
  return (
    <>
      <HomePageComponent searchQuery={searchQuery} />
    </>
  );
}