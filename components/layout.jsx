/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { NavBar, AsideBar } from ".";
import { Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const MainLayOut = ({
  children,
  title = "Invoice Adjustment",
  description = "Adjustment Receive Data",
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState(true);

  const checkToken = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(`${process.env.API_HOST}/verify`, requestOptions);
    if (res.ok) {
      setIsLogin(false);
      return;
    }

    if (!res.ok) {
      setIsLogin(true);
      router.push("/login");
      return;
    }
  };

  useEffect(() => {
    if (session?.user) {
      checkToken();
    }
  }, []);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={description} key="title" />
      </Head>
      {isLogin ? (
        <div className="flex flex-col h-screen justify-center items-center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </div>
      ) : (
        <div className="absolute bg-gray-200 w-full h-full">
          <NavBar />
          <div className="flex">
            <AsideBar />
            <div className="container h-full p-6">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainLayOut;
