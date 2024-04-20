import { repository } from '@loopback/repository';
import { post, requestBody } from '@loopback/rest';
import moment from 'moment';
import { checkContSize } from '../general';
import { BS_BLOCKRepository, DT_CNTR_MNF_LDRepository, DtPackageStockRepository } from '../repositories';
const spec = {
  responses: {
    '200': {
      description: 'DASH_BOARD list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}
export class DASH_BOARDController {
  constructor(
    @repository(DtPackageStockRepository)
    public dtPackageStockRepo: DtPackageStockRepository,
    @repository(BS_BLOCKRepository)
    public BS_BLOCKRepo: BS_BLOCKRepository,
    @repository(DT_CNTR_MNF_LDRepository)
    public DT_CNTR_MNF_LDRepo: DT_CNTR_MNF_LDRepository,
  ) { }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/dash-board/getCapacity', spec)
  async getCapacity(
  ): Promise<any> {
    return this.BS_BLOCKRepo.execute(`select a.WAREHOUSE_CODE,a.BLOCK,a.SLOT_COUNT,a.TIER_COUNT,b.AVAILABLE_CELL from (select WAREHOUSE_CODE,BLOCK, MAX(SLOT_COUNT) as SLOT_COUNT, MAX(TIER_COUNT) as TIER_COUNT
    from BS_BLOCK
    group by BLOCK, WAREHOUSE_CODE ) as a  left join (select WAREHOUSE_CODE, BLOCK, count(Status) as AVAILABLE_CELL
    from BS_BLOCK
    where status = 1
    group by BLOCK, WAREHOUSE_CODE) as b
    on a.WAREHOUSE_CODE = b.WAREHOUSE_CODE and a.BLOCK = b.BLOCK`)
      .then(data => {
        if (!data.length) {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = `Không tìm thấy dữ liệu!`;
          return this.response;
        }
        let WAREHOUSE_CODEtemp: any = data.map((e: any) => e.WAREHOUSE_CODE);
        WAREHOUSE_CODEtemp = [...new Set(WAREHOUSE_CODEtemp)];
        let dataReturn: any = [];
        for (let i = 0; i < WAREHOUSE_CODEtemp.length; i++) {
          let temp: any = data.filter((e: any) => e.WAREHOUSE_CODE === WAREHOUSE_CODEtemp[i]).map((item: any) => {
            return {
              WAREHOUSE_CODE: item.WAREHOUSE_CODE,
              BLOCK: item.BLOCK,
              CAPACITY: Number(item.SLOT_COUNT) * Number(item.TIER_COUNT),
              UNAVAILABLE_CELL: item.AVAILABLE_CELL ? item.AVAILABLE_CELL : 0,
              AVAILABLE_CELL: item.AVAILABLE_CELL ? (Number(item.SLOT_COUNT) * Number(item.TIER_COUNT)) - item.AVAILABLE_CELL : (Number(item.SLOT_COUNT) * Number(item.TIER_COUNT)) - 0
            }
          })
          let tempObj: any = {
            WAREHOUSE_CODE: WAREHOUSE_CODEtemp[i],
            CAPACITY: 0,
            AVAILABLE_CELL: 0,
            UNAVAILABLE_CELL: 0
          };
          temp.map((e: any) => {
            tempObj['CAPACITY'] += Number(e.CAPACITY)
            tempObj['AVAILABLE_CELL'] += Number(e.AVAILABLE_CELL)
            tempObj['UNAVAILABLE_CELL'] += Number(e.UNAVAILABLE_CELL)
          })
          dataReturn.push(tempObj)
        }
        this.response['Status'] = true;
        this.response['Payload'] = dataReturn;
        return this.response;
      }
      )
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`;
        return this.response;
      })
  }

  @post('/dash-board/getStatictics', spec)
  async getStatictics(
    @requestBody() req: any
  ): Promise<any> {
    let whereObj: any = {};
    // if(!req.WAREHOUSE_CODE) {
    //   this.response['Status'] = false;
    //   this.response['Message'] = `Vui lòng cung cấp mã kho!`;
    //   return this.response;
    // }
    req.ITEM_TYPE_CODE ? whereObj['ITEM_TYPE_CODE'] = req.ITEM_TYPE_CODE : "";
    let _from, _to;
    if (req.month) {
      _from = moment(String(req.month), 'YYYY-MM').startOf('month'),
        _to = moment(String(req.month), 'YYYY-MM').endOf('month')
    }
    if (Object.keys(String(req.quarter)).length) {
      _from = moment(String(req.quarter?.year), 'YYYY').quarter(Number(req.quarter?.quarter)).startOf('quarter');
      _to = moment(String(req.quarter?.year), 'YYYY').quarter(Number(req.quarter?.quarter)).endOf('quarter');
    }
    if (req.year) {
      _from = moment(String(req.year), 'YYYY').startOf('year');
      _to = moment(String(req.year), 'YYYY').endOf('year');
    }
    _from && _to ? whereObj['CREATE_DATE'] = { between: [_from, _to] } : "";
    let FROM_DATE = moment(String(_from)).utcOffset(12).format('YYYY-MM-DD HH:mm:ss');
    let TO_DATE = moment(String(_to)).utcOffset(12).format('YYYY-MM-DD HH:mm:ss');
    let temp = `
    select
	T0.CNTRNO as 'CNTRNO',
	T1.CNTRSZTP as 'CNTRSZTP',
	(case when T0.class_code=1 then T0.HOUSE_BILL else case when T0.class_code=2 then T0.BOOKING_FWD end end) as 'HB_BK',
	T0.ITEM_TYPE_CODE as 'ITEM_TYPE_CODE',
	T1.CUSTOMER_NAME as 'CUSTOMER_NAME',
	T0.CARGO_PIECE as 'CARGO_PIECE',
	T0.CARGO_WEIGHT as 'CARGO_WEIGHT',
	T0.CBM as 'CBM',
	T0.WAREHOUSE_CODE as 'WAREHOUSE_CODE',
	(case when T0.class_code=1 then T0.TKHN_NO else case when T0.class_code=2 then T0.TKHX_NO end end) as 'TLHQ',
	T0.TKHN_NO as 'TKHN_NO',
	T0.ORDER_NO as 'ORDER_NO',
	(DAY(Getdate() - T0.TIME_IN)+1) as 'STOCK_TIME',
* from
DT_PACKAGE_STOCK T0 inner join DT_PACKAGE_MNF_LD T1 on T0.VOYAGEKEY=T1.VOYAGEKEY
and (T0.CLASS_CODE= 1 and T0.CLASS_CODE=t1.CLASS_CODE and T0.HOUSE_BILL=T1.HOUSE_BILL) or (T0.CLASS_CODE=2 and T0.CLASS_CODE=t1.CLASS_CODE and T0.BOOKING_FWD=T1.BOOKING_FWD)
where T0.TIME_IN BETWEEN '${FROM_DATE}' AND '${TO_DATE}'`;
    temp += `AND T0.STATUS IN ('S', 'D')`;
    return this.dtPackageStockRepo.execute(temp);
    return this.DT_CNTR_MNF_LDRepo.find({
      where: whereObj
    })
      .then(data => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = {
            cont20_1: data.filter(e => e.CLASS_CODE === 1 && checkContSize(String(e.CNTRSZTP)) === '20').length,
            cont20_2: data.filter(e => e.CLASS_CODE === 2 && checkContSize(String(e.CNTRSZTP)) === '20').length,
            cont40_1: data.filter(e => e.CLASS_CODE === 1).length,
            cont40_2: data.filter(e => e.CLASS_CODE === 2).length
          };
          this.response['Message'] = `Truy vấn dữ liệu thành công!`;
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = `Không tìm thấy dữ liệu!`;
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`;
        return this.response;
      })
  }



}
