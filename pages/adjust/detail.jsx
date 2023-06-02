import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Input, Dropdown, Button, Table } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { MainLayOut } from "@/components";
const MySwal = withReactContent(Swal);

const AdjustDetailPage = () => {
  const router = useRouter();
  const { id, type, edit, title, is_add } = router.query;

  const ConfirmDelete = () => {
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
                <select class="select select-ghost w-full max-w-xs">
                  <option disabled selected>
                    เลือกหน่วย
                  </option>
                  <option>Svelte</option>
                  <option>Vue</option>
                  <option>React</option>
                </select>
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
        <div class="text-xs breadcrumbs">
          <ul>
            <li>
              <Link href={"/"}>หน้าแรก</Link>
            </li>
            <li>
              <Link href={"/adjust"}>ใบรับสินค้าชั่วคราว</Link>
            </li>
            <li>เลขที่เอกสาร {id}</li>
          </ul>
        </div>
        <div className="pl-4 rounded bg-gray-50">
          <div className="flex space-x-4">
            <div className="flex space-x-4">
              <div className="pt-2">เล่มเอกสาร:</div>
              <Dropdown>
                <Dropdown.Button light>------</Dropdown.Button>
                <Dropdown.Menu variant="light" aria-label="Actions">
                  <Dropdown.Item key="new">
                    007-ใบรับสินค้าชั่วคราว
                  </Dropdown.Item>
                  <Dropdown.Item key="copy">001-XXXXXXX</Dropdown.Item>
                  <Dropdown.Item key="edit">002-XXXXXXXX</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="flex space-x-4">
              <div className="pt-2">คลังสินค้า:</div>
              <Dropdown>
                <Dropdown.Button light>------</Dropdown.Button>
                <Dropdown.Menu variant="light" aria-label="Actions">
                  <Dropdown.Item key="copy">003-XXXXXXX</Dropdown.Item>
                  <Dropdown.Item key="edit">005-XXXXXXXX</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="pt-2">คลังสินค้าName</div>
          </div>
          <div className="flex space-x-4 pt-2">
            <div className="flex space-x-4">
              <div className="pt-2">รหัสผู้ขาย:</div>
              <Dropdown>
                <Dropdown.Button light>------</Dropdown.Button>
                <Dropdown.Menu variant="light" aria-label="Actions">
                  <Dropdown.Item key="copy">003-XXXXXXX</Dropdown.Item>
                  <Dropdown.Item key="edit">005-XXXXXXXX</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <div className="pt-2">ชื่อผู้ขาย</div>
            </div>
            <div className="flex space-x-4">
              <div className="pt-2">รหัสแผนก:</div>
              <Dropdown>
                <Dropdown.Button light>------</Dropdown.Button>
                <Dropdown.Menu variant="light" aria-label="Actions">
                  <Dropdown.Item key="copy">003-XXXXXXX</Dropdown.Item>
                  <Dropdown.Item key="edit">005-XXXXXXXX</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <div className="pt-2">ชื่อแผนก</div>
            </div>
          </div>
          <div className="flex space-x-4 pt-2">
            <div className="pt-2">เลขที่ INVOCIE:</div>
            <>
              <Input type="text" />
            </>
            <div className="pt-2">เลขที่ PO:</div>
            <>
              <Input type="text" />
            </>
          </div>
        </div>
        <div className="divider" />
        <div className="flex justify-between space-x-4">
          <div className="flex justify-start space-x-4">
            <div className="flex space-x-4 pt-2">
              <div className="pt-2">รหัสสินค้า:</div>
              <>
                <Input type="text" />
              </>
            </div>
            <div className="flex space-x-4 pt-2">
              <div className="pt-2">ชื่อสินค้า:</div>
              <>
                <Input type="text" disabled />
              </>
            </div>
            <div className="flex space-x-4 pt-2">
              <div className="pt-2">จำนวน:</div>
              <>
                <Input type="number" />
              </>
            </div>
            <div className="pt-2">
              <Dropdown>
                <Dropdown.Button light>เลือกหน่วย</Dropdown.Button>
                <Dropdown.Menu variant="light" aria-label="Actions">
                  <Dropdown.Item key="copy">003-XXXXXXX</Dropdown.Item>
                  <Dropdown.Item key="edit">005-XXXXXXXX</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="flex space-x-4 pt-2">
              <div className="pt-2">ราคา:</div>
              <>
                <Input type="number" />
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
            >
              เพิ่มข้อมูล
            </Button>
          </div>
        </div>
        <div className="pt-4">
          <Table
            aria-label="Example table with static content"
            css={{
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
              <Table.Row key="1">
                <Table.Cell>1</Table.Cell>
                <Table.Cell>XXXXXXXXXXXX</Table.Cell>
                <Table.Cell>XXXXXXXXXXXXXXXX</Table.Cell>
                <Table.Cell>2</Table.Cell>
                <Table.Cell>PCS</Table.Cell>
                <Table.Cell>1,000.00</Table.Cell>
                <Table.Cell>2,000.00</Table.Cell>
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
                      onPress={ConfirmDelete}
                    >
                      ลบ
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
              <Table.Row key="2">
                <Table.Cell>2</Table.Cell>
                <Table.Cell>XXXXXXXXXXXX</Table.Cell>
                <Table.Cell>XXXXXXXXXXXXXXXX</Table.Cell>
                <Table.Cell>2</Table.Cell>
                <Table.Cell>PCS</Table.Cell>
                <Table.Cell>1,000.00</Table.Cell>
                <Table.Cell>2,000.00</Table.Cell>
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
                      onPress={ConfirmDelete}
                    >
                      ลบ
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <div className="divider" />
        <div className="flex justify-end space-x-4">
          <div className="flex space-x-4 pt-2">
            <div className="pt-2">จำนวนสินค้า:</div>
            <>
              <Input type="number" />
            </>
          </div>
          <div className="flex space-x-4 pt-2">
            <div className="pt-2">มูลค่าสินค้า:</div>
            <>
              <Input type="number" />
            </>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <div className="flex space-x-4 pt-2">
            <div className="pt-2">มูลค่าVAT:</div>
            <>
              <Input type="number" />
            </>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <div className="flex space-x-4 pt-2">
            <div className="pt-2">ยอดรวม:</div>
            <>
              <Input type="number" />
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
          >
            บันทึกข้อมูล
          </Button>
        </div>
      </MainLayOut>
    </>
  );
};

export default AdjustDetailPage;
