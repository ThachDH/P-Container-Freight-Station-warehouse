// Uncomment these imports to begin using these cool features!

import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {mapDataWithKey} from '../general';
import {BS_BLOCKRepository, DtPalletStockRepository, JOB_STOCKRepository} from '../repositories';

// import {inject} from '@loopback/core';

const spec = {
  responses: {
    '200': {
      description: 'JOB_GATE detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class JobStockController {
  constructor(
    @repository(BS_BLOCKRepository)
    public blockRepo: BS_BLOCKRepository,
    @repository(JOB_STOCKRepository)
    public stockRepo: JOB_STOCKRepository,
    @repository(DtPalletStockRepository)
    public palletRepo: DtPalletStockRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/job-stock/view', spec)
  async view(
    @requestBody() dataReq: any,
  ): Promise<any> {
    let arrPackage: any = [], arr: any = [];;
    if (!dataReq.WAREHOUSE_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp Mã kho !'
      return this.response;
    };

    const whereOder: object = {
      WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE
    };
    let arrPallet: any = await this.blockRepo.find({
      fields: ['WAREHOUSE_CODE', 'BLOCK', 'SLOT_COUNT', 'TIER_COUNT',
        'STATUS'],
      where: whereOder,
      order: ['TIER_COUNT', 'SLOT_COUNT']
    });

    await this.palletRepo.find({
      include: [
        {
          relation: 'packageStockInfo',
          scope: {
            fields: ['CARGO_PIECE']
          }
        },
        {
          relation: 'jobStockInfo',
          scope: {
            fields: ['JOB_TYPE']
          }
        }
      ],
      fields: ['WAREHOUSE_CODE', 'IDREF_STOCK', 'HOUSE_BILL', 'BOOKING_FWD', 'PALLET_NO', 'BLOCK', 'TIER', 'SLOT']
    })
      .then((data: any) => {
        data.map((item: any) => {
          let obj: any = {
            HOUSE_BILL: item.HOUSE_BILL,
            BOOKING_FWD: item.BOOKING_FWD,
            PALLET_NO: item.PALLET_NO,
            WAREHOUSE_CODE: item.WAREHOUSE_CODE,
            CARGO_PIECE: item.packageStockInfo.CARGO_PIECE,
            JOB_TYPE: item.jobStockInfo.JOB_TYPE,
            BLOCK: item.BLOCK,
            SLOT: item.SLOT,
            TIER: item.TIER,
          }
          return arrPackage.push(obj);
        })
      });

    arrPallet.map((itemCellAll: any) => {
      arrPackage.map((itemCellNotNull: any) => {
        let obj1: any = {
          WAREHOUSE_CODE: itemCellAll.WAREHOUSE_CODE,
          BLOCK: itemCellAll.BLOCK,
          TIER: itemCellAll.TIER_COUNT,
          SLOT: itemCellAll.SLOT_COUNT,
          STATUS: itemCellAll.STATUS,
          HOUSE_BILL: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
            && itemCellNotNull.BLOCK === itemCellAll.BLOCK
            && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
            && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
          ) ? itemCellNotNull.HOUSE_BILL : "",
          BOOKING_FWD: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
            && itemCellNotNull.BLOCK === itemCellAll.BLOCK
            && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
            && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
          ) ? itemCellNotNull.BOOKING_FWD : "",
          PALLET_NO: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
            && itemCellNotNull.BLOCK === itemCellAll.BLOCK
            && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
            && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
          ) ? itemCellNotNull.PALLET_NO : "",
          CARGO_PIECE: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
            && itemCellNotNull.BLOCK === itemCellAll.BLOCK
            && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
            && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
          ) ? itemCellNotNull.CARGO_PIECE : "",
          JOB_TYPE: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
            && itemCellNotNull.BLOCK === itemCellAll.BLOCK
            && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
            && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
          ) ? itemCellNotNull.JOB_TYPE : "",
        };
        return arr.push(obj1);
      });
    });

    let filterData: any = arr.filter((item: any) => item.HOUSE_BILL ? true : false);
    let filterNotData: any = arr.filter((item: any) => !item.HOUSE_BILL ? true : false);
    let data: any = filterData.concat(filterNotData).filter((person: any, index: any, arr: any) => {
      return arr.findIndex((p: any) =>
        p.WAREHOUSE_CODE === person.WAREHOUSE_CODE
        && p.BLOCK === person.BLOCK
        && p.TIER === person.TIER
        && p.SLOT === person.SLOT
      ) === index;
    });
    try {
      if (data.length) {
        this.response['Status'] = true;
        this.response['Payload'] = data.map((p: any) => mapDataWithKey('wareHouse', p));
        this.response['Message'] = "Load dữ liệu thành công!";
        return this.response;
      } else {
        this.response['Status'] = false;
        this.response['Payload'] = [];
        this.response['Message'] = "Không tìm thấy dữ liệu!";
        return this.response;
      }
    } catch {
      this.response['Status'] = false;
      this.response['Message'] = "Không thể lưu mới dữ liệu!";
      return this.response;
    }
  }

  @post('/job-stock/viewJobStock', spec)
  async viewJobStock(
    @requestBody() dataReq: any,
  ): Promise<any> {
    if (!dataReq.BLOCK?.length) {
      this.response['Status'] = true;
      this.response['Message'] = `Vui lòng cung cấp mã dãy!`;
      return this.response;
    }
    const whereOder: object = {
      WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE,
    };
    return await this.stockRepo.find({
      where: {
        and: [
          {JOB_STATUS: {neq: 'C'}},
          whereOder
        ]
      }
    })
      .then((data: any) => {
        if ((data.filter((item: any) => item.JOB_TYPE === 'NK' || (dataReq.BLOCK.includes(item?.BLOCK)))).length) {
          this.response['Status'] = true;
          this.response['Payload'] = data.filter((item: any) => item.JOB_TYPE === 'NK' || (dataReq.BLOCK.includes(item?.BLOCK)));
          this.response['Message'] = "Load dữ liệu thành công!";
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = "Không tìm thấy dữ liệu!";
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Không thể lưu mới dữ liệu!";
        return this.response;
      })
  }

  //Thoilc(*Note)-Xác nhận layout 3 phát sinh công việc cho xe nâng NKN/NKX
  @post('/job-stock/insert', spec)
  async insert(
    @requestBody() dataReq: JSONObject
  ): Promise<any> {
    let obj: any = {};
    if (!(dataReq.CLASS_CODE === 1 || dataReq.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại hướng!";
      return this.response;
    }
    if (!dataReq.CREATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
      return this.response;
    }
    if (dataReq.CLASS_CODE === 1) {
      obj = {
        VOYAGEKEY: dataReq.VOYAGEKEY,
        WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE,
        CLASS_CODE: dataReq.CLASS_CODE,
        JOB_TYPE: "NK",
        HOUSE_BILL: dataReq.HOUSE_BILL,
        ORDER_NO: dataReq.ORDER_NO,
        PIN_CODE: dataReq.PIN_CODE,
        PALLET_NO: dataReq.PALLET_NO,
        SEQ: dataReq.SEQ,
        ACTUAL_CARGO_PIECE: dataReq.ACTUAL_CARGO_PIECE,
        ACTUAL_UNIT: dataReq.ACTUAL_UNIT,
        ACTUAL_CARGO_WEIGHT: dataReq.ACTUAL_CARGO_WEIGHT,
        BLOCK: dataReq.BLOCK,
        SLOT: dataReq.SLOT,
        TIER: dataReq.TIER,
        JOB_STATUS: dataReq.JOB_STATUS,
        CREATE_BY: dataReq.CREATE_BY,
        CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss")
      };
    } else {
      obj = {
        VOYAGEKEY: dataReq.VOYAGEKEY,
        WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE,
        CLASS_CODE: dataReq.CLASS_CODE,
        JOB_TYPE: "NK",
        BOOKING_FWD: dataReq.BOOKING_FWD,
        ORDER_NO: dataReq.ORDER_NO,
        PIN_CODE: dataReq.PIN_CODE,
        PALLET_NO: dataReq.PALLET_NO,
        SEQ: dataReq.SEQ,
        ACTUAL_CARGO_PIECE: dataReq.ACTUAL_CARGO_PIECE,
        ACTUAL_UNIT: dataReq.ACTUAL_UNIT,
        ACTUAL_CARGO_WEIGHT: dataReq.ACTUAL_CARGO_WEIGHT,
        BLOCK: dataReq.BLOCK,
        SLOT: dataReq.SLOT,
        TIER: dataReq.TIER,
        JOB_STATUS: dataReq.JOB_STATUS,
        CREATE_BY: dataReq.CREATE_BY,
        CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss")
      };
    }

    await this.stockRepo.create(obj)
      .then((data: any) => {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = "Thêm mới thành công !!"
        return this.response;
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Thêm mới thất bại!!"
        return this.response;
      })
    return this.response
  }

}
