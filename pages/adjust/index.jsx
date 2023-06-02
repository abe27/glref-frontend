/* eslint-disable react-hooks/exhaustive-deps */
import MainLayOut from "@/components/layout";
import { Badge, Button, Input, Table, Tooltip } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import Link from "next/link";

const status = [
  { text: "Adjust", color: "primary", remark: "" },
  { text: "Transfer", color: "secondary", remark: "" },
  { text: "Success", color: "success", remark: "" },
  { text: "Failed", color: "error", remark: "" },
];

const remark = ["เลขที่เอกสารไม่ถูกต้อง", "รายการสินค้าไม่ถูกต้อง"];

const AdjustPage = () => {
  const [filterDate, setFilterDate] = useState(null);
  const [data, setData] = useState([]);
  const toast = useToast();

  const fetchData = async () => {
    setData([]);
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const res = await fetch(
      "https://jsonplaceholder.typicode.com/posts",
      requestOptions
    );

    if (res.ok) {
      const data = await res.json();
      let doc = [];
      data.map((i) => {
        let refNo = faker.helpers.regexpStyleStringParse("[66000000-66123199]");
        let d = faker.date.anytime();
        let date = `${d.getFullYear() + 543}-${("0" + (d.getMonth() + 1)).slice(
          -2
        )}-${("0" + d.getDate()).slice(-2)}`;
        if (filterDate) {
          date = filterDate;
        }

        let txt = "";
        let s = faker.number.int({ min: 0, max: status.length - 1 });
        if (s === 3) {
          txt = remark[faker.number.int({ min: 0, max: remark.length - 1 })];
        }

        doc.push({
          id: doc.length + 1,
          fccode: refNo,
          fcrefno: `ADJ/${refNo}`,
          fcdate: date,
          fcinvoice: "-",
          fcstatus: s,
          fcremark: txt,
        });
      });
      console.dir(doc);
      setData(doc);
    }

    if (!res.ok) {
      const error = await res;
      toast({
        title: "Error",
        description: error.statusText,
        status: "error",
        duration: 3500,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };

  const CheckStatusTotal = (status) => {
    let total = 0;
    data.map((i) => {
      if (status === i.fcstatus) {
        total++;
      }
    });
    return total;
  };

  useEffect(() => {
    fetchData();
  }, [filterDate]);

  return (
    <MainLayOut
      title="ใบรับสินค้าชั่วคราว"
      description="รายการใบรับสินค้าชั่วคราว"
    >
      <>
        <div className="grid-cols-1 container">
          <div className="flex justify-between mb-4 p-4">
            <div className="flex justify-start">
              <div className="flex justify-between space-x-2">
                <div className="pt-2">วันที่รับ:</div>
                <div>
                  <Input
                    type="date"
                    initialValue={filterDate}
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
                <Button
                  size={"md"}
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
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  }
                  onPress={fetchData}
                >
                  ค้นหา
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex justify-between space-x-4">
                <Tooltip content="เพิ่มรายการรับสินค้าใหม่">
                  <Link href={`/adjust/add?title=เพิ่มรายการรับสินค้า`}>
                    <Button
                      size={"md"}
                      auto
                      color={"primary"}
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
                    >
                      เพิ่ม
                    </Button>
                  </Link>
                </Tooltip>
                <Tooltip content="บันทึกข้อมูลเป็น Excel">
                  <Button
                    size={"md"}
                    auto
                    color={"success"}
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
                  >
                    รายงาน
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="p-2 flex justify-start space-x-4">
            <span>
              <Badge color="primary">Total: {data.length}</Badge>
            </span>
            <span>
              <Badge color="success">Success: {CheckStatusTotal(2)}</Badge>
            </span>
            <span>
              <Badge color="secondary">Transfer: {CheckStatusTotal(1)}</Badge>
            </span>
            <span>
              <Badge color="error">Failed: {CheckStatusTotal(3)}</Badge>
            </span>
          </div>
          <div className="divider" />
          <div className="container">
            <Table
              aria-label="Example table with static content"
              css={{
                height: "auto",
                minWidth: "100%",
              }}
            >
              <Table.Header>
                <Table.Column>#</Table.Column>
                <Table.Column>เลขที่ภายใน</Table.Column>
                <Table.Column>เลขที่อ้างอิง</Table.Column>
                <Table.Column>วันที่</Table.Column>
                <Table.Column>เลขที่ INVOICE</Table.Column>
                <Table.Column>สถานะ</Table.Column>
                <Table.Column>หมายเหตุ</Table.Column>
              </Table.Header>
              <Table.Body>
                {data?.map((i, x) => (
                  <Table.Row key={x}>
                    <Table.Cell>{x + 1}</Table.Cell>
                    <Table.Cell>{i.fccode}</Table.Cell>
                    <Table.Cell>
                      <Link
                        href={`/adjust/detail?is_add=false&edit=${
                          status[i.fcstatus].text === "Transfer"
                        }&type=${status[i.fcstatus].text}&id=${
                          i.fccode
                        }&title=${
                          status[i.fcstatus].text === "Transfer"
                            ? "Transfer ข้อมูล"
                            : "ข้อมูลเพิ่มเติม"
                        }`}
                      >
                        {i.fcrefno}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{i.fcdate}</Table.Cell>
                    <Table.Cell>{i.fcinvoice}</Table.Cell>
                    <Table.Cell>
                      <Link
                        href={`/adjust/detail?is_add=false&edit=${
                          status[i.fcstatus].text === "Transfer"
                        }&type=${status[i.fcstatus].text}&id=${
                          i.fccode
                        }&title=${
                          status[i.fcstatus].text === "Transfer"
                            ? "Transfer ข้อมูล"
                            : "ข้อมูลเพิ่มเติม"
                        }`}
                      >
                        <Button
                          size={"sm"}
                          color={status[i.fcstatus].color}
                          auto
                          flat={status[i.fcstatus].text === "Transfer"}
                          light={status[i.fcstatus].text !== "Transfer"}
                        >
                          {status[i.fcstatus].text}
                        </Button>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{i.fcremark}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Pagination
                shadow
                noMargin
                align="center"
                rowsPerPage={10}
                onPageChange={(page) => console.log({ page })}
              />
            </Table>
          </div>
        </div>
      </>
    </MainLayOut>
  );
};

export default AdjustPage;
