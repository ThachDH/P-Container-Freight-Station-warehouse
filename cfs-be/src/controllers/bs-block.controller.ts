import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {mapDataWithKey} from '../general';
import {BS_BLOCK} from '../models';
import {BS_BLOCKRepository, DtPalletStockRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'BS_BLOCK list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

export class BS_BLOCKController {
  constructor(
    @repository(BS_BLOCKRepository)
    public bsBlockRepository: BS_BLOCKRepository,
    @repository(DtPalletStockRepository)
    public palletRepo: DtPalletStockRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/bs-blocks/filterBlock', spec)
  async filterBlock(): Promise<any> {
    let dataFind: any = await this.bsBlockRepository.find({
      fields: ["BLOCK"],
    });
    let grpData: any = dataFind.map((p: any) => p.BLOCK);
    this.response['Payload'] = [...new Set(grpData)]
    this.response['Status'] = true;
    return this.response;
  }

  @post('/bs-blocks/view', spec)
  async view(): Promise<BS_BLOCK[]> {
    this.response['Payload'] = await this.bsBlockRepository.find({
      fields: ["ID", "WAREHOUSE_CODE", "BLOCK", "TIER_COUNT", "SLOT_COUNT", "STATUS"],
      order: ['BLOCK', 'TIER_COUNT', 'SLOT_COUNT']
    });
    this.response['Status'] = true;
    return this.response;
  }

  @post('/bs-blocks/delete', spec)
  async delete(
    @requestBody() dataReq: BS_BLOCK[],
  ): Promise<any> {
    return Promise.all(dataReq.map(async item => {
      let WAREHOUSE_CODE: any = item.WAREHOUSE_CODE ? item.WAREHOUSE_CODE : null;
      let BLOCK: any = item.BLOCK ? item.BLOCK : null;

      try {
        return await this.bsBlockRepository.deleteAll({
          WAREHOUSE_CODE: WAREHOUSE_CODE,
          BLOCK: BLOCK
        })
          .then((data) => {
            this.response['Status'] = true;
            this.response['Payload'] = data;
            this.response['Message'] = "Xóa dữ liệu thành công!";
            return this.response;
          })
      } catch {
        this.response['Status'] = false;
        this.response['Message'] = "Xóa dữ liệu không thành công!";
      }

    })).then((value) => {
      return this.response;
    })
  }

  @post('/bs-blocks/saveData', spec)
  async saveData(
    @requestBody() json: JSONObject[],
  ): Promise<any> {
    return Promise.all(json.map(async (item: any) => {
      let status = item.status ? item.status : undefined;
      let WAREHOUSE_CODE: string = item.WAREHOUSE_CODE ?? null;
      let BLOCK: string = item.BLOCK ?? null;
      let TIER_COUNT: number = item.TIER_COUNT ?? null;
      let SLOT_COUNT: number = item.SLOT_COUNT ?? null;

      if (!WAREHOUSE_CODE || !BLOCK || !TIER_COUNT || !SLOT_COUNT) {
        this.response["Message"] = "Vui lòng nhập đầy đủ thông tin dãy!";
        return;
      };

      switch (status) {
        case 'insert':
          let checkCode = await this.bsBlockRepository.find({
            where: {
              WAREHOUSE_CODE: WAREHOUSE_CODE,
              BLOCK: BLOCK
            }
          });

          if (checkCode.length) {
            this.response['Status'] = false;
            this.response['Message'] = "Thông tin dãy đã tồn tại!";
            return this.response;
          }

          // -----------------------------------------------
          let blockData: Array<Object> = [];
          for (let i1 = 1; i1 <= TIER_COUNT; i1++) {
            for (let i2 = 1; i2 <= SLOT_COUNT; i2++) {
              blockData.push({
                WAREHOUSE_CODE: WAREHOUSE_CODE,
                BLOCK: BLOCK,
                TIER_COUNT: i1,
                SLOT_COUNT: i2,
                STATUS: 0,
                CREATE_BY: item.CREATE_BY ? item.CREATE_BY : null,
                CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss")
              });
            }
          }
          await this.bsBlockRepository.createAll(blockData).then(async result => {
            this.response['Status'] = true;
            this.response['Payload'] = result;
            this.response['Message'] = "Lưu dữ liệu thành công!";
            return this.response;
          }).catch((err: any) => {
            this.response['Status'] = false;
            this.response['Payload'] = err;
            this.response['Message'] = "Không thể lưu mới dữ liệu!";
            return this.response;
          });
          break;

        case 'update':
          if (!item.UPDATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
            return this.response;
          }
          try {
            await this.bsBlockRepository.deleteAll({
              and: [
                {WAREHOUSE_CODE: WAREHOUSE_CODE},
                {BLOCK: BLOCK}
              ]
            })
              .then(() => this.response['Status'] = true);
            if (this.response['Status']) {
              // -----------------------------------------------
              let blockData: Array<Object> = [];
              for (let i1 = 1; i1 <= TIER_COUNT; i1++) {
                for (let i2 = 1; i2 <= SLOT_COUNT; i2++) {
                  blockData.push({
                    WAREHOUSE_CODE: WAREHOUSE_CODE,
                    BLOCK: BLOCK,
                    TIER_COUNT: i1,
                    SLOT_COUNT: i2,
                    STATUS: 0,
                    CREATE_BY: item.UPDATE_BY ? item.UPDATE_BY : null,
                    CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss"),
                    UPDATE_BY: item.UPDATE_BY ? item.UPDATE_BY : null,
                    UPDATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss"),
                  });
                }
              }
              return await this.bsBlockRepository.createAll(blockData)
                .then((data: any) => {
                  this.response['Status'] = true;
                  this.response['Payload'] = data;
                  this.response['Message'] = "Lưu dữ liệu thành công!";
                  return this.response;
                })
                .catch((err: any) => {
                  this.response['Status'] = false;
                  this.response['Payload'] = err;
                  this.response['Message'] = "Không thể lưu mới dữ liệu!";
                  return this.response;
                });
            }
          } catch {
            this.response['Status'] = false;
            this.response['Message'] = "Không thể lưu mới dữ liệu!";
            return this.response;
          }
        default:
          return {Status: false, Payload: item.status, message: 'Không tìm thấy trạng thái'};
      }
    }
    )).then(() => {
      return this.response;
    });
  }

  //Thoilc(*Note)-View ô đang chứa hàng ở màn hình xe nâng
  @post('/bs-blocks/viewCell', spec)
  async viewCell(
    @requestBody() dataReq: any,
  ): Promise<any> {
    let arrPackage: any = [], arr: any = [];;
    if (!dataReq.WAREHOUSE_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp Mã kho !'
      return this.response;
    };

    if (!dataReq.BLOCK.length) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp mã dãy!';
      return this.response;
    };

    let arrPallet: any = await this.bsBlockRepository.find({
      fields: ['WAREHOUSE_CODE', 'BLOCK', 'SLOT_COUNT', 'TIER_COUNT',
        'STATUS'],
      where: {
        BLOCK: {inq: dataReq.BLOCK},
        WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE
      },
      order: ['BLOCK', 'TIER_COUNT', 'SLOT_COUNT']
    });

    await this.palletRepo.find({
      include: [
        {
          relation: 'packageStockInfo',
          scope: {
            fields: ['CARGO_PIECE', 'CLASS_CODE']
          }
        },
        {
          relation: 'jobStockInfo',
          scope: {
            fields: ['JOB_TYPE']
          }
        }
      ],
      fields: ['ID', 'WAREHOUSE_CODE', 'IDREF_STOCK', 'HOUSE_BILL', 'BOOKING_FWD', 'PALLET_NO', 'CARGO_PIECE', 'BLOCK', 'TIER', 'SLOT', 'STATUS']
    })
      .then((data: any) => {
        data.map((item: any) => {
          let obj: any = {
            ID: item.ID,
            HOUSE_BILL: item.HOUSE_BILL,
            BOOKING_FWD: item.BOOKING_FWD,
            PALLET_NO: item.PALLET_NO,
            WAREHOUSE_CODE: item.WAREHOUSE_CODE,
            IDREF_STOCK: item.IDREF_STOCK,
            CARGO_PIECE: item.packageStockInfo ? item.CARGO_PIECE : '',
            CLASS_CODE: item.packageStockInfo ? item.packageStockInfo.CLASS_CODE : '',
            JOB_TYPE: item.jobStockInfo ? item.jobStockInfo.JOB_TYPE : '',
            BLOCK: item.BLOCK,
            SLOT: item.SLOT,
            TIER: item.TIER,
            STATUS: item.STATUS,
          }
          return arrPackage.push(obj);
        });
      });
    arrPallet.map((itemCellAll: any, index: any) => {
      if (arrPackage.length) {
        arrPackage.map((itemCellNotNull: any) => {
          let obj: any = {
            index: index + 1,
            ID: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
              && itemCellNotNull.BLOCK === itemCellAll.BLOCK
              && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
              && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
              && itemCellNotNull.STATUS === 'S'
            ) ? itemCellNotNull.ID : "",
            WAREHOUSE_CODE: itemCellAll.WAREHOUSE_CODE,
            BLOCK: itemCellAll.BLOCK,
            TIER: itemCellAll.TIER_COUNT,
            SLOT: itemCellAll.SLOT_COUNT,
            STATUS: itemCellAll.STATUS,
            IDREF_STOCK: itemCellNotNull.IDREF_STOCK,
            UNIT_CODE: itemCellNotNull.UNIT_CODE,
            HOUSE_BILL: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
              && itemCellNotNull.BLOCK === itemCellAll.BLOCK
              && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
              && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
              && itemCellNotNull.STATUS === 'S'
            ) ? itemCellNotNull.HOUSE_BILL : "",
            BOOKING_FWD: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
              && itemCellNotNull.BLOCK === itemCellAll.BLOCK
              && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
              && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
              && itemCellNotNull.STATUS === 'S'
            ) ? itemCellNotNull.BOOKING_FWD : "",
            PALLET_NO: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
              && itemCellNotNull.BLOCK === itemCellAll.BLOCK
              && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
              && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
              && itemCellNotNull.STATUS === 'S'
            ) ? itemCellNotNull.PALLET_NO : "",
            CARGO_PIECE: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
              && itemCellNotNull.BLOCK === itemCellAll.BLOCK
              && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
              && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
              && itemCellNotNull.STATUS === 'S'
            ) ? itemCellNotNull.CARGO_PIECE : "",
            JOB_TYPE: (itemCellNotNull.WAREHOUSE_CODE === itemCellAll.WAREHOUSE_CODE
              && itemCellNotNull.BLOCK === itemCellAll.BLOCK
              && itemCellNotNull.TIER === itemCellAll.TIER_COUNT
              && itemCellNotNull.SLOT === itemCellAll.SLOT_COUNT
              && itemCellNotNull.STATUS === 'S'
            ) ? itemCellNotNull.JOB_TYPE : "",
          };
          return arr.push(obj);
        });
      } else {
        let obj1: any = {
          WAREHOUSE_CODE: itemCellAll.WAREHOUSE_CODE,
          BLOCK: itemCellAll.BLOCK,
          TIER: itemCellAll.TIER_COUNT,
          SLOT: itemCellAll.SLOT_COUNT,
          STATUS: itemCellAll.STATUS,
        };
        return arr.push(obj1);
      }
    });
    let filterData: any = arr.filter((item: any) => item.HOUSE_BILL || item.BOOKING_FWD ? true : false);
    let filterNotData: any = arr.filter((item: any) => !item.HOUSE_BILL || !item.BOOKING_FWD ? true : false);
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
        this.response['Payload'] = (data.map((p: any) => mapDataWithKey('wareHouse', p))).sort(this.dynamicSort('wareHouse_index'));
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

  dynamicSort(property: any) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a: any, b: any) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }


}
