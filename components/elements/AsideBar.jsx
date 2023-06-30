/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  ListItem,
  Tooltip,
  UnorderedList,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ListMenu = ({ title, obj, filter, refLink }) => {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            <div className="flex justify-start">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
                />
              </svg>
              <span className="mx-2 text-sm font-medium">{title}</span>
            </div>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <UnorderedList>
          {obj?.map((i) =>
            i.type == filter ? (
              <Tooltip key={i.code} label={i.description}>
                <ListItem>
                  <Link
                    className="flex justify-start text-sm text-gray-700 hover:text-indigo-500 pl-2"
                    href={`/booking/${refLink}?book_id=${i.id}&book_type=${i.type}&code=${i.code}&name=${i.name}&description=${i.description}`}
                  >
                    <>{i.description}</>
                  </Link>
                </ListItem>
              </Tooltip>
            ) : (
              ""
            )
          )}
        </UnorderedList>
      </AccordionPanel>
    </AccordionItem>
  );
};

/* eslint-disable @next/next/no-img-element */
const AsideBar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [bookData, setBookData] = useState([]);

  const checkRoute = (name) => {
    // console.dir(`${name} ==> ${router.pathname}`);
    if (name.substring(0, 3) === router.pathname.substring(0, 3)) {
      return "bg-gray-300 dark:bg-gray-800 dark:text-gray-200 text-gray-700";
    }
    return "";
  };

  const fetchBooking = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/book?type=${process.env.BOOK_FILTER}`,
      requestOptions
    );

    let doc = [];
    if (res.ok) {
      const data = await res.json();
      data.data.map((i) => {
        doc.push({
          id: i.fcskid.replace(/^\s+|\s+$/gm, ""),
          type: `${i.fcreftype.replace(/^\s+|\s+$/gm, "")}`,
          code: `${i.fccode.replace(/^\s+|\s+$/gm, "")}`,
          name: `${i.fcname.replace(/^\s+|\s+$/gm, "")}`,
          description: `${i.fccode.replace(
            /^\s+|\s+$/gm,
            ""
          )}-${i.fcname.replace(/^\s+|\s+$/gm, "")}`,
        });
      });

      setBookData(doc);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchBooking();
    }
  }, [session]);

  return (
    <aside className="flex flex-col w-80 h-screen px-8 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-col justify-between flex-1">
        <nav className="-mx-3 space-y-6 ">
          <div className="">
            <span className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">
              เมนูหลัก
            </span>
            <Accordion defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <div className="flex justify-start">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                          />
                        </svg>
                        <span className="mx-2 text-sm font-medium">
                          หน้าแรก
                        </span>
                      </div>
                    </Box>
                  </AccordionButton>
                </h2>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton onClick={() => router.push("/adjust")}>
                    <Box as="span" flex="1" textAlign="left">
                      <div className="flex justify-start">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                        <span className="mx-2 text-sm font-medium">
                          ใบรับสินค้าชั่วคราว
                        </span>
                      </div>
                    </Box>
                  </AccordionButton>
                </h2>
              </AccordionItem>
              <ListMenu
                title={"ใบรับสินค้า(FR)"}
                obj={bookData}
                filter={"FR"}
                refLink={"fr"}
              />
              <ListMenu
                title={"ใบเบิกสินค้า(WR)"}
                obj={bookData}
                filter={"WR"}
                refLink={"wr"}
              />
              <ListMenu
                title={"ใบโอนสินค้า(TR)"}
                obj={bookData}
                filter={"TR"}
                refLink={"tr"}
              />
            </Accordion>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AsideBar;
