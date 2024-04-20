import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {DT_PALLET_STOCK} from '../models';
import {BS_BLOCKRepository, DtPackageStockRepository, DtPalletStockRepository, JOB_GATERepository, JOB_STOCKRepository} from '../repositories';
import {JOB_QUANTITY_CHECKRepository} from '../repositories/job-quantity-check.repository';
const spec = {
  responses: {
    '200': {
      description: 'Pallet Stock with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}


export class DtPalletStockController {
  constructor(
    @repository(DtPalletStockRepository)
    public dtpalletstockRepository: DtPalletStockRepository,
    @repository(JOB_STOCKRepository)
    public jobStockRepo: JOB_STOCKRepository,
    @repository(DtPackageStockRepository)
    public dtPackageRepo: DtPackageStockRepository,
    @repository(JOB_QUANTITY_CHECKRepository)
    public jobQuantityCheck: JOB_QUANTITY_CHECKRepository,
    @repository(JOB_GATERepository)
    public JOB_GATERepo: JOB_GATERepository,
    @repository(BS_BLOCKRepository)
    public BLOCKRepo: BS_BLOCKRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/pallet-stock/view', spec)
  async view(): Promise<DT_PALLET_STOCK[]> {
    return this.dtpalletstockRepository.find();
  }

  //Thoilc(*Note)-Bỏ công việc vào bên trong ô
  @post('/pallet-stock/pushToWareHourse', spec)
  async pushToWareHourse(
    @requestBody() dataReq: any,
  ): Promise<any> {
    // let flag: boolean = false;
    // let getID: any
    if (!dataReq.CLASS_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp hướng!';
      return this.response;
    }
    let wherePackageStock: any = {
      VOYAGEKEY: dataReq.VOYAGEKEY,
      WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE,
      CLASS_CODE: dataReq.CLASS_CODE,
      [dataReq.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: dataReq.CLASS_CODE === 1 ? dataReq.HOUSE_BILL : dataReq.BOOKING_FWD,
      ORDER_NO: dataReq.ORDER_NO,
    };
    let getID: any = await this.dtPackageRepo.find({
      where: wherePackageStock
    })
      .then((data: any) => {
        if (data.length) {
          return data[0].ID;
        } else {
          this.response['Status'] = false;
          this.response['Message'] = 'Không tìm thấy kiện hàng phù hợp!';
          return this.response;
        }
      });
    // if (dataReq.CLASS_CODE === 1) {
    //   getID = await this.dtPackageRepo.find({
    //     where: {
    //       and: [
    //         {VOYAGEKEY: dataReq.VOYAGEKEY},
    //         {WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE},
    //         {CLASS_CODE: dataReq.CLASS_CODE},
    //         {HOUSE_BILL: dataReq.HOUSE_BILL},
    //         {ORDER_NO: dataReq.ORDER_NO}
    //       ]
    //     }
    //   })
    //     .then((data: any) => {
    //       if (data.length) {
    //         return data[0].ID;
    //       } else {
    //         flag = true;
    //         this.response['Status'] = false;
    //         this.response['Message'] = 'Không tìm thấy kiện hàng phù hợp!';
    //         return this.response;
    //       }
    //     })
    // } else if (dataReq.CLASS_CODE === 2) {
    //   getID = await this.dtPackageRepo.find({
    //     where: {
    //       and: [
    //         {VOYAGEKEY: dataReq.VOYAGEKEY},
    //         {WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE},
    //         {CLASS_CODE: dataReq.CLASS_CODE},
    //         {BOOKING_FWD: dataReq.BOOKING_FWD},
    //         {ORDER_NO: dataReq.ORDER_NO}
    //       ]
    //     }
    //   })
    //     .then((data: any) => {
    //       if (data.length) {
    //         return data[0].ID;
    //       } else {
    //         flag = true;
    //         this.response['Status'] = false;
    //         this.response['Message'] = 'Không tìm thấy kiện hàng phù hợp!'
    //         return this.response;
    //       }
    //     })
    // }
    if (this.response['Status']) {
      return this.response;
    }
    // hạ pallet vô kho
    let updateObj: any = {
      JOB_STATUS: 'C',
      UPDATE_BY: dataReq.UPDATE_BY,
      UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    let updateCell: any = {
      STATUS: 1
    }

    let whereCellInBsBlock: any = {
      SLOT_COUNT: dataReq.SLOT,
      TIER_COUNT: dataReq.TIER,
      BLOCK: dataReq.BLOCK,
      WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE
    };

    await this.BLOCKRepo.updateAll(updateCell, whereCellInBsBlock);

    await this.jobStockRepo.updateById(dataReq.ID, updateObj)
      .then((data: any) => data)
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Chỉnh sửa dữ liệu thất bại';
        return this.response;
      });
    if (this.response['Status']) {
      return this.response;
    }
    //insert to DT_PALLET_STOCK
    let obj: any = {
      IDREF_STOCK: getID,
      HOUSE_BILL: dataReq.HOUSE_BILL,
      BOOKING_FWD: dataReq.BOOKING_FWD,
      PALLET_NO: dataReq.PALLET_NO,
      CARGO_PIECE: dataReq.ACTUAL_CARGO_PIECE,
      UNIT_CODE: dataReq.ACTUAL_UNIT,
      WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE,
      BLOCK: dataReq.BLOCK,
      SLOT: dataReq.SLOT,
      TIER: dataReq.TIER,
      NOTE: dataReq.NOTE,
      STATUS: 'S',
      CREATE_BY: dataReq.CREATE_BY,
      CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    let whereJobStock: any = {
      VOYAGEKEY: dataReq.VOYAGEKEY,
      ORDER_NO: dataReq.ORDER_NO,
      [dataReq.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: dataReq.CLASS_CODE === 1 ? dataReq.HOUSE_BILL : dataReq.BOOKING_FWD,
      CLASS_CODE: dataReq.CLASS_CODE,
      JOB_STATUS: 'A',
    };
    // dataReq.VOYAGEKEY ? whereJob['VOYAGEKEY'] = dataReq.VOYAGEKEY : '';
    let checkJob: any = await this.jobStockRepo.find({
      where: whereJobStock
    });
    if (!checkJob.length) {
      await this.dtPackageRepo.updateAll(
        {
          STATUS: 'S',
          UPDATE_BY: dataReq.CREATE_BY,
          UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          ORDER_NO: dataReq.ORDER_NO,
          [dataReq.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: dataReq.CLASS_CODE === 1 ? dataReq.HOUSE_BILL : dataReq.BOOKING_FWD,
          CLASS_CODE: dataReq.CLASS_CODE,
        }
      );
    }
    await this.dtpalletstockRepository.create(obj)
      .then((data: any) => {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = "Lưu dữ liệu thành công!";
        return this.response;
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Không thể lưu dữ liệu!";
        return this.response;
      });
    return this.response;
  }

  @post('/pallet-stock/update', spec)
  async update(
    @requestBody() dataReq: any
  ): Promise<any> {
    if (!dataReq.NewCell?.ID) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số ID!';
      return this.response;
    }
    if (!dataReq.NewCell?.UPDATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại tên người cập nhật!';
      return this.response;
    }

    let updateNewCell: any = {
      STATUS: 1
    }

    let updateOldCell : any = {
      STATUS: 0
    }

    let whereNewCellInBsBlock: any = {
      SLOT_COUNT: dataReq.NewCell?.SLOT,
      TIER_COUNT: dataReq.NewCell?.TIER,
      BLOCK: dataReq.NewCell?.BLOCK,
      WAREHOUSE_CODE: dataReq.NewCell?.WAREHOUSE_CODE
    };

    let whereOldCellInBsBlock: any = {
      SLOT_COUNT: dataReq.OldCell?.SLOT,
      TIER_COUNT: dataReq.OldCell?.TIER,
      BLOCK: dataReq.OldCell?.BLOCK,
      WAREHOUSE_CODE: dataReq.OldCell?.WAREHOUSE_CODE
    }

    await this.BLOCKRepo.updateAll(updateNewCell, whereNewCellInBsBlock);
    await this.BLOCKRepo.updateAll(updateOldCell, whereOldCellInBsBlock);

    dataReq.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
    await this.dtpalletstockRepository.updateById(Number(dataReq.NewCell?.ID), dataReq.NewCell)
      .then(() => {
        this.response['Status'] = true;
        this.response['Payload'] = dataReq.NewCell;
        this.response['Message'] = "Lưu dữ liệu thành công!";
        return this.response;
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Không thể lưu mới dữ liệu!";
        return this.response;
      })
    return this.response;
  }

  //Thoilc(*Note)-Xe nâng hoàn tất công việc
  @post('/pallet-stock/confirmJobStock', spec)
  //khi xe nâng hoàn tất từng pallet,
  // VD hoàn tất pallet số 1, dữ liệu insert vào bảng job_quantity_check
  // 1 record của pallet số 1, job_quantity_check.jobstatus = 'A'
  async confirmJobStock(
    @requestBody() dataReq: any,
  ): Promise<any> {
    let flag: Boolean = false;
    if (!dataReq.IDREF_STOCK) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp IDREF_STOCK!';
      return this.response;
    }
    // dựa theo IDRef để tìm thông tin trong dt Package_Stock
    let packageStockInfo: any = await this.dtPackageRepo.find({
      where: {
        ID: dataReq.IDREF_STOCK,
      }
    })
      .then((data: any) => {
        if (data.length === 1) {
          return data[0];
        } else {
          flag = true
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = 'Truy vấn không thành công thông tin Package!'
          return this.response;
        }
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Truy vấn không thành công thông tin Package!'
        return this.response;
      })

    if (flag) {
      return this.response;
    }
    //Tìm số SEQ tăng dần
    if (packageStockInfo.CLASS_CODE === 1) {
      await this.jobQuantityCheck.find({
        where: {HOUSE_BILL: dataReq.HOUSE_BILL},
        order: ['SEQ DESC'],
      })
        .then(data => {
          if (data.length === 0) {
            dataReq['SEQ'] = 1;
          } else {
            dataReq['SEQ'] = Number(data[0].SEQ) + 1;
          }
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = "Lỗi không tìm được hướng!";
          return this.response;
        });
    } else {
      await this.jobQuantityCheck.find({
        where: {BOOKING_FWD: dataReq.BOOKING_FWD},
        order: ['SEQ DESC'],
      })
        .then((data: any) => {
          if (data.length === 0) {
            dataReq['SEQ'] = 1;
          } else {
            dataReq['SEQ'] = Number(data[0].SEQ) + 1;
          }
        })
        .catch((err: any) => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = "Lỗi không tìm được booking no!";
          return this.response;
        });
    }

    let updateCell: any = {
      STATUS: 0
    }

    let whereCellInBsBlock: any = {
      SLOT_COUNT: dataReq.SLOT,
      TIER_COUNT: dataReq.TIER,
      BLOCK: dataReq.BLOCK,
      WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE
    };

    await this.BLOCKRepo.updateAll(updateCell, whereCellInBsBlock);

    let whereObj: any = {
      VOYAGEKEY: packageStockInfo.VOYAGEKEY,
      CLASS_CODE: packageStockInfo.CLASS_CODE,
      [packageStockInfo.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: packageStockInfo.CLASS_CODE === 1 ? packageStockInfo.HOUSE_BILL : packageStockInfo.BOOKING_FWD
    }
    packageStockInfo.HOUSE_BILL ? whereObj['HOUSE_BILL'] = packageStockInfo.HOUSE_BILL : '';
    packageStockInfo.BOOKING_FWD ? whereObj['BOOKING_FWD'] = packageStockInfo.BOOKING_FWD : '';

    const checkGate: any = await this.JOB_GATERepo.find({
      where: whereObj
    });
    let checkJobQuantityCheck: any = await this.jobQuantityCheck.find({
      include: [
        {
          relation: 'vesselInfo',
          scope: {
            fields: ['INBOUND_VOYAGE', 'OUTBOUND_VOYAGE', 'ETA', 'ETD', 'VESSEL_NAME']
          }
        },
      ],
      where: whereObj,

    });

    if (checkGate.length) {
      let tempVessel: any = {
        ETA: checkJobQuantityCheck[0]?.vesselInfo.ETA,
        ETD: checkJobQuantityCheck[0]?.vesselInfo.ETD,
        INBOUND_VOYAGE: checkJobQuantityCheck[0]?.vesselInfo.INBOUND_VOYAGE,
        OUTBOUND_VOYAGE: checkJobQuantityCheck[0]?.vesselInfo.OUTBOUND_VOYAGE,
        VESSEL_NAME: checkJobQuantityCheck[0]?.vesselInfo.VESSEL_NAME,
      };
      const TRUCK_NO: any = checkGate.map((item: any) => item.TRUCK_NO)[0];
      const ACTUAL_CARGO_WEIGHT = checkJobQuantityCheck.map((item: any) => item.ACTUAL_CARGO_WEIGHT)[0];
      let obj: any = {
        VOYAGEKEY: packageStockInfo.VOYAGEKEY,
        ITEM_TYPE_CODE: packageStockInfo.ITEM_TYPE_CODE,
        WAREHOUSE_CODE: packageStockInfo.WAREHOUSE_CODE,
        CLASS_CODE: packageStockInfo.CLASS_CODE,
        METHOD_CODE: packageStockInfo.CLASS_CODE === 1 ? "XKN" : "XKX",
        TRUCK_NO: TRUCK_NO,
        CNTRNO: packageStockInfo.CNTRNO,
        ORDER_NO: packageStockInfo.ORDER_NO,
        HOUSE_BILL: packageStockInfo.HOUSE_BILL,
        ESTIMATED_CARGO_PIECE: packageStockInfo.CARGO_PIECE,
        ACTUAL_UNIT: packageStockInfo.UNIT_CODE,
        ACTUAL_CARGO_PIECE: dataReq.CARGO_PIECE,
        ACTUAL_CARGO_WEIGHT: ACTUAL_CARGO_WEIGHT,
        SEQ: dataReq.SEQ,
        PALLET_NO: dataReq.PALLET_NO,
        BOOKING_FWD: packageStockInfo.BOOKING_FWD,
        PIN_CODE: packageStockInfo.PIN_CODE,
        START_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
        JOB_STATUS: 'A',
        CREATE_BY: packageStockInfo.CREATE_BY,
        CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      }
      //Thoilc(*Note)-Cập nhật hoàn tất công việc A -> C
      let tempObj: any = {
        PALLET_NO: dataReq.PALLET_NO,
        JOB_STATUS: 'A'
      }
      dataReq.HOUSE_BILL ? tempObj['HOUSE_BILL'] = dataReq.HOUSE_BILL : '';
      dataReq.BOOKING_FWD ? tempObj['BOOKING_FWD'] = dataReq.BOOKING_FWD : '';

      await this.jobStockRepo.updateAll({
        JOB_STATUS: 'C',
        UPDATE_BY: obj.CREATE_BY,
        UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      }, tempObj);
      //Thoilc(*Note)-Cập nhật hoàn tất công việc xe nâng hàng ra kho S -> D
      let tempObj1: any = {
        PALLET_NO: dataReq.PALLET_NO,
        BLOCK: dataReq.BLOCK,
        SLOT: dataReq.SLOT,
        TIER: dataReq.TIER,
      }
      dataReq.HOUSE_BILL ? tempObj1['HOUSE_BILL'] = dataReq.HOUSE_BILL : '';
      dataReq.BOOKING_FWD ? tempObj1['BOOKING_FWD'] = dataReq.BOOKING_FWD : '';
      await this.dtpalletstockRepository.updateAll({
        STATUS: 'D',
        UPDATE_BY: obj.CREATE_BY,
        UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      }, tempObj1);
      return await this.jobQuantityCheck.create(obj)
        .then((data: any) => {
          this.response['Status'] = true;
          this.response['Payload'] = Object.assign(tempVessel, data);
          this.response['Message'] = 'Xe nâng hoàn tất công việc!';
          return this.response;
        })
        .catch((err: any) => {
          this.response['Status'] = false
          this.response['Payload'] = err;
          this.response['Message'] = 'Xe nâng chưa hoàn tất công việc!';
          return this.response;
        });
    } else {
      this.response['Status'] = false
      this.response['Payload'] = [];
      this.response['Message'] = 'Không tìm thấy thông tin xe qua cổng!';
      return this.response;
    }
  }

  @post('/pallet-stock/viewPallet', spec)
  async viewPallet(
    @requestBody() dataReq: JSONObject,
  ): Promise<any> {
    if (!(dataReq.CLASS_CODE === 1 || dataReq.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp hướng";
      return this.response;
    }
    let whereObj: any = {};
    if (dataReq.CLASS_CODE === 1) {
      whereObj['HOUSE_BILL'] = dataReq.HOUSE_BILL
    } else {
      whereObj['BOOKING_FWD'] = dataReq.BOOKING_FWD
    }
    return this.dtpalletstockRepository.find({
      where: whereObj
    })
      .then(data => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = data;
          this.response['Message'] = 'Truy vấn dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = 'Không tìm thấy dữ liệu!';
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = [];
        this.response['Message'] = 'Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!';
        return this.response;
      })
  }
}
