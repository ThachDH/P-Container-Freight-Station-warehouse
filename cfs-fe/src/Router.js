import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./KhoCFS2/login";
import VoyageCharter from "./KhoCFS2/inData/VoyageCharter";
import BangKeDanhMucHangHoaNhapXuat from "./KhoCFS2/inData/BangKeDanhMucHangNhapXuat";
import DanhMucDoanhNghiep from "./KhoCFS2/DanhMuc/DanhMucDoanhNghiep";
import DanhMucLoaiKho from "./KhoCFS2/DanhMuc/DanhMucLoaiKho";
import ChiTietBangThongKe from "./KhoCFS2/thongke/ChiTietBangThongKe";
import MainLayout from "./KhoCFS2/layouts/MainLayout";
import EmptyLayout from "./KhoCFS2/layouts/EmptyLayout";
import DanhMucKho from "./KhoCFS2/DanhMuc/DanhMucKho";
import ForkLift from "./KhoCFS2/storageOperations/ForkLift";
import Payments from "./KhoCFS2/Tariff/Payments";
import Currency from "./KhoCFS2/Tariff/CurrencyType";
import Manifest from "./KhoCFS2/inData/LoadingList_Container";
import DanhMucBlock from "./KhoCFS2/DanhMuc/DanhMucBlock";
import DanhMucLoaiKhachHang from "./KhoCFS2/DanhMuc/DanhMucLoaiKhachHang";
import DanhMucKhachHang from "./KhoCFS2/DanhMuc/DanhMucKhachHang";
import DanhMucGate from "./KhoCFS2/DanhMuc/DanhMucGate";
import LoaiVanChuyen from "./KhoCFS2/DanhMuc/LoaiVanChuyen";
import ItemsType from "./KhoCFS2/DanhMuc/ItemsType";
import GoodsType from "./KhoCFS2/DanhMuc/GoodsType";
import ItemsList from "./KhoCFS2/DanhMuc/ItemsList";
import PhuongAn from "./KhoCFS2/DanhMuc/PhuongAn";
import HopDongThue from "./KhoCFS2/DanhMuc/HopDongThue";
import DanhMucHangHoa from "./KhoCFS2/DanhMuc/DanhMucHangHoa";
import BienDongKho from "./KhoCFS2/baocao/BienDongKho";
import TruyVanKiemDem from "./KhoCFS2/baocao/TruyVanKiemDem";
import InputCreate from "./KhoCFS2/DangKyLenh/InputCreate";
import OutputExport from "./KhoCFS2/DangKyLenh/OutputExport";
import OutCreate from "./KhoCFS2/DangKyLenh/OutCreate";
import OrderList from "./KhoCFS2/DangKyLenh/OrderList";
import TruyVanThongTin from "./KhoCFS2/baocao/TruyVanThongTin";
import TruyVanKho from "./KhoCFS2/baocao/TruyVanKho";
import GiamSatCong from "./KhoCFS2/dieuhanhcong/GiamSatCong";
import NoResultsLayout from "./KhoCFS2/noResultsLayout/NoResultsLayout";
import MaBieuCuoc from "./KhoCFS2/bieucuoc/MaBieuCuoc";
import DanhMucDonViTinh from "./KhoCFS2/DanhMuc/DanhMucDonViTinh";
import BieuCuocChuan from "./KhoCFS2/bieucuoc/BieuCuocChuan";
import TallySys from "./KhoCFS2/storageOperations/InWarehouseTally";
import PhanQuyen from "./KhoCFS2/quanlinguoidung/PhanQuyen";
import NhomNguoiDung from "./KhoCFS2/quanlinguoidung/NhomNguoiDung";
import NguoiDung from "./KhoCFS2/quanlinguoidung/NguoiDung";
import ExWarehouseTally from "./KhoCFS2/storageOperations/ExWarehouseTally";
import QuanLyMenu from "./KhoCFS2/tools/QuanLiMenu";
import ServiceConfi from "./KhoCFS2/Tariff/service-conf";
import GoodsSearchInfo from "./KhoCFS2/baocao/GoodsSearchInfo";
import React, { useState } from 'react';
import InExportOrder from "./KhoCFS2/DangKyLenh/InExportOrder";
import StorageConfig from "./KhoCFS2/storageOperations/StorageConfig";
import DiscountConfig from "./KhoCFS2/bieucuoc/DiscountConfig";
import ExExportOrder from "./KhoCFS2/DangKyLenh/ExExportOrder";
import QueryInforOder from "./KhoCFS2/baocao/TruyVanThongTinLenh";
import FluctuateContainerInfo from "./KhoCFS2/inData/FluctuateContainerInfo";
import Operating from "./KhoCFS2/tools/Operating";
import APITOS from "./KhoCFS2/tools/API_TOS";
import ManageImportExport from "./KhoCFS2/storageOperations/ManageImportExport";
import APICAS from "./KhoCFS2/tools/API_CAS";
import InExReport from "./KhoCFS2/baocao/InExReport";
import ProgressiveConfig from "./KhoCFS2/bieucuoc/ProgressiveConfig";
import TruckList from "./KhoCFS2/DanhMuc/TruckList";
import RomoocList from "./KhoCFS2/DanhMuc/RomoocList";
import ChangeData from "./KhoCFS2/tools/ChangeData";
import OrderUpdate from "./KhoCFS2/tools/OrderUpdate";
import MinValueConfig from "./KhoCFS2/bieucuoc/MinValueConfig";
import InvoiceRel from "./KhoCFS2/DangKyLenh/InvoiceRel";
import DocumentCancel from "./KhoCFS2/DangKyLenh/DocumentCancel";
import InvoiceCre from "./KhoCFS2/DangKyLenh/IvoiceCre";

let RouterLink = {
  InvoiceCre,
  DocumentCancel,
  InvoiceRel,
  MinValueConfig,
  OrderUpdate,
  ChangeData,
  RomoocList,
  TruckList,
  ProgressiveConfig,
  InExReport,
  APICAS,
  ManageImportExport,
  Operating,
  APITOS,
  FluctuateContainerInfo,
  ExExportOrder,
  QueryInforOder,
  DiscountConfig,
  StorageConfig,
  InExportOrder,
  GoodsSearchInfo,
  ServiceConfi,
  VoyageCharter,
  ExWarehouseTally,
  NguoiDung,
  NhomNguoiDung,
  TallySys,
  BieuCuocChuan,
  DanhMucDonViTinh,
  MaBieuCuoc,
  NoResultsLayout,
  GiamSatCong,
  TruyVanKho,
  TruyVanThongTin,
  QuanLyMenu,
  OrderList,
  OutCreate,
  OutputExport,
  InputCreate,
  TruyVanKiemDem,
  BienDongKho,
  DanhMucHangHoa,
  HopDongThue,
  PhuongAn,
  ItemsList,
  GoodsType,
  ItemsType,
  LoaiVanChuyen,
  DanhMucGate,
  DanhMucLoaiKhachHang,
  DanhMucBlock,
  Manifest,
  Currency,
  Payments,
  ForkLift,
  DanhMucKho,
  DanhMucLoaiKho,
  DanhMucDoanhNghiep,
  BangKeDanhMucHangHoaNhapXuat,
  DanhMucKhachHang,
  PhanQuyen,
};


function Router() {
  const [count, setCount] = useState(0);
  let oldPushState = window.history.pushState;
  window.history.pushState = function pushState() {
    let ret = oldPushState.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  };
  let oldReplaceState = window.history.replaceState;
  window.history.replaceState = function replaceState() {
    let ret = oldReplaceState.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
  };
  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
  });
  let changeevent = function () {
    setCount((new Date()).valueOf());
  }
  window.removeEventListener('locationchange', changeevent, { passive: true });
  window.addEventListener('locationchange', changeevent);
  return (
    < BrowserRouter >
      <Routes>
        <Route element={<EmptyLayout />}>
          <Route path="login" element={<Login />} />
        </Route>
        <Route element={<MainLayout />} >
          <Route index path='/overview' element={<ChiTietBangThongKe MenuName="Tổng quan" />} />
          <Route exact path="*" element={(((count) => {
            let arr = (document.location || '').pathname.split('/');
            let Vpagef = ((arr[arr.length - 1] || '') + '').trim();
            let menu = JSON.parse(localStorage.getItem('mainMenu')) || [];
            let VIEW_CLASS = '';
            let ParentName = '';
            let MenuName = '';
            for (let ii = 0; ii < menu.length; ii++) {
              const prmenu = menu[ii];

              if (prmenu.children && prmenu.children[0]) {
                for (let jj = 0; jj < prmenu.children.length; jj++) {
                  const cmenu = prmenu.children[jj];
                  if (cmenu.VIEW_PAGE === Vpagef) {
                    MenuName = cmenu.text;
                    ParentName = prmenu.text;
                    VIEW_CLASS = cmenu.VIEW_CLASS;
                  }
                }
              }
            }
            let Show = RouterLink[VIEW_CLASS];
            if (Show === undefined) {
              Show = EmptyLayout;
              if (!JSON.parse(localStorage.getItem('mainMenu'))) setInterval(() => { if (JSON.parse(localStorage.getItem('mainMenu'))) { window.location.reload(); } }, 300)
            }

            return <Show ParentName={ParentName} MenuName={MenuName} VIEW_PAGE={Vpagef} VIEW_CLASS={VIEW_CLASS} />;
          })(count))} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
export default Router;
