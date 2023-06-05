import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const NotFoundPage = () => {
  const router = useRouter();
  const [countDown, setCountDown] = useState(5);

  useEffect(() => {
    // if (countDown <= 0) {
    //   router.back();
    // }

    const timer = setTimeout(() => {
      setCountDown(countDown - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countDown]);

  return (
    <>
      <Head>
        <title>404 Page Not Found</title>
        <meta name="description" content="ไม่พบข้อมูลที่ต้องการ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="px-40 py-20 bg-white rounded-md shadow-xl">
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-blue-600 text-9xl">404</h1>

            <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
              <span className="text-red-500">Oop!</span>
            </h6>

            <p className="mb-8 text-center text-gray-500 md:text-lg">
              Page Not Found.
            </p>
            <Link href="/">
              <span className="px-6 py-2 text-sm font-semibold bg-blue-100">
                <span className="text-blue-800">Go Home Page</span>
                &nbsp;&nbsp;
                <span className="countdown text-rose-700">
                  <span style={{ "--value": countDown }}></span>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
