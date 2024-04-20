import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {RECEIPTS} from '../models/receipts.model';
import {JOB_GATERepository} from '../repositories';
import { DT_ORDERRepository } from '../repositories';
import {ReceiptsRepository} from '../repositories/receipts.repository';

const spec = {
  responses: {
    '200': {
      description: 'RECEIPTS list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class ReceiptsController {
  constructor(
    @repository(DT_ORDERRepository)
    public DT_ORDERrepo: DT_ORDERRepository,
    @repository(ReceiptsRepository)
    public receiptsRepository: ReceiptsRepository,
    @repository(JOB_GATERepository)
    public JOB_GATERepo: JOB_GATERepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-View dữ liệu quản lý phiếu nhập xuất kho
  @post('/receipts/getItem')
  async getItem(
    @requestBody() reCeipt: any
  ): Promise<RECEIPTS[]> {
    try {
      let whereObj: any = {};
      if (!(reCeipt.FROM_DATE && reCeipt.TO_DATE)) {
        this.response['Status'] = false;
        this.response['Message'] = `Vui lòng gửi từ ngày đến ngày!`
        return this.response;
      }
      reCeipt.BILLOFLADING ? whereObj['BILLOFLADING'] = reCeipt.BILLOFLADING : '';
      reCeipt.BOOKING_NO ? whereObj['BOOKING_NO'] = reCeipt.BOOKING_NO : '';
      reCeipt.HOUSE_BILL ? whereObj['HOUSE_BILL'] = reCeipt.HOUSE_BILL : '';
      reCeipt.BOOKING_FWD ? whereObj['BOOKING_FWD'] = reCeipt.BOOKING_FWD : '';
      reCeipt.CNTRNO ? whereObj['CNTRNO'] = reCeipt.CNTRNO : '';
      let _from = reCeipt.FROM_DATE ? moment(String(reCeipt.FROM_DATE)).utcOffset(-8).format('YYYY-MM-DD HH:mm:ss') : '';
      let _to = reCeipt.TO_DATE ? moment(String(reCeipt.TO_DATE)).utcOffset(12).format('YYYY-MM-DD HH:mm:ss') : '';
      _from && _to ? whereObj['CREATE_DATE'] = {
        between: [_from, _to]
      } : '';
      reCeipt.JOB_TYPE ? whereObj['JOB_TYPE'] = reCeipt.JOB_TYPE : '';
      reCeipt.CLASS_CODE ? whereObj['CLASS_CODE'] = reCeipt.CLASS_CODE : '';
      reCeipt.PAYER ? whereObj['PAYER'] = reCeipt.PAYER : '';
      let dataAll: any = await this.receiptsRepository.find({
        where: whereObj
      })
        .then((data: any) => {
          if (data.length) {
            return data;
          } else {
            this.response['Status'] = false;
            this.response['Payload'] = [];
            this.response['Message'] = "Không có dữ liệu cần tìm!";
            return this.response;
          }
        })
        .catch(() => {
          this.response['Status'] = false;
          this.response['Message'] = "Lỗi do quá trình load dữ liệu gặp sự cố!";
          return this.response;
        });
      let dataReturn: any = [];
      let dataFilter: any = dataAll.map((item: any) => item.ORDER_NO + "__" + item.RECEIPT_NO)
        .filter((item: any, index: any, self: any) => self.indexOf(item) === index) //loc nhung gia tri trung
      for (let i = 0; i < dataFilter.length; i++) {
        let orderNo = dataFilter[i].split("__")[0];
        let receiptNo = dataFilter[i].split("__")[1];
        let detail: any = [];
        let temp: any = dataAll.filter((item: any) => item.ORDER_NO == orderNo && item.RECEIPT_NO == receiptNo);
        let takeNoteFromDtOrder: any = await this.DT_ORDERrepo.find({
          where: {ORDER_NO: orderNo}
        })
        let dataHeader: any = {
          RECEIPT_NO: temp[0].RECEIPT_NO,
          ORDER_NO: temp[0].ORDER_NO,
          OWNER: temp[0].OWNER,
          PAYER: temp[0].PAYER,
          CNTRNO: temp[0].CNTRNO,
          JOB_TYPE: temp[0].JOB_TYPE,
          VESSEL_NAME: temp[0].VESSEL_NAME,
          NOTE: takeNoteFromDtOrder[0].NOTE,
          COMMODITYDESCRIPTION: temp[0].COMMODITYDESCRIPTION,
          RECEIPT_DATE: moment(temp[0].RECEIPT_DATE).utc().format('YYYY-MM-DD HH:mm:ss'),
          WAREHOUSE_CODE: temp[0].WAREHOUSE_CODE,
          CNTRSZTP: temp[0].CNTRSZTP,
          TRUCK_NO: temp[0].TRUCK_NO,
          VESSEL_BOUND: temp[0].VESSEL_BOUND,
          ADDRESS: temp[0].ADDRESS,
          CLASS_CODE: temp[0].CLASS_CODE,
        };
        dataHeader['BILLOFLADING'] = temp[0].BILLOFLADING ? temp[0].BILLOFLADING : '';
        dataHeader['BOOKING_NO'] = temp[0].BOOKING_NO ? temp[0].BOOKING_NO : '';
        temp.map((p: any) => {
          let dataDetail: any = {
            ITEM_TYPE_CODE_CNTR: p.ITEM_TYPE_CODE_CNTR,
            ACTUAL_CARGO_PIECE: p.ACTUAL_CARGO_PIECE,
            CARGO_WEIGHT: p.CARGO_WEIGHT,
            UNIT_CODE: p.UNIT_CODE,
            CBM: p.CBM,
            NOTE: p.NOTE,
            COMMODITYDESCRIPTION: p.COMMODITYDESCRIPTION,
            OWNER: p.OWNER
          };
          dataDetail['HOUSE_BILL'] = p.HOUSE_BILL ? p.HOUSE_BILL : '';
          dataDetail['BOOKING_FWD'] = p.BOOKING_FWD ? p.BOOKING_FWD : '';
          return detail.push(dataDetail);
        });
        dataHeader['Details'] = detail;
        dataReturn.push(dataHeader);
      }
      this.response['Status'] = true;
      this.response['Payload'] = dataReturn;
      this.response['Message'] = "Load dữ liệu thành công!";
      return this.response;
    } catch {
      this.response['Status'] = false;
      this.response['Payload'] = [];
      this.response['Message'] = "Không thể load dữ liệu!";
      return this.response;
    }
  }
}
