/* eslint-disable react-hooks/exhaustive-deps */
import { AutoComplete, MainLayOut } from "@/components";
import { useToast } from "@chakra-ui/react";
import { Button, Input, Table } from "@nextui-org/react";
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
      data.data.map((i) => {
        let a = parseFloat(i.fnprice) * parseFloat(i.fnqty);
        cost = cost + a;
      });
      setSumCost(cost);

      let v = (vatQty / 100) * cost;
      setSumVat(v + cost);
      setItems(data.data);
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
      MySwal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: res.statusText,
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

  useEffect(() => {
    if (session?.user) {
      fetchUnit();
      fetchGlref();
      fetchRefProd();
    }
  }, [session, router]);

  return (
    <>
      {/* Open the modal using ID.showModal() method */}
      {/* You can open the modal using ID.showModal() method */}
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <button
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">แก้ไขข้อมูล!</h3>
          <div className="py-4">
            <div className="pt-2">
              <>
                <Input label="รหัสสินค้า" fullWidth type="text" />
              </>
              <div className="pt-2">
                <Input label="ชื่อสินค้า" fullWidth type="text" />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex space-x-4 pt-2">
                <div className="pt-2">จำนวน:</div>
                <>
                  <Input type="number" />
                </>
              </div>
              <div className="pt-2">
                <AutoComplete
                  label=""
                  data={unitData}
                  selectedData={selectedUnitData}
                  queryData={(name) => fetchUnit(name)}
                />
              </div>
            </div>
          </div>
          <div className="modal-action">
            <Button auto color={"primary"}>
              บันทึก
            </Button>
            <Button auto color={"error"}>
              ปิด
            </Button>
          </div>
        </form>
      </dialog>
      <MainLayOut title={title}>
        <div className="text-xs breadcrumbs">
          <ul>
            <li>
              <Link href={"/"}>หน้าแรก</Link>
            </li>
            <li>
              <Link href={"/adjust"}>ใบรับสินค้าชั่วคราว</Link>
            </li>
            <li>รายละเอียดข้อมูลรับสินค้า</li>
          </ul>
        </div>
        <div className="pl-4 rounded">
          <div className="flex space-x-4">
            <div className="flex w-96 space-x-4">
              <div className="pt-2 w-28">เล่มเอกสาร:</div>
              <>
                <Input
                  fullWidth
                  type="text"
                  readOnly
                  initialValue={`${entData?.book.fccode}-${entData?.book.fcname}`}
                />
              </>
            </div>
            <div className="flex w-96 space-x-4">
              <div className="pt-2 w-28">คลังสินค้า:</div>
              <>
                <Input
                  fullWidth
                  type="text"
                  readOnly
                  initialValue={`${entData?.to_whouse.fccode.replace(
                    /^\s+|\s+$/gm,
                    ""
                  )}-${entData?.to_whouse.fcname.replace(/^\s+|\s+$/gm, "")}`}
                />
              </>
            </div>
          </div>
          <div className="flex space-x-4 pt-2">
            <div className="flex w-96 space-x-4">
              <div className="pt-2 w-28">รหัสผู้ขาย:</div>
              <>
                <Input
                  fullWidth
                  type="text"
                  readOnly
                  initialValue={`${entData?.coor.fcname.replace(
                    /^\s+|\s+$/gm,
                    ""
                  )}`}
                />
              </>
            </div>
            <div className="flex space-x-4">
              <div className="pt-2">แผนก:</div>
              <>
                <Input
                  fullWidth
                  type="text"
                  readOnly
                  initialValue={`${entData?.department.fcname.replace(
                    /^\s+|\s+$/gm,
                    ""
                  )}`}
                />
              </>
            </div>
          </div>
          <div className="flex w-full space-x-4 pt-2">
            <div className="pt-2">เลขที่ INVOCIE:</div>
            <div className="w-48">
              <Input
                fullWidth
                type="text"
                readOnly
                initialValue={`${entData?.fmmemdata.replace(
                  /^\s+|\s+$/gm,
                  ""
                )}`}
              />
            </div>
            <div className="pt-2">เลขที่ PO:</div>
            <div className="w-52">
              <Input
                fullWidth
                type="text"
                value={poNo}
                onChange={(e) => setPoNo(e.target.value)}
              />
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
              <Table.Column></Table.Column>
            </Table.Header>
            <Table.Body>
              {items.map((i, x) => (
                <Table.Row key={x}>
                  <Table.Cell>{x + 1}</Table.Cell>
                  <Table.Cell>{i.prod.fccode}</Table.Cell>
                  <Table.Cell>{i.prod.fcname}</Table.Cell>
                  <Table.Cell>{parseInt(i.fnqty).toLocaleString()}</Table.Cell>
                  <Table.Cell>{i.unit.fcname}</Table.Cell>
                  <Table.Cell>
                    {parseFloat(i.fnprice).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {(i.fnqty * i.fnprice).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2 justify-end w-full">
                      <Button
                        disabled
                        size="sm"
                        auto
                        color={"primary"}
                        icon={
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
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        }
                        onPress={() => window.my_modal_1.showModal()}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        disabled
                        size="sm"
                        auto
                        color={"error"}
                        icon={
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        }
                        onPress={() => ConfirmDelete(i)}
                      >
                        ลบ
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="divider" />
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
            <div className="pt-2">มูลค่าVAT:</div>
            <>
              <Input readOnly type="text" value={`${vatQty}%`} />
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
        </div>
      </MainLayOut>
    </>
  );
};

export default AddAdjustDetailPage;
