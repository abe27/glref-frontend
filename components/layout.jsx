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
  const [isLogin, setIsLogin] = useState(false);

  const checkToken = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(`${process.env.API_HOST}/verify`, requestOptions);
    console.dir(res);
    if (res.ok) {
      setIsLogin(false);
      return;
    }

    if (!res.ok) {
      router.push("/login");
      return;
    }
  };

  useEffect(() => {
    setIsLogin(true);
    if (session) {
      checkToken();
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={description} key="title" />
      </Head>
      {session?.user ? (
        <div className="absolute bg-gray-200 w-full h-full">
          <NavBar />
          <div className="flex">
            <AsideBar />
            <div className="container h-full p-6">{children}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen justify-center items-center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </div>
      )}
    </>
  );
};

export default MainLayOut;
