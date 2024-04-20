// import https from "https";
import http from "http";
import moment from 'moment';

export function mapDataWithKey(parentKey: string, obj: any): object {
  let flattened: any = {};
  Object.keys(obj).map(key => {
    if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      Object.assign(flattened, mapDataWithKey(key, obj[key]));
    } else {
      let flattenData = obj[key];
      if (Object.prototype.toString.call(obj[key]) === '[object Date]') {
        flattenData = moment(obj[key]).format("DD/MM/YYYY");
      }
      flattened[parentKey + '_' + key] = flattenData;
    }
  });
  return flattened;
}

//Thoilc(*Note)-Tách thêm cột cho phần báo cáo tồn kho
export function mapDataWithKeyBaoCao(parentKey: string, obj: any): object {
  let flattened: any = {};
  Object.keys(obj).map(key => {
    if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      Object.assign(flattened, mapDataWithKey(key, obj[key]));
    } else {
      let flattenData = obj[key];
      if (Object.prototype.toString.call(obj[key]) === '[object Date]') {
        flattenData = moment(obj[key]).format("DD/MM/YYYY");
      }
      flattened[parentKey + '_' + key] = flattenData;
    }
  });
  //Link tham khảo: https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
  // Example: let days: number = +moment(new Date()).format('YYYY-MM-DD') - +moment(new Date()).format('YYYY-MM-DD')/10000;
  let whereObj = {
    goodsDetail_RowID: flattened.goodsDetail_RowID,
    goodsDetail_ReceiveNo: flattened.goodsDetail_ReceiveNo,
    goodsDetail_ItemNo: flattened.goodsDetail_ItemNo,
    goodsDetail_ItemName: flattened.goodsDetail_ItemName,
    goodsDetail_CustomerNo: flattened.goodsDetail_CustomerNo,
    goodsDetail_CustomerName: flattened.goodsDetail_CustomerName,
    goodsDetail_PalletNo: flattened.goodsDetail_PalletNo,
    goodsDetail_ContainerNo: flattened.goodsDetail_ContainerNo,
    goodsDetail_SealNo: flattened.goodsDetail_SealNo,
    goodsDetail_UnitCode: flattened.goodsDetail_UnitCode,
    goodsDetail_NetWeight: flattened.goodsDetail_NetWeight,
    goodsDetail_Quantity: flattened.goodsDetail_Quantity,
    goodsDetail_Total: flattened.goodsDetail_Total,
    goodsDetail_AmountPallet: flattened.goodsDetail_AmountPallet,
    goodsDetail_CellNo: flattened.goodsDetail_CellNo,
    goodsDetail_ExpiryDate: flattened.goodsDetail_ExpiryDate,
    goodsDetail_ReceiveDate: flattened.goodsDetail_ReceiveDate,
    goodsDetail__Length: flattened.goodsDetail__Length,
    goodsDetail__Width: flattened.goodsDetail__Width,
    goodsDetail__Height: flattened.goodsDetail__Height,
    goodsDetail_NetWeightDIM: flattened.goodsDetail_NetWeightDIM,
    goodsDetail_Description: flattened.goodsDetail_Description,
    goodsDetail_Note: flattened.goodsDetail_Note,
    goodsDetail_UserID: flattened.goodsDetail_UserID,
    goodsDetail_UserID_KCS: flattened.goodsDetail_UserID_KCS,
    goodsDetail_Status: flattened.goodsDetail_Status,
    goodsDetail_CreateTime: flattened.goodsDetail_CreateTime,
    goodsDetail_LocationNo: flattened.goodsDetail_LocationNo,
    goodsDetail_StogareSaveDate: (+new Date(moment(new Date()).format('YYYY-MM-DD')) - +new Date(moment(flattened.goodsDetail_ReceiveDate, 'DD/MM/YYYY').format('YYYY-MM-DD'))) / 86400000,
  }
  return whereObj;
}

//Thoilc(*Note)-Phát sinh pallet code
export function allowPalletCode(strPallletCode: string, StorageCode: any, jNumber: number): Array<any> {
  let dataArr: any = [];
  const idx = strPallletCode.lastIndexOf('-');
  const iNumber = parseInt(strPallletCode.slice(idx + 1));
  for (let i = iNumber + 1; i <= (iNumber + jNumber); i++) {
    dataArr.push(StorageCode + moment(new Date()).format("DDMMYY") + "-" + ('000' + i).substr(-3));
  }
  return dataArr;
}

//ThachHD(*Note) - Phát Sinh Pallet Code
export function createPalletCode(strUnitCode: any, StorageCode: any) {
  let dataArr: any = [];
  dataArr.push(strUnitCode + "-" + StorageCode + "-" + moment().format('YY'));
  return dataArr;
}

export function checkContSize(sizeType: string) {
  switch (sizeType.charAt(0)) {
    case "2":
      return "20";
    case "4":
      return "40";
    case "L":
    case "M":
    case "9":
      return "45";
    default:
      return "";
  }
}

// export function roundMoney(money: number) {
//   let roundedMoney: number = Number(money.toFixed(0));
//   if (roundedMoney % 500 === 0 || money < 500) {
//     return roundedMoney;
//   } else if (roundedMoney % 1000 < 500) {
//     return roundedMoney = roundedMoney - (roundedMoney % 1000) + 500
//   } else {
//     return roundedMoney = roundedMoney - (roundedMoney % 1000) + 1000
//   }
// }

export function roundMoney(money: number) {
  return (Math.round(money * 10) / 10).toFixed(0)
}

//Hàm xử lý request của BE
export const ccurl = async (data: any, options: any) => {
  const data_1 = await new Promise(async (resolve, reject) => {
    options['timeout'] = options['timeout'] || 10000;
    var req = http.request(options, (res) => {
      res.setEncoding('utf8');
      var endWithoutData = true;
      var response = "";
      res.on('data', (chunk) => {
        endWithoutData = false;
        if (!chunk) {
          reject("Failed to get response data");
        }
        else {
          response += chunk;
        }
      });
      res.on('timeout', () => {
        console.error('timeout', options, data);
        reject("timeout response data");
      });
      res.on('end', () => {
        if (endWithoutData) {
          reject('No more data in response.');
          return;
        }
        resolve(response);
      });
    });

    req.on('error', (e) => {
      reject(`problem with request: ${e.message}`);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
  return data_1;
}
