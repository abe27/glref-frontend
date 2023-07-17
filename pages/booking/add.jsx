/* eslint-disable react-hooks/exhaustive-deps */
import {
  AutoComplete,
  AutoCompleteWhs,
  MainLayOut,
  ScanQrCode,
} from "@/components";
import { useToast } from "@chakra-ui/react";
import { Popover, Button, Input, Table, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as XLSX from "xlsx";
const MySwal = withReactContent(Swal);

const AddAdjustPage = () => {
  const inputExcel = useRef();
  const toast = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const { title, from_whs, to_whs } = router.query;
  const [bookingData, setBookingData] = useState([]);
  const [whsData, setWhsData] = useState([]);
  const [coorData, setCoorData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [excelName, setExcelName] = useState(null);

  /// Action
  const [items, setItems] = useState([]);

  /// Btn Add Data
  const [booking, setBooking] = useState([]);
  const [fromWhs, setFromWhs] = useState([]);
  const [toWhs, setToWhs] = useState([]);
  const [coor, setCoor] = useState([]);
  const [department, setDepartment] = useState([]);
  const [invNo, setInvNo] = useState("-");

  const [editData, setEditData] = useState(null);
  const [editFromWhs, setEditFromWhs] = useState(null);
  const [editToWhs, setEditToWhs] = useState(null);
  const [editQty, setEditQty] = useState(0);

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
        items.map((x) => {
          if (x.code !== obj.code) {
            doc.push(x);
          }
        });

        // let cost = 0;
        // doc.map((i) => {
        //   let a = parseFloat(i.price) * parseFloat(i.qty);
        //   cost = cost + a;
        // });
        // // setSumCost(cost);

        // let v = (vatQty / 100) * cost;
        // setVatCost(parseFloat(v).toFixed(2));
        // setSumVat(v + cost);
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
      `${process.env.API_HOST}/book?type=FR`,
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
    console.dir(name);
    setEditFromWhs(null);
    setEditToWhs(null);
    setWhsData([]);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    // console.dir(`${process.env.API_HOST}/whs?type=${name}`);
    const res = await fetch(
      `${process.env.API_HOST}/whs?type=${name}`,
      requestOptions
    );

    if (res.ok) {
      let doc = [];
      const data = await res.json();
      data.data.map((i) => {
        doc.push({
          rnn: doc.length,
          id: i.fcskid.replace(/^\s+|\s+$/gm, ""),
          code: `${i.fccode.replace(/^\s+|\s+$/gm, "")}`,
          name: `${i.fccode.replace(/^\s+|\s+$/gm, "")}-${i.fcname.replace(
            /^\s+|\s+$/gm,
            ""
          )}`,
        });
      });
      setWhsData(doc);
      if (router.query.from_whs) {
        let frm = doc.filter((i) => i.code === router.query.from_whs);
        setEditFromWhs(frm[0]);
      }

      if (router.query.to_whs) {
        let toWhs = doc.filter((i) => i.code === router.query.to_whs);
        setEditToWhs(toWhs[0]);
      }
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

    const res = await fetch(`${process.env.API_HOST}/coor`, requestOptions);

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
    setUnitData([]);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", session?.user.accessToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    // if (name === null || name === undefined) {
    //   name = "PCS";
    // }

    const res = await fetch(`${process.env.API_HOST}/unit`, requestOptions);

    if (res.ok) {
      let doc = [];
      const data = await res.json();
      data.data.map((i) => {
        doc.push({
          rnn: doc.length,
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

  const selectedBookingData = (txt) => {
    // console.dir(txt);
    if (txt) setBooking(txt);
  };

  const selectedFromWhsData = (txt) => {
    // console.dir(txt);
    if (txt) setFromWhs(txt);
  };

  const selectedToWhsData = (txt) => {
    // console.dir(txt);
    if (txt) setToWhs(txt);
  };

  const selectedCoorData = (txt) => {
    // console.dir(txt);
    if (txt) setCoor(txt);
  };

  const selectedDepartmentData = (txt) => {
    // console.dir(txt);
    if (txt) setDepartment(txt);
  };

  const AddItem = (e) => {
    e.preventDefault();
    setItems([]);
    let docs = [];
    setExcelName(e.target.files[0].name);
    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      let r = 0;
      dataParse.map((i) => {
        if (r > 0) {
          let isDuplicate = true;
          if (docs.length > 0) {
            let doc = docs.filter(
              (a) => a.code === i[0].replace(/^\s+|\s+$/gm, "")
            );

            if (doc.length > 0) {
              isDuplicate = false;
            }
          }

          if (isDuplicate) {
            docs.push({
              code: i[0].replace(/^\s+|\s+$/gm, ""),
              description: i[1].replace(/^\s+|\s+$/gm, ""),
              qty: i[2],
              unit: i[3].replace(/^\s+|\s+$/gm, ""),
            });
          }
        }
        r++;
      });
      setItems(docs);
    };
    reader.readAsBinaryString(f);
  };

  const UploadExcel = (e) => inputExcel.current.click();

  const SaveData = async () => {
    // if (booking === null || booking.length === 0) {
    //   return toast({
    //     title: "ข้อความแจ้งเตือน",
    //     description: "กรุณาระบุเลขที่ Booking ด้วย!",
    //     status: "error",
    //     duration: 3000,
    //     position: "top",
    //     isClosable: true,
    //   });
    // }

    if (fromWhs === null || fromWhs.length === 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุจากคลังสินค้าด้วย!",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }

    if (toWhs === null || toWhs.length === 0) {
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: "กรุณาระบุเข้าคลังสินค้าด้วย!",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }

    // if (coor === null || coor.length === 0) {
    //   return toast({
    //     title: "ข้อความแจ้งเตือน",
    //     description: "กรุณาระบุผู้ขายด้วย!",
    //     status: "error",
    //     duration: 3000,
    //     position: "top",
    //     isClosable: true,
    //   });
    // }

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

    // if (invNo === null || invNo.length === 0) {
    //   return toast({
    //     title: "ข้อความแจ้งเตือน",
    //     description: "กรุณาระบุเลขที่ Invoice ด้วย!",
    //     status: "error",
    //     duration: 3000,
    //     position: "top",
    //     isClosable: true,
    //   });
    // }

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

    let p = [];
    items.map((i) => {
      p.push({
        product: i.code,
        qty: parseFloat(i.qty),
        unit: "",
      });
    });

    let d = new Date();

    let postData = {
      prefix: router.query.book_type,
      type: "G",
      step: "I",
      recdate: `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
        "0" + d.getDate()
      ).slice(-2)}T00:00:00.000Z`,
      branch: process.env.BRACH_ID,
      job: process.env.JOB_ID,
      corp: process.env.CORP_ID,
      proj: process.env.PROJ_ID,
      booking: router.query.book_id,
      from_whs: fromWhs.id,
      to_whs: toWhs.id,
      coor: "",
      department: department.id,
      invoice_no: invNo,
      items: p,
    };

    console.dir(postData);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", session?.user.accessToken);

    var raw = JSON.stringify(postData);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const res = await fetch(`${process.env.API_HOST}/glref`, requestOptions);
    if (res.ok) {
      // const data = await res.json();
      toast({
        title: "ข้อความแจ้งเตือน",
        description: "บันทึกข้อมูลเรียบร้อยแล้ว",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      return router.back();
    }

    if (!res.ok) {
      console.dir(res);
      return toast({
        title: "ข้อความแจ้งเตือน",
        description: res.statusText,
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }
  };

  const UpdateProduct = () => {
    console.dir(editData);
    setItems((prev) => {
      let item = [...prev];
      item.map((i) => {
        if (i.code === editData?.code) {
          i.qty = editData?.qty;
        }
      });
      return item;
    });
  };

  const onScanQrCode = (txt) => {
    console.dir(txt);
  };

  useEffect(() => {
    if (session?.user) {
      fetchBooking(null);
      fetchWhs(router.query.whs_filter);
      fetchCoor(null);
      fetchDepartment(null);
      // fetchUnit();
    }
  }, [router]);

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
                <Input
                  label="รหัสสินค้า"
                  readOnly
                  fullWidth
                  type="text"
                  value={editData?.code}
                />
              </>
              <div className="pt-2">
                <Input
                  label="ชื่อสินค้า"
                  readOnly
                  fullWidth
                  type="text"
                  value={editData?.description}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="pt-2">
                <Input
                  label="จำนวน"
                  fullWidth
                  type="number"
                  value={editData?.qty}
                  onChange={(e) =>
                    setEditData((prevState) => {
                      const newItems = { ...prevState };
                      newItems.qty = e.target.value;
                      return newItems;
                    })
                  }
                />
              </div>
              <div className="flex pt-9">
                <Input
                  label=""
                  readOnly
                  fullWidth
                  type="text"
                  value={editData?.unit}
                />
              </div>
            </div>
          </div>
          <div className="modal-action">
            <button
              onClick={UpdateProduct}
              className="btn btn-success"
              htmlFor="my-modal-3"
            >
              บันทึก
            </button>
            <button className="btn btn-error" htmlFor="my-modal-3">
              ปิด
            </button>
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
              <Link href={"/"}>{router.query.book_description}</Link>
            </li>
            <li>เพิ่มข้อมูลรับสินค้า</li>
          </ul>
        </div>
        <div className="pl-4 rounded">
          <div className="flex space-x-4">
            {/* <div className="flex space-x-4">
              <AutoComplete
                textWidth="w-96"
                txtLimit={2}
                label="เล่มเอกสาร"
                data={bookingData}
                selectedData={selectedBookingData}
                queryData={(name) => fetchBooking(name)}
              />
            </div> */}
            <div className="flex space-x-4">
              <AutoCompleteWhs
                label="จากคลังสินค้า"
                data={whsData}
                selectedData={selectedFromWhsData}
                queryData={(name) => fetchWhs(name)}
                isClear={false}
                filterTxt={editFromWhs?.id}
              />
            </div>
            <div className="flex space-x-4">
              <AutoCompleteWhs
                label="เข้าคลังสินค้า"
                data={whsData}
                selectedData={selectedToWhsData}
                queryData={(name) => fetchWhs(name)}
                isClear={false}
                filterTxt={editToWhs?.id}
              />
            </div>
          </div>
          <div className="flex space-x-4 pt-2">
            {/* <div className="flex space-x-4">
              <AutoComplete
                label="รหัสผู้ขาย"
                textWidth="w-96"
                data={coorData}
                selectedData={selectedCoorData}
                queryData={(name) => fetchCoor(name)}
              />
            </div> */}
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
            <div className="pt-2">หมายเหตุ:</div>
            <>
              <Textarea
                fullWidth
                value={invNo}
                onChange={(e) => setInvNo(e.target.value)}
              />
            </>
          </div>
        </div>
        <div className="divider" />
        <div className="flex justify-between space-x-4">
          <div className="pt-2">
            <Button
              color={"success"}
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
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                  />
                </svg>
              }
              onPress={UploadExcel}
            >
              อัพโหลด Excel {excelName ? `${excelName}` : ""}
            </Button>
            <input
              ref={inputExcel}
              accept=".csv,.xls,.xlsx"
              type="file"
              className="hidden"
              onChange={AddItem}
            />
          </div>
          {/* <div className="">
            <ScanQrCode handlerResult={onScanQrCode} />
          </div> */}
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
              <Table.Column></Table.Column>
            </Table.Header>
            <Table.Body>
              {items.map((i, x) => (
                <Table.Row key={x}>
                  <Table.Cell>{x + 1}</Table.Cell>
                  <Table.Cell>{i.code}</Table.Cell>
                  <Table.Cell>{i.description}</Table.Cell>
                  <Table.Cell>{parseInt(i.qty).toLocaleString()}</Table.Cell>
                  <Table.Cell>{i.unit}</Table.Cell>
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
                        onPress={() => {
                          setEditData(i);
                          setEditQty(i.qty);
                          window.my_modal_1.showModal();
                        }}
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
        <div className="flex justify-end space-x-4 pt-4 mt-4 -z-50">
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
