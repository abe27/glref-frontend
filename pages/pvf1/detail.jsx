/* eslint-disable react-hooks/exhaustive-deps */
import { AutoComplete, MainLayOut } from "@/components";
import { Spinner, useToast } from "@chakra-ui/react";
import { Button, Input, Table, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const AddAdjustDetailPage = () => {
  const toast = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const { title, id, type } = router.query;
  const [unitData, setUnitData] = useState([]);
  const [entData, setEntData] = useState(null);
  const [items, setItems] = useState([]);

  // Form data
  const [sumCost, setSumCost] = useState(0);
  const [vatQty, setVatQty] = useState(7);
  const [vatCost, setVatCost] = useState(0);
  const [sumVat, setSumVat] = useState(0);
  const [poNo, setPoNo] = useState(null);

  const fetchGlref = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/glref?fcskid=${id}`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      console.dir(data.data[0]);
      setEntData(data.data[0]);
    }
  };

  const fetchRefProd = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/refprod?glref=${id}`,
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      let cost = 0;
      let docs = [];
      data.data.map((i) => {
        let a = parseFloat(i.fnprice) * parseFloat(i.fnqty);
        cost = cost + a;
        if (i.fciotype === "I") {
          docs.push(i);
        }
      });
      setSumCost(cost);

      let v = (vatQty / 100) * cost;
      setVatCost(parseFloat(v).toFixed(2));
      setSumVat(v + cost);
      setItems(docs);
    }
  };

  const fetchUnit = async (name) => {
    setUnitData([]);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/unit?name=${name}`,
      requestOptions
    );

    if (res.ok) {
      let doc = [];
      const data = await res.json();
      data.data.map((i) => {
        doc.push({
          id: i.fcskid.replace(/^\s+|\s+$/gm, ""),
          code: `${i.fccode.replace(/^\s+|\s+$/gm, "")}`,
          name: `${i.fccode.replace(/^\s+|\s+$/gm, "")}-${i.fcname.replace(
            /^\s+|\s+$/gm,
            ""
          )}`,
          description: `${i.fcname.replace(/^\s+|\s+$/gm, "")}`,
        });
      });
      setUnitData(doc);
    }
  };

  const selectedUnitData = (txt) => {};

  const SaveData = async () => {
    if (poNo === "" || poNo === null) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุเลขที่ PO ด้วย!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/glref?fcskid=${id}&pono=${poNo}`,
      requestOptions
    );

    if (res.ok) {
      MySwal.fire({
        title: "ข้อความแจ้งเตือน!",
        text: "บันทึกข้อมูลเรียบร้อยแล้ว?",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
        preConfirm: () => {
          router.push("/adjust");
        },
      });
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      MySwal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: data.message,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
        preConfirm: () => {
          router.push("/adjust");
        },
      });
      return;
    }
  };

  const UpdateHook = () => {
    let myHook = setTimeout(() => {
      if (session?.user) {
        fetchGlref();
        fetchRefProd();
      }
    }, 1500);
    return myHook;
  };

  useEffect(() => {
    if (session) {
      fetchGlref();
      fetchRefProd();
    }
  }, [router]);

  useEffect(() => {
    if (session) {
      fetchUnit();
      fetchGlref();
      fetchRefProd();
    }
  }, [session]);

  return (
    <>
      <MainLayOut title={title}>
        {entData !== null ? (
          <>
            <div className="text-xs breadcrumbs">
              <ul>
                <li>
                  <Link href={"/"}>หน้าแรก</Link>
                </li>
                <li>
                  <Link href={"/pvf1"}>ใบรับสินค้า PVF1</Link>
                </li>
                <li>รายละเอียดข้อมูลรับสินค้า</li>
              </ul>
            </div>
            <div className="pl-4 rounded">
              <div className="flex space-x-4">
                <div className="flex space-x-4">
                  <div className="pt-2">
                    เล่มเอกสาร:{"  "}
                    <span className="text-md font-bold text-gray-600">
                      {`${entData?.book.fccode}-${entData?.book.fcname}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-2 flex space-x-4">
                <div>
                  จากคลังสินค้า:{"  "}
                  <span className="text-md font-bold text-gray-600">
                    {`${entData?.from_whouse.fccode.replace(
                      /^\s+|\s+$/gm,
                      ""
                    )}-${entData?.from_whouse.fcname.replace(
                      /^\s+|\s+$/gm,
                      ""
                    )}`}
                  </span>
                </div>
                <div>
                  คลังสินค้า:{"  "}
                  <span className="text-md font-bold text-gray-600">
                    {`${entData?.to_whouse.fccode.replace(
                      /^\s+|\s+$/gm,
                      ""
                    )}-${entData?.to_whouse.fcname.replace(/^\s+|\s+$/gm, "")}`}
                  </span>
                </div>
              </div>
              <div className="flex space-x-4 pt-2">
                <div className="flex space-x-4">
                  <div className="pt-2">
                    แผนก:{"  "}
                    <span className="text-md font-bold text-gray-600">
                      {`${entData?.department.fcname.replace(
                        /^\s+|\s+$/gm,
                        ""
                      )}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full space-x-4 pt-2">
                <div className="pt-2">
                  หมายเหตุ:{"  "}
                  <span className="text-md font-bold text-gray-600">
                    {`${entData?.fmmemdata.replace(/^\s+|\s+$/gm, "")}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="divider" />
            <div className="pt-4">
              <Table
                aria-label="Example table with static content"
                css={{
                  zIndex: 0,
                  height: "auto",
                  minWidth: "100%",
                }}
              >
                <Table.Header>
                  <Table.Column>#</Table.Column>
                  <Table.Column>รหัสสินค้า</Table.Column>
                  <Table.Column>ชื่อสินค้า</Table.Column>
                  <Table.Column>จำนวน</Table.Column>
                  <Table.Column>หน่วย</Table.Column>
                  <Table.Column>ราคา</Table.Column>
                  <Table.Column>มูลค่า</Table.Column>
                </Table.Header>
                <Table.Body>
                  {items.map((i, x) => (
                    <Table.Row key={x}>
                      <Table.Cell>{x + 1}</Table.Cell>
                      <Table.Cell>{i.prod.fccode}</Table.Cell>
                      <Table.Cell>{i.prod.fcname}</Table.Cell>
                      <Table.Cell>
                        {parseInt(i.fnqty).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>{i.unit.fcname}</Table.Cell>
                      <Table.Cell>
                        {parseFloat(i.fnprice).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        {(i.fnqty * i.fnprice).toLocaleString()}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            {/* <div className="divider" />
            <div className="flex justify-end space-x-4">
              <div className="flex space-x-4 pt-2">
                <div className="pt-2">จำนวนสินค้า:</div>
                <>
                  <Input
                    readOnly
                    type="text"
                    value={items.length.toLocaleString()}
                  />
                </>
              </div>
              <div className="flex space-x-4 pt-2">
                <div className="pt-2">มูลค่าสินค้า:</div>
                <>
                  <Input
                    readOnly
                    type="text"
                    value={parseFloat(sumCost).toLocaleString()}
                  />
                </>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <div className="flex space-x-4 pt-2">
                <div className="pt-2">มูลค่าVAT 7%:</div>
                <>
                  <Input readOnly type="text" value={`${vatCost}`} />
                </>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <div className="flex space-x-4 pt-2">
                <div className="pt-2">ยอดรวม:</div>
                <>
                  <Input readOnly type="text" value={sumVat.toLocaleString()} />
                </>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4 mt-4">
              {type === "Transfer" ? (
                <Button
                  auto
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  }
                  onPress={SaveData}
                >
                  บันทึกข้อมูล
                </Button>
              ) : null}
            </div> */}
          </>
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
      </MainLayOut>
    </>
  );
};

export default AddAdjustDetailPage;
