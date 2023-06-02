import Head from "next/head";
import { NavBar, AsideBar } from ".";

const MainLayOut = ({
  children,
  title = "Invoice Adjustment",
  description = "Adjustment Receive Data",
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={description} key="title" />
      </Head>
      <div className="absolute bg-gray-200 w-full h-full">
        <NavBar />
        <div className="flex">
          <AsideBar />
          <div className="container h-full p-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default MainLayOut;
