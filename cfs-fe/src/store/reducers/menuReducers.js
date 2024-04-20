// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
// const initialState = {
//   entities: [],
//   loading: false,
// }

// const postMenu = createAsyncThunk('menu/test',
//   async (thunkAPI) => {
//     let url = window.root_url + `main-functions/view`;

//     fetch(url, {
//       method: "POST",
//       headers: {
//         'Accept': 'application/json, text/plain, */*',
//         'Content-Type': 'application/json; charset=UTF-8',
//         'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
//       },
//     })
//       .then(async (res) => {
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text);
//   }
//   return res.json();
// })
//       .then(data => {
//         let mainMenu = [];
//         if (data.length > 0) {
//           data.map(item => {
//             if (item.ParentID == null) {
//               mainMenu.push({
//                 code: item.Code,
//                 id: item.RowID,
//                 text: item.Name,
//                 isOpen: false,
//                 href: '/' + item.MenuLink,
//               });
//             }
//           });

//           mainMenu.map((dataMain, index) => {
//             let subMenu = [];
//             data.map(dataSub => {
//               if (dataMain.code == dataSub.ParentID) {
//                 subMenu.push({
//                   text: dataSub.Name,
//                   href: dataMain.href + '/' + dataSub.MenuLink
//                 });
//               }
//             });

//             //Kiểm tra lại subMenu, nếu có dữ liệu thì đẩy vào ds ở index của thằng cha
//             if (subMenu.length) {
//               mainMenu[index]['children'] = subMenu;
//             }
//           });
//           this.setState({ menu: mainMenu });
//         } else {
//           alert('Không có dữ liệu');
//         }
//       })
//       .catch(err => {
//         alert('Lỗi ' + err);
//       });
//   }
// );

export const MenuSlice = createSlice({
  name: "menu",
  initialState: [],
  // initialState: [
  //   {
  //     id: 0,
  //     text: "Tổng quan",
  //     isOpen: false,
  //     href: "/thong-ke-tong-quan"
  //   },
  //   {
  //     id: 1,
  //     text: "Hợp đồng Khách Hàng",
  //     isOpen: false,
  //     href: "/hop-dong",
  //   },
  //   {
  //     id: 2,
  //     text: "Bảng chiết tính",
  //     isOpen: false,
  //     href: "/bang-chiet-tinh",
  //   },
  //   {
  //     id: 3,
  //     text: "Khách Hàng",
  //     isOpen: false,
  //     href: "/khach-hang",
  //     children: [
  //       {
  //         text: "Danh Sách Khách Hàng",
  //         href: "/khach-hang",
  //       },
  //       {
  //         text: "Tài khoản Khách Hàng",
  //         href: "/khach-hang/taikhoan",
  //       },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     text: "Mặt Hàng",
  //     isOpen: false,
  //     href: "/mat-hang",
  //   },
  //   {
  //     id: 5,
  //     text: "Sơ đồ kho",
  //     isOpen: false,
  //     href: "/so-do-kho",
  //   },
  //   {
  //     id: 6,
  //     text: "Nhập kho",
  //     isOpen: false,
  //     href: "/nhap-kho",
  //     children: [
  //       {
  //         text: "Phiếu nhập kho",
  //         href: "/nhap-kho",
  //       },
  //       {
  //         text: "Phân bổ phiếu nhập kho",
  //         href: "/nhap-kho/phan-bo",
  //       },
  //       {
  //         text: "Nhật ký nhập kho",
  //         href: "/nhap-kho/nhat-ky",
  //       },
  //     ],
  //   },
  //   {
  //     id: 7,
  //     text: "Xuất kho",
  //     isOpen: false,
  //     href: "/xuat-kho",
  //     children: [
  //       {
  //         text: "Phiếu xuất kho",
  //         href: "/xuat-kho",
  //       },
  //       {
  //         text: "Nhật ký xuất kho",
  //         href: "/xuat-kho/nhat-ky",
  //       },
  //     ],
  //   },
  //   {
  //     id: 8,
  //     text: "Kiểm soát chất lượng",
  //     isOpen: false,
  //     href: "/kiem-soat-chat-luong",
  //     children: [
  //       {
  //         text: "Phiếu kiểm soát chất lượng",
  //         href: "/kiem-soat-chat-luong",
  //       },
  //       {
  //         text: "Nhật ký kiểm soát chất lượng",
  //         href: "/kiem-soat-chat-luong/nhat-ky",
  //       },
  //       {
  //         text: "Mở lại Pallet kiểm soát",
  //         href: "/kiem-soat-chat-luong/mo-lai-pallet",
  //       },
  //       {
  //         text: "Nhật ký mở lại Pallet",
  //         href: "/kiem-soat-chat-luong/nhat-ky-mo-lai-pallet",
  //       },
  //     ],
  //   },
  //   {
  //     id: 9,
  //     text: "Dịch vụ",
  //     isOpen: false,
  //     href: "/dich-vu",
  //     children: [
  //       {
  //         text: "Phiếu yêu cầu dịch vụ",
  //         href: "/dich-vu/phieu-yeu-cau",
  //       },
  //       {
  //         text: "Nhật ký phiếu dịch vụ",
  //         href: "/dich-vu/nhat-ky",
  //       },
  //     ],
  //   },
  //   {
  //     id: 10,
  //     text: "Chuyển ô",
  //     isOpen: false,
  //     href: "/chuyen-o",
  //     children: [
  //       {
  //         text: "Phiếu chuyển ô",
  //         href: "/chuyen-o/phieu",
  //       },
  //       {
  //         text: "Nhật ký chuyển ô",
  //         href: "/chuyen-o/nhat-ky",
  //       },
  //     ],
  //   },
  //   {
  //     id: 11,
  //     text: "Phân rã Pallet",
  //     isOpen: false,
  //     href: "/phan-ra-pallet",
  //     children: [
  //       {
  //         text: "Phiếu phân rã Pallet",
  //         href: "/phan-ra-pallet/phieu",
  //       },
  //       {
  //         text: "Nhật ký phân rã",
  //         href: "/phan-ra-pallet/nhat-ky",
  //       },
  //     ],
  //   },
  //   {
  //     id: 12,
  //     text: "Hoạt động định kỳ",
  //     isOpen: false,
  //     href: "/hoat-dong-dinh-ky",
  //     children: [
  //       {
  //         text: "Kỳ tính doanh thu",
  //         href: "/hoat-dong-dinh-ky/ky-tinh-doanh-thu",
  //       },
  //       {
  //         text: "Tính doanh thu",
  //         href: "/hoat-dong-dinh-ky/doanh-thu",
  //       },
  //     ],
  //   },
  //   {
  //     id: 13,
  //     text: "In lại",
  //     isOpen: false,
  //     href: "/in-lai",
  //     children: [
  //       {
  //         text: "In lại mã vạch Pallet",
  //         href: "/in-lai/ma-vach-pallet",
  //       },
  //     ],
  //   },
  //   {
  //     id: 14,
  //     text: "Sổ nhật ký",
  //     isOpen: false,
  //     href: "/nhat-ky",
  //     children: [
  //       {
  //         text: "Nhật ký nhập xuất kho",
  //         href: "/nhat-ky/nhap-xuat-kho",
  //       },
  //     ],
  //   },
  //   {
  //     id: 15,
  //     text: "Bảng kê nhập xuất hàng hóa",
  //     isOpen: false,
  //     href: "/bang-ke",
  //     children: [
  //       {
  //         text: "Bảng kê hàng hóa",
  //         href: "/bang-ke/bang-ke-danh-muc-nhap-xuat",
  //       },
  //     ],
  //   },
  //   {
  //     id: 16,
  //     text: "Tìm kiếm",
  //     isOpen: false,
  //     href: "/tim-kiem",
  //     children: [
  //       {
  //         text: "Mặt hàng theo ô",
  //         href: "/tim-kiem/mat-hang-theo-o",
  //       },
  //       {
  //         text: "Mặt hàng theo khách hàng",
  //         href: "/tim-kiem/mat-hang-theo-khach-hang",
  //       },
  //     ],
  //   },
  //   {
  //     id: 17,
  //     text: "Báo cáo",
  //     isOpen: false,
  //     href: "/bao-cao",
  //     children: [
  //       {
  //         text: "Hợp đồng khách hàng",
  //         href: "/bao-cao/hop-dong-khach-hang",
  //       },
  //       {
  //         text: "Thẻ kho",
  //         href: "/bao-cao/the-kho",
  //       },
  //       {
  //         text: "Doanh thu",
  //         href: "/bao-cao/doanh-thu",
  //       },
  //       {
  //         text: "Bảng kê phiếu nhập kho",
  //         href: "/bao-cao/bang-ke-phieu-nhap-kho",
  //       },
  //       {
  //         text: "Bảng kê phiếu xuất kho",
  //         href: "/bao-cao/bang-ke-phieu-xuat-kho",
  //       },
  //       {
  //         text: "Nhập xuất tồn theo kho",
  //         href: "/bao-cao/nxt-theo-kho",
  //       },
  //       {
  //         text: "Nhập xuất tồn chi tiết theo kho",
  //         href: "/bao-cao/nxt-chi-tiet-theo-kho",
  //       },
  //       {
  //         text: "Nhập xuất tồn theo mặt hàng",
  //         href: "/bao-cao/nxt-theo-mat-hang",
  //       },
  //       {
  //         text: "Nhập xuất tồn chi tiết theo mặt hàng",
  //         href: "/bao-cao/nxt-chi-tiet-theo-mat-hang",
  //       },
  //       {
  //         text: "Nhập xuất tồn theo khách hàng",
  //         href: "/bao-cao/nxt-theo-khach-hang",
  //       },
  //       {
  //         text: "Nhập xuất tồn chi tiết theo khách hàng",
  //         href: "/bao-cao/nxt-chi-tiet-theo-khach-hang",
  //       },
  //       {
  //         text: "Nhập xuất tồn kho theo phiếu nhập",
  //         href: "/bao-cao/nxt-kho-theo-phieu-nhap",
  //       },
  //       {
  //         text: "Nhập xuất tồn chi tiết",
  //         href: "/bao-cao/nxt-chi-tiet",
  //       },
  //       {
  //         text: "Sản lượng lưu kho theo phiếu xuất",
  //         href: "/bao-cao/san-luong-luu-kho-theo-phieu-xuat",
  //       },
  //       {
  //         text: "Sản lượng lưu kho hàng tồn kho",
  //         href: "/bao-cao/san-luong-luu-kho-hang-ton-kho",
  //       },
  //       {
  //         text: "Sản lượng lưu kho tấn vượt kho",
  //         href: "/bao-cao/san-luong-luu-kho-tan-vuot-kho",
  //       },
  //       {
  //         text: "Chi tiết tồn kho theo khách hàng",
  //         href: "/bao-cao/chi-tiet-ton-kho-theo-khach-hang",
  //       },
  //       {
  //         text: "Tổng hợp tình hình sử dụng ô",
  //         href: "/bao-cao/tong-hop-tinh-hinh-su-dung-o",
  //       },
  //       {
  //         text: "Bảng kê dịch vụ",
  //         href: "/bao-cao/bang-ke-dich-vu",
  //       },
  //       {
  //         text: "Bảng kê chi phí bốc xếp",
  //         href: "/bao-cao/bang-ke-chi-phi-boc-xep",
  //       },
  //       {
  //         text: "Bảng kê phí lưu kho",
  //         href: "/bao-cao/bang-ke-phi-luu-kho",
  //       },
  //       {
  //         text: "Bảng kê phí lưu kho theo nhóm hàng",
  //         href: "/bao-cao/bang-ke-phi-luu-kho-theo-nhom-hang",
  //       },
  //       {
  //         text: "Bảng kê phí lưu kho theo M3",
  //         href: "/bao-cao/bang-ke-phi-luu-kho-theo-m3",
  //       },
  //       {
  //         text: "Hàng tồn kho theo ngày",
  //         href: "/bao-cao/hang-ton-kho-theo-ngay",
  //       },
  //       {
  //         text: "Báo cáo tồn kho",
  //         href: "/bao-cao/bao-cao-ton-kho"
  //       },
  //     ],
  //   },
  //   {
  //     id: 18,
  //     text: "Danh mục chung",
  //     isOpen: false,
  //     href: "/cai-dat",
  //     children: [
  //       {
  //         text: "Danh mục cài đặt",
  //         href: "/cai-dat/danh-muc-chung",
  //       },
  //       {
  //         text: "Sơ đồ tổ chức",
  //         href: "/cai-dat/so-do-to-chuc",
  //       },
  //       {
  //         text: "Định nghĩa kho",
  //         href: "/cai-dat/dinh-nghia-kho",
  //       },
  //       // {
  //       //   text: "Danh sách ô",
  //       //   href: "/cai-dat/danh-sach-o",
  //       // },
  //       // {
  //       //   text: "Kho",
  //       //   href: "/cai-dat/kho",
  //       // },
  //       // {
  //       //   text: "Hệ thống tạo mã",
  //       //   href: "/cai-dat/he-thong-tao-ma",
  //       // },
  //     ],
  //   },
  //   {
  //     id: 19,
  //     text: "Post vào Oracle",
  //     isOpen: false,
  //     href: "/post-vao-oracle",
  //     children: [
  //       {
  //         text: "Post vào Oracle",
  //         href: "/post-vao-oracle",
  //       },
  //       {
  //         text: "Cài đặt số tham chiếu cho KH",
  //         href: "/post-vao-oracle/cai-dat-so-tham-chieu-cho-kh",
  //       },
  //       {
  //         text: "Cài đặt số tham chiếu cho dịch vụ",
  //         href: "/post-vao-oracle/cai-dat-so-tham-chieu-cho-dv",
  //       },
  //     ],
  //   },
  //   {
  //     id: 20,
  //     text: "TOS - VSL API",
  //     isOpen: false,
  //     href: "/tos-vsl-api",
  //     children: [
  //       {
  //         text: "Lịch sử API : VSL",
  //         href: "/tos-vsl-api/lich-su-api-vsl"
  //       },
  //       {
  //         text: "Lịch sử API : TOS",
  //         href: "/tos-vsl-api/lich-su-api-tos"
  //       },
  //       {
  //         text: "Hóa đơn điện tử",
  //         href: "/tos-vsl-api/hoa-don-dien-tu"
  //       },
  //       {
  //         text: "Thanh toán MB/NAPAS",
  //         href: "/tos-vsl-api/thanh-toan-mb-napas"
  //       },
  //       {
  //         text: "Tích hợp tờ khai điện tử",
  //         href: "/tos-vsl-api/tich-hop-to-khai-dien-tu"
  //       },
  //     ]
  //   },
  //   {
  //     id: 21,
  //     text: "Hàng sắp hết hạn SD",
  //     isOpen: false,
  //     href: "/hang-sap-het-han-sd",
  //     // children: [
  //     //   {
  //     //     text: "Hàng sắp hết hạn SD",
  //     //     href: "/hang-sap-het-han-sd",
  //     //   },
  //     //   // {
  //     //   //   text: "Số ngày báo hết hạn SD",
  //     //   //   href: "/hang-sap-het-han-sd/so-ngay-bao-sap-het-han-sd",
  //     //   // },
  //     // ],
  //   },
  //   {
  //     id: 22,
  //     text: "Xem file nhật ký",
  //     isOpen: false,
  //     href: "/file-nhat-ky",
  //   },
  //   {
  //     id: 23,
  //     text: "Quản lý menu",
  //     isOpen: false,
  //     href: "/quan-ly-menu",
  //   },
  //   {
  //     id: 23,
  //     text: "Quản lý tàu chuyến",
  //     isOpen: false,
  //     href: "/quan-ly-tau",
  //   },
  // ],

  reducers: {
    updateMenuState(state, action) {
      let item = action.payload;
      let itemIndex = state.findIndex((i) => i.id === item.id);
      state[itemIndex].isOpen = !item.isOpen;
      return state;
    },
  },
  // extraReducers: {
  //   [test.pending]: (state) => {
  //     state.loading = true
  //   },
  //   [test.fulfilled]: (state, { payload }) => {
  //     state.loading = false
  //     state.entities = payload
  //   },
  //   [test.rejected]: (state) => {
  //     state.loading = false
  //   }
  // },
});

// Action creators are generated for each case reducer function
export const { updateMenuState } = MenuSlice.actions;

export default MenuSlice.reducer;
