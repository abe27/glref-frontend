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

const AddAdjustPage = () => {
  const toast = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const { title } = router.query;
  const [bookingData, setBookingData] = useState([]);
  const [whsData, setWhsData] = useState([]);
  const [coorData, setCoorData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [productData, setProductData] = useState([]);

  /// Action
  const [items, setItems] = useState([]);
  const [vatQty, setVatQty] = useState(7);
  const [sumCost, setSumCost] = useState(0);
  const [sumVat, setSumVat] = useState(0);
  const [isClearProduct, setIsClearProduct] = useState(false);
  const [isClearUnit, setIsClearUnit] = useState(false);
  const [selectProduct, setSelectProduct] = useState([]);
  const [selectQty, setSelectQty] = useState(0);
  const [selectUnit, setSelectUnit] = useState([]);
  const [selectPrice, setSelectPrice] = useState(0);

  /// Btn Add Data
  const [booking, setBooking] = useState([]);
  const [whs, setWhs] = useState([]);
  const [coor, setCoor] = useState([]);
  const [department, setDepartment] = useState([]);
  const [invNo, setInvNo] = useState(null);

  const ConfirmDelete = (obj) => {
    MySwal.fire({
      title: "ยืนยันคำสั่ง!",
      text: "คุณต้องการที่จะลบรายการนี้ใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยันการลบ",
      cancelButtonText: "ปิด",
      preConfirm: () => {
        let doc = [];
        let i = items;
        i.map((x) => {
          if (x.product.code !== obj.product.code) {
            doc.push(x);
          }
        });

        let cost = 0;
        doc.map((i) => {
          let a = parseFloat(i.price) * parseFloat(i.qty);
          cost = cost + a;
        });
        setSumCost(cost);

        let v = (vatQty / 100) * cost;
        setSumVat(v + cost);
        setItems(doc);
        return MySwal.fire({
          title: "ข้อความแจ้งเตือน!",
          text: "บันทึกข้อมูลเรียบร้อยแล้ว?",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
      },
    });
  };

  const EditItem = () => {
    MySwal.fire({
      template: "#myTemplate",
    });
  };

  const fetchBooking = async (name) => {
    setBookingData([]);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/book?name=${name}`,
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
        });
      });
      setBookingData(doc);
    }
  };

  const fetchWhs = async (name) => {
    setWhsData([]);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/whs?name=${name}`,
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
        });
      });
      setWhsData(doc);
    }
  };

  const fetchCoor = async (name) => {
    setCoorData([]);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/coor?name=${name}`,
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
        });
      });
      setCoorData(doc);
    }
  };

  const fetchDepartment = async (name) => {
    setDepartmentData([]);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/department?name=${name}`,
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
        });
      });
      setDepartmentData(doc);
    }
  };

  const fetchUnit = async (name) => {
    setIsClearUnit(false);
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

  const fetchProduct = async (name) => {
    setIsClearProduct(false);
    setProductData([]);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const res = await fetch(
      `${process.env.API_HOST}/product?type=1,5&name=${name}`,
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
      setProductData(doc);
    }
  };

  const selectedBookingData = (txt) => {
    console.dir(txt);
    setBooking(txt);
  };

  const selectedWhsData = (txt) => {
    console.dir(txt);
    setWhs(txt);
  };

  const selectedCoorData = (txt) => {
    console.dir(txt);
    setCoor(txt);
  };

  const selectedDepartmentData = (txt) => {
    console.dir(txt);
    setDepartment(txt);
  };

  const selectedUnitData = (txt) => {
    setSelectUnit(txt);
  };

  const selectedProductData = (txt) => {
    // setIsClearProduct(false);
    setSelectProduct(txt);
  };

  const AddItem = () => {
    if (selectProduct === null || selectProduct.length === 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุสินค้าด้วย",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    if (selectQty <= 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุจำนวนที่ต้องการด้วย",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    if (selectUnit === null || selectUnit.length === 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุหน่วยด้วย",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    if (selectPrice <= 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุราคาด้วย",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    let doc = {
      product: selectProduct,
      qty: selectQty,
      unit: selectUnit,
      price: selectPrice,
    };

    if (items.length > 0) {
      const x = items.map((i) => {
        if (i.product.code === doc.product.code) {
          return i;
        }
        return null;
      });
      if (x[0]) {
        setItems((prevState) => {
          const newItems = [...prevState];
          newItems.map((i) => {
            if (i.product.code === doc.product.code) {
              i.qty = parseFloat(i.qty) + parseFloat(doc.qty);
              i.price = parseFloat(doc.price);
            }
          });
          return newItems;
        });
      } else {
        setItems([...items, doc]);
      }
    } else {
      setItems([doc]);
    }
    // console.dir(doc);
    setIsClearProduct(true);
    setIsClearUnit(true);
  };

  const SaveData = () => {
    if (booking === null || booking.length === 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุเลขที่ Booking ด้วย!",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }

    if (whs === null || whs.length === 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุคลังสินค้าด้วย!",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }

    if (coor === null || coor.length === 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุผู้ขายด้วย!",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }

    if (department === null || department.length === 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุแผนกด้วย!",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }

    if (invNo === null || invNo.length === 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุเลขที่ Invoice ด้วย!",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }

    if (items === null || items.length === 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาเพิ่มรายการสินค้าก่อน!",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isClearProduct) {
      setSelectProduct(null);
      setSelectQty(0);
      setSelectUnit(null);
      setSelectPrice(0);
    }
    let cost = 0;
    items.map((i) => {
      let a = parseFloat(i.price) * parseFloat(i.qty);
      cost = cost + a;
    });
    setSumCost(cost);
    let v = (vatQty / 100) * cost;
    setSumVat(v + cost);
  }, [isClearProduct]);

  useEffect(() => {
    if (session?.user) {
      fetchBooking();
      fetchWhs();
      fetchCoor();
      fetchDepartment();
      fetchUnit();
      fetchProduct(null);
    }
  }, [session]);

  return (
    <>
      {/* Open the modal using ID.showModal() method */}
      {/* You can open the modal using ID.showModal() method */}
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <button
            for="my-modal-3"
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
            <li>เพิ่มข้อมูลรับสินค้า</li>
          </ul>
        </div>
        <div className="pl-4 rounded">
          <div className="flex space-x-4">
            <div className="flex space-x-4">
              <AutoComplete
                textWidth="w-96"
                txtLimit={2}
                label="เล่มเอกสาร"
                data={bookingData}
                selectedData={selectedBookingData}
                queryData={(name) => fetchBooking(name)}
              />
            </div>
            <div className="flex space-x-4">
              <AutoComplete
                label="คลังสินค้า"
                data={whsData}
                selectedData={selectedWhsData}
                queryData={(name) => fetchWhs(name)}
              />
            </div>
          </div>
          <div className="flex space-x-4 pt-2">
            <div className="flex space-x-4">
              <AutoComplete
                label="รหัสผู้ขาย"
                textWidth="w-96"
                data={coorData}
                selectedData={selectedCoorData}
                queryData={(name) => fetchCoor(name)}
              />
            </div>
            <div className="flex space-x-4">
              <AutoComplete
                label="รหัสแผนก"
                data={departmentData}
                selectedData={selectedDepartmentData}
                queryData={(name) => fetchDepartment(name)}
              />
            </div>
          </div>
          <div className="flex space-x-4 pt-2">
            <div className="pt-2">เลขที่ INVOCIE:</div>
            <>
              <Input
                type="text"
                value={invNo}
                onChange={(e) => setInvNo(e.target.value)}
              />
            </>
            {/* <div className="pt-2">เลขที่ PO:</div>
            <>
              <Input type="text" />
            </> */}
          </div>
        </div>
        <div className="divider" />
        <div className="flex justify-between space-x-4">
          <div className="flex justify-start space-x-4">
            <div className="flex space-x-4 pt-2">
              <AutoComplete
                fullName={false}
                label="รหัสสินค้า"
                textWidth="w-fit"
                data={productData}
                selectedData={selectedProductData}
                queryData={(name) => fetchProduct(name)}
                isClear={isClearProduct}
              />
            </div>
            <div className="flex space-x-4 pt-2">
              <div className="pt-2">จำนวน:</div>
              <>
                <Input
                  type="number"
                  value={selectQty}
                  onChange={(e) => setSelectQty(e.target.value)}
                />
              </>
            </div>
            <div className="pt-2">
              <AutoComplete
                txtLimit={2}
                label=""
                textWidth="w-28"
                data={unitData}
                selectedData={selectedUnitData}
                queryData={(name) => fetchUnit(name)}
                isClear={isClearUnit}
              />
            </div>
            <div className="flex space-x-4 pt-2">
              <div className="pt-2">ราคา:</div>
              <>
                <Input
                  type="number"
                  value={selectPrice}
                  onChange={(e) => setSelectPrice(e.target.value)}
                />
              </>
            </div>
          </div>
          <div className="pt-2">
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              }
              onPress={AddItem}
            >
              เพิ่มข้อมูล
            </Button>
          </div>
        </div>
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
                  <Table.Cell>{i.product.code}</Table.Cell>
                  <Table.Cell>{i.product.description}</Table.Cell>
                  <Table.Cell>{parseInt(i.qty).toLocaleString()}</Table.Cell>
                  <Table.Cell>{i.unit.description}</Table.Cell>
                  <Table.Cell>
                    {parseFloat(i.price).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{(i.qty * i.price).toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2 justify-end w-full">
                      <Button
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
          <Button
            auto
            color={"error"}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            }
            onPress={() => router.reload()}
          >
            เคลียร์ข้อมูล
          </Button>
        </div>
      </MainLayOut>
    </>
  );
};

export default AddAdjustPage;
