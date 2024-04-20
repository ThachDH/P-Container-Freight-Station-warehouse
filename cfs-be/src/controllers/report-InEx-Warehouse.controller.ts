import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {DtPackageStockRepository, DtVesselVisitRepository, ReceiptsRepository} from '../repositories';
import {DT_PACKAGE_MNF_LDRepository} from '../repositories/dt-package-mnf-ld.repository';


const spec = {
  responses: {
    '200': {
      description: 'DT_PACKAGE_MNF_LD detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class reportInExWareHouseController {
  constructor(
    @repository(DtVesselVisitRepository)
    public dtVesselRepo: DtVesselVisitRepository,
    @repository(DtPackageStockRepository)
    public dtPackageStockRepo: DtPackageStockRepository,
    @repository(DT_PACKAGE_MNF_LDRepository)
    public dtPackageMnfRepo: DT_PACKAGE_MNF_LDRepository,
    @repository(ReceiptsRepository)
    public receiptsRepo: ReceiptsRepository,
  ) { }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };
  @post('/report/inExWareHouse', spec)
  async inExWareHouse(
    @requestBody() requestData: JSONObject
  ): Promise<any> {
    let FROM_DATE = requestData.FROM_DATE ? moment(String(requestData.FROM_DATE)).utcOffset(-8).format('YYYY-MM-DD HH:mm:ss') : '';
    let TO_DATE = requestData.TO_DATE ? moment(String(requestData.TO_DATE)).utcOffset(12).format('YYYY-MM-DD HH:mm:ss') : '';
    let temp = `
    select
	T0.CNTRNO as 'CNTRNO',
	T1.CNTRSZTP as 'CNTRSZTP',
	T2.VESSEL_NAME as 'VESSEL_NAME',
	(case when T0.class_code=1 then T2.INBOUND_VOYAGE else case when T0.class_code=2 then T2.OUTBOUND_VOYAGE end end) as 'INBOUND_OUTBOUND',
	T1.CONSIGNEE as 'CONSIGNEE',
	(case when T0.class_code=1 then T0.HOUSE_BILL else case when T0.class_code=2 then T0.BOOKING_FWD end end) as 'HB_BK',
	T0.ITEM_TYPE_CODE as 'ITEM_TYPE_CODE',
	T1.COMMODITYDESCRIPTION as 'COMMODITYDESCRIPTION',
	T1.CUSTOMER_NAME as 'CUSTOMER_NAME',
	T0.CARGO_PIECE as 'CARGO_PIECE',
	T0.UNIT_CODE as 'UNIT_CODE',
	T0.CARGO_WEIGHT as 'CARGO_WEIGHT',
	T0.CBM as 'CBM',
	T0.WAREHOUSE_CODE as 'WAREHOUSE_CODE',
	T0.TIME_IN as 'TIME_IN',
  T0.TIME_OUT as 'TIME_OUT',
	(case when T0.class_code=1 then T0.TKHN_NO else case when T0.class_code=2 then T0.TKHX_NO end end) as 'TLHQ',
	T0.TKHN_NO as 'TKHN_NO',
  T3.RECEIPT_NO as 'RECEIPT_NO',
	T0.ORDER_NO as 'ORDER_NO',
	(DAY(Getdate() - T0.TIME_IN)+1) as 'STOCK_TIME',
	T0.NOTE as 'NOTE',
* from
DT_PACKAGE_STOCK T0 inner join DT_PACKAGE_MNF_LD T1 on T0.VOYAGEKEY=T1.VOYAGEKEY
and (T0.CLASS_CODE= 1 and T0.CLASS_CODE=t1.CLASS_CODE and T0.HOUSE_BILL=T1.HOUSE_BILL) or (T0.CLASS_CODE=2 and T0.CLASS_CODE=t1.CLASS_CODE and T0.BOOKING_FWD=T1.BOOKING_FWD)
left join DT_VESSEL_VISIT T2 on T0.VOYAGEKEY=T2.VOYAGEKEY
left join RECEIPTS T3 on T0.VOYAGEKEY=T3.VOYAGEKEY and T0.ORDER_NO=T3.ORDER_NO
and (T0.CLASS_CODE= 1 and T3.CLASS_CODE=t1.CLASS_CODE and T0.HOUSE_BILL=T3.HOUSE_BILL) or (T0.CLASS_CODE=2 and T3.CLASS_CODE=t1.CLASS_CODE and T0.BOOKING_FWD=T3.BOOKING_FWD)
where T0.TIME_IN BETWEEN '${FROM_DATE}' AND '${TO_DATE}'`;
    if (requestData.CLASS_CODE) temp += `AND T0.CLASS_CODE = ${requestData.CLASS_CODE}`
    if (requestData.ITEM_TYPE_CODE) temp += `AND T0.ITEM_TYPE_CODE = '${requestData.ITEM_TYPE_CODE}'`
    if (requestData.STATUS === 'S,D') {
      let split = requestData.STATUS.split(',');
      temp += `AND T0.STATUS IN ('${split[0]}', '${split[1]}')`
    } else {
      temp += `AND T0.STATUS IN ('${requestData.STATUS}')`
    }
    return await this.dtPackageStockRepo.execute(temp)
      .then(data => {
        if (requestData.STATUS === 'S' && requestData.NumberDays !== '') {
          let arr: any = [], newData: any = [];
          for (let i = 0; i < data.length; i++) {
            let item = {...data[i]}
            let timeIn = new Date(item.TIME_IN[0]);
            let currentTime = new Date();
            let Days = Math.ceil((currentTime.getTime() - timeIn.getTime()) / (1000 * 3600 * 24));
            if (Number(Days) === Number(requestData.NumberDays)) {
              arr.push(item);
            }
          }
          for (let j = 0; j < arr.length; j++) {
              newData.push(arr[j]);
          }
          return newData;
        } else {
          return data;
        }
      });
  }
}
