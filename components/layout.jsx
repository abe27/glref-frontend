import Head from "next/head";
import { NavBar, AsideBar } from ".";

const MainLayOut = ({ children }) => {
  return (
    <>
      <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <div className="absolute bg-gray-200 w-full h-full">
        <NavBar />
        <div className="flex w-full">
          <AsideBar />
          <div className="container h-full w-full bg-green-500">{children}</div>
        </div>
      </div>
    </>
  );
};

export default MainLayOut;
