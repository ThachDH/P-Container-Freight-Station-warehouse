
import {inject, JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  param,
  post,
  Request,
  requestBody,
  Response, RestBindings
} from '@loopback/rest';
import Entities from 'html-entities';
import https from 'https';
import moment from 'moment';
import parseString from 'xml2js';

// let parseString = require('xml2js').parseString;
import {BS_CUSTOMERRepository, BsUnitRepository, DT_ORDERRepository, INV_VATRepository, InvDftDtlRepository, InvDftRepository} from '../repositories';
import {DT_PACKAGE_MNF_LDRepository} from '../repositories/dt-package-mnf-ld.repository';

const ParseString = parseString.parseString

const decodeEntities = (encodedString: string) => {
  const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  const translate: Record<string, string> = {
    "nbsp": " ",
    "amp": "&",
    "quot": "\"",
    "lt": "<",
    "gt": ">"
  };
  return encodedString.replace(translate_re, (match, entity) => {
    return translate[entity];
  }).replace(/&#(\d+);/gi, (match, numStr) => {
    const num = parseInt(numStr, 10);
    return String.fromCharCode(num);
  });
}
const spec = {
  responses: {
    '200': {
      description: 'VAT INVOICE list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

const htmlspecialchars = (string: String) => {
  return string.toString()
    .trim()
    .replace(/\r/g, "")
    .replace(/\n/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const DOCSO = function () {
  const t = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

  const r = function (r: any, n: any) {
    let o = "", a = Math.floor(r / 10), e = r % 10;

    if (a > 1) {
      o = " " + t[a] + " mươi";
      if (1 == e) {
        o += " mốt";
      }
    } else if (1 == a) {
      o = " mười";
      if (1 == e) {
        o += " một";
      }
    } else if (n && e > 0) {
      o = " lẻ";
    }

    if (5 == e && a >= 1) {
      o += " lăm";
    } else if (4 == e && a >= 1) {
      o += " tư";
    } else if ((e > 1 || (1 == e && 0 == a))) {
      o += " " + t[e];
    }

    return o;
  }


  const n = function (n: any, o: any) {
    let a = "", e = Math.floor(n / 100)
    n = n % 100;

    if (o || e > 0) {
      a = " " + t[e] + " trăm";
      a += r(n, true);
    } else {
      a = r(n, false);
    }

    return a;
  }

  const o = function (t: any, r: any) {
    let o = "", a = Math.floor(t / 1e6)
    t = t % 1e6;

    if (a > 0) {
      o = n(a, r) + " triệu";
      r = true;
    }

    let e = Math.floor(t / 1e3);
    t = t % 1e3;

    if (e > 0) {
      o += n(e, r) + " ngàn";
      r = true;
    }

    if (t > 0) {
      o += n(t, r);
    }

    return o;
  }

  return {
    doc: function (r: any) {
      if (0 == r) {
        return t[0];
      }

      let n = "", a = "";
      do {
        let ty = r % 1e9;
        r = Math.floor(r / 1e9);
        n = r > 0 ? o(ty, true) + a + n : o(ty, false) + a + n;
        a = " tỷ";
      } while (r > 0);

      return n.trim();
    }
  }
}();
const convert_number_to_words = (so: any) => {
  return DOCSO.doc(so);
}
const strReplaceAssoc = (replace: any, subject: any) => {
  // sử dụng repaceAll thông tin mình điền vào file XML
  Object.keys(replace).forEach((k) => {
    let v = replace[k];
    subject = subject.replaceAll(k, v);
  });
  return subject;
}

const getContSize = (sztype: any) => {
  if (!sztype) {
    return "";
  }
  switch (sztype.substring(0, 1)) {
    case "2":
      return '20';
    case "4":
      return '40';
    case "L":
    case "M":
    case "9":
      return '45';
    default: return "";
  }

  return "";
}

const ccurl = (data: any, options: any) => {
  return new Promise(async (resolve, reject) => {
    options['timeout'] = options['timeout'] || 550000;
    let req = https.request(options, (res: any) => {
      res.setEncoding('utf8');
      let endWithoutData = true;
      let response = "";
      res.on('data', (chunk: any) => {
        endWithoutData = false;
        if (!chunk) {
          reject("Failed to get response data");
        }
        else {
          response += chunk;
        }
      });
      res.on('timeout', () => {
        reject("timeout response data");
        res.abort();
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
}
//post to vnpt invoice service
const curlToInvoiceService = (funcname: any, servicename: any, xmlbody: any, config: any) => {
  // global.WriteLog('curlToInvoiceService', `${funcname} - ${servicename} - ${xmlbody}`);
  return new Promise(async (resolve, reject) => {
    let xmlbase = config.xmlbase;
    let xmlsend = xmlbase.replace('XML_BODY', xmlbody);
    const options = {
      hostname: config.url,
      path: '/' + servicename + '.asmx',
      method: 'POST',
      headers: {
        'Content-Type': 'application/soap+xml;charset=UTF-8',
        'SOAPAction': `"http://tempuri.org/${funcname}"`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
        'Content-Length': Buffer.byteLength(xmlsend)
      }
    };

    ccurl(xmlsend, options)
      .then(xmlResponse => {
        // global.WriteLog('curlToInvoiceService', `xmlResponse - ${funcname} - ${servicename} - ${xmlResponse}`);
        resolve(xmlResponse)
      })
      .catch(err => {
        // global.WriteLog('curlToInvoiceService', `ERR - ${funcname} - ${servicename} - ${(typeof err === 'string' ? err : (err || { message: 'null' }).message)}`);
        reject(err);
      })
  });
}
//get result from vnpt response
const getResultData = (funcname: any, xmlResponse: any) => {
  if (!xmlResponse) {
    return "";
  }

  let funcresult = funcname + "Result";
  let regx = new RegExp("\<" + funcresult + "\>(.*)\<\/" + funcresult + "\>", "s");

  let result = xmlResponse.match(regx);
  return result && result.length > 1 ? result[1] : "";
}

//get error by code
const getERR_ImportAndPublish = (errnumber: any) => {
  let result = '';
  switch (errnumber) {
    case "1":
      result = "Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng";
      break;
    case "3": result = "Dữ liệu xml đầu vào không đúng quy định";
      break;
    case "7": result = "User name không phù hợp, không tìm thấy company tương ứng cho user.";
      break;
    case "20": result = "Pattern và serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng kí có sử dụng Pattern và serial truyền vào";
      break;
    case "5": result = "Không phát hành được hóa đơn.";
      break;
    case "10": result = "Lô có số hóa đơn vượt quá max cho phép";
      break;
    default: result = "Lỗi phát hành hoá đơn, mã lỗi: " + errnumber;
      break;
  }

  return `[Hệ thống VNPT] ${result}`;
}



const getConfig = async (partnerCode: any, terminalCode: any, testMode = 1) => {
  return {
    "url": "itchcm-tt78admindemo.vnpt-invoice.com.vn",
    "isHTTPS": true,
    "VNPT_SRV_ID": "itchcmservice",
    "VNPT_SRV_PWD": "Einv@oi@vn#pt20",
    "VNPT_PUBLISH_INV_ID": "itchcmadmin",
    "VNPT_PUBLISH_INV_PWD": "Einv@oi@vn#pt20",
    "INV_PATTERN": "1/001",
    "INV_SERIAL": "C23TSP",
    "PortalURL": "https://itchcm-tt78demo.vnpt-invoice.com.vn/",
    "PUBLISH_SERICE_ADDR": "PublishService",
    "PUBLISH_XML": {
      "PRODUCT_HEADER": "<Inv><key>MAIN_PINCODE</key><Invoice><CusCode>CUS_CODE</CusCode><CusName>CUS_NAME</CusName><CusAddress>CUS_ADDR</CusAddress><CusPhone/><CusTaxCode>CUS_TAXCODE</CusTaxCode><PaymentMethod>PAYMENT_METHOD</PaymentMethod><CurrencyUnit>CURRENCY_UNIT</CurrencyUnit><ExchangeRate>EXCHANGE_RATE</ExchangeRate><KindOfService/><Products>PRODUCT_CONTENT</Products><Total>SUM_AMOUNT</Total><VATRate>VAT_RATE</VATRate><VATAmount>VAT_AMOUNT</VATAmount><Amount>TOTAL_AMOUNT</Amount><AmountInWords>IN_WORDS</AmountInWords><Extra>VIEW_PINCODE</Extra><Extra1>INV_TYPE</Extra1><Extra2>VIEW_EXCHANGE_RATE</Extra2><Extra6>CUS_TAXCODE</Extra6></Invoice></Inv>",
      "PRODUCT_CONTENT": "<Product><ProdName>TRF_DESC</ProdName><ProdUnit>INV_UNIT</ProdUnit><ProdQuantity>QTY</ProdQuantity><ProdPrice>UNIT_RATE</ProdPrice><Total>AMT</Total><IsSum>0</IsSum></Product>"
    },
    "fnDownloadPDF": {
      "0": "downloadInvPDFNoPay",
      "1": "downloadInvPDFFkeyNoPay"
    },
    "fnDownloadXML": {
      "0": "downloadInvNoPay",
      "1": "downloadInvFkeyNoPay"
    },
    "xmlbase": "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\"><soap12:Body>XML_BODY</soap12:Body></soap12:Envelope>",
    "html_template_filename": "ITC-eInvoice-template.html"
  }
}

//get error by code
const getERR_CancelInv = (errnumber: any) => {
  let result = '';

  switch (errnumber) {
    case "1":
      result = "Tài khoản đăng nhập sai";
      break;
    case "2": result = "Không tồn tại hóa đơn cần hủy";
      break;
    case "8": result = "Hóa đơn đã được thay thế rồi, hủy rồi";
      break;
    case "9": result = "Trạng thái hóa đơn ko được hủy";
      break;
    default: result = "[$errnumber] Unknown error";
      break;
  }

  return `[Hệ thống VNPT] ${result}`;
}

//lay hoa don dang xml
const getInvoiceXML = (fkey = '', pattern = '', serial = '', number = '') => {
  return new Promise(async (resolve, reject) => {
    //get config for vnpt
    const config: any = await getConfig('VNPT', "SP-ITC");

    let withFkey = fkey != "" ? 1 : 0;
    let funcName = config.fnDownloadXML[withFkey];
    let tagFindingInfo = fkey != "" ? "<fkey>" + fkey + "</fkey>" : `<invToken>${pattern};${serial};${number}</invToken>`;
    let xmlcontent = `<${funcName} xmlns="http://tempuri.org/">
              ${tagFindingInfo}
              <userName>${config.VNPT_SRV_ID}</userName>
              <userPass>${config.VNPT_SRV_PWD}</userPass>
              </${funcName}>`;

    curlToInvoiceService(funcName, "PortalService", xmlcontent, config)
      .then(xmlResponse => {
        let responseContent = getResultData(funcName, xmlResponse);
        let errContent = '';
        switch (responseContent) {
          case 'ERR:1':
            errContent = "Tài khoản đăng nhập sai!";
            break;
          case 'ERR:4':
            errContent = "Không tìm thấy Pattern";
            break;
          case 'ERR:6':
            errContent = "Không tìm thấy hóa đơn";
            break;
          case 'ERR:7':
            errContent = "User name không phù hợp, không tìm thấy company tương ứng cho user.";
            break;
          case 'ERR:11':
            errContent = "Hóa đơn chưa thanh toán nên không xem được";
            break;
          case 'ERR:12':
            errContent = `Do lỗi đường truyền hóa đơn chưa được cấp mã cơ quan thuế (CQT), quý khách vui lòng truy cập sau để nhận hóa đơn hoặc truy cập link ${config.PortalURL} để xem trước hóa đơn chưa có mã`;
            break;
          case 'ERR:':
            errContent = "Lỗi khác!";
            break;
          default:
            if (responseContent.includes('ERR:')) {
              errContent = "Lỗi khác!";
            }
            break;
        }

        if (errContent != '') {
          reject({success: false, message: `[Hệ thống VNPT] ${errContent}`})
        }

        resolve({success: true, message: responseContent})
      })
      .catch(err => {
        reject({success: false, message: err})
      })
  })
}


export class IntVatController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private _req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @repository(InvDftDtlRepository)
    public invDftDtlRepo: InvDftDtlRepository,
    @repository(DT_PACKAGE_MNF_LDRepository)
    public DT_PACKAGE_MNF_LDRepo: DT_PACKAGE_MNF_LDRepository,
    @repository(DT_ORDERRepository)
    public dtOrderRepo: DT_ORDERRepository,
    @repository(BS_CUSTOMERRepository)
    public BS_CUSTOMERRepo: BS_CUSTOMERRepository,
    @repository(InvDftRepository)
    public invDftRepo: InvDftRepository,
    @repository(INV_VATRepository)
    public INV_VATRepo: INV_VATRepository,
    @repository(BsUnitRepository)
    public BsUnitRepo: BsUnitRepository,
    //phát hành hóa đơn điện tử
    public importAndPublish = (args: any) => {
      let TerminalCode = "SP-ITC";
      return new Promise(async (resolve, reject) => {
        let datas = args.datas;
        let cusTaxCode: any = args.cusTaxCode + '';
        let appliedCusTaxCode = !isNaN(cusTaxCode) && cusTaxCode.length == 13 ? `${cusTaxCode.slice(0, 10)}-${cusTaxCode.slice(10)}` : cusTaxCode;
        let cusCode = args.cusCode || args.cusTaxCode;
        let cusAddr = htmlspecialchars(args.cusAddr);
        let cusName = htmlspecialchars(args.cusName);
        let sum_amount = args.sum_amount;
        let vat_amount = args.vat_amount;
        let total_amount = args.total_amount;
        let transaction = args.transaction;
        let inv_type = args.inv_type;
        let exchange_rate = args.exchange_rate;
        let currencyInDetails = args.currencyInDetails;

        const config = args.config;
        let invinfo: any = '';
        //view exchange rate
        let view_exchange_rate = '';
        if (inv_type == currencyInDetails) {
          exchange_rate = 1;
        }

        if (exchange_rate != 0) {
          sum_amount = sum_amount * exchange_rate;
          total_amount = total_amount * exchange_rate;
          vat_amount = vat_amount * exchange_rate;
          view_exchange_rate = exchange_rate;
        }

        let dvt = inv_type == "VND" ? " đồng" : " đô la Mỹ";
        let amount_in_words = convert_number_to_words(total_amount);
        amount_in_words += dvt;
        // amount_in_words = htmlspecialchars(amount_in_words.capitalize()); gốc
        amount_in_words = htmlspecialchars(amount_in_words.toUpperCase());
        let pincode = datas[0]["PinCode"];
        let vatRate = parseFloat(datas[0]?.VatRate || "10");

        let xmlHeaderInv = config.PUBLISH_XML.PRODUCT_HEADER;
        let product_content = config.PUBLISH_XML.PRODUCT_CONTENT;
        let invHeaderData = {
          MAIN_PINCODE: pincode,
          CUS_CODE: cusCode,
          CUS_NAME: cusName,
          CUS_ADDR: cusAddr,
          CUS_TAXCODE: appliedCusTaxCode,
          PAYMENT_METHOD: "TM/CK",
          CURRENCY_UNIT: currencyInDetails,
          EXCHANGE_RATE: exchange_rate,
          SUM_AMOUNT: sum_amount,
          VAT_RATE: vatRate,
          VAT_AMOUNT: vat_amount,
          TOTAL_AMOUNT: total_amount,
          IN_WORDS: amount_in_words,
          VIEW_EXCHANGE_RATE: view_exchange_rate,
          INV_TYPE: inv_type,
          VIEW_PINCODE: pincode
        }
        let invData = strReplaceAssoc(invHeaderData, xmlHeaderInv);

        let strFinal = '';
        // let units: any = datas.map((p: any) => p.UnitCode).filter((v: any, i: any, s: any) => s.indexOf(v) === i);
        // let unitDatas: any = await this.BsUnitRepo.find({
        //   where: {
        //     UNIT_CODE: {inq: units}
        //   }
        // })
        //   .then(data => {
        //     if (data.length > 0) {
        //       return data.map(item => {
        //         return {
        //           UnitCode: item.UNIT_CODE,
        //           UnitName: item.UNIT_NAME
        //         }
        //       })
        //     }
        //   })

        for (let i = 0; i < datas.length; i++) {
          let item = Object.assign({}, datas[i]);
          let temp: any;
          if (typeof item === 'object' && Object.keys(item).length > 0) {
            temp = item['TariffName'];

            let sz = item["IsoSizetype"] ? getContSize(item["IsoSizetype"]) : (item["Size"] ? item["Size"] : '');
            if (sz != '') {
              temp += " (" + sz + item['FE'] + ")";
              let ext: any = (item.RemarkContainer || '').split(',').map((itemh: any) => itemh.trim());
              if (ext.length <= 5) {
                ext = ext.join(', ');
                temp += (ext ? '|@|' + ext : '');
              }
            }
            item['TRF_DESC'] = htmlspecialchars(decodeEntities(temp));
            // item['TRF_DESC'] = htmlspecialchars("Bieu cuoc test");
            // item['INV_UNIT'] = htmlspecialchars(unitDatas.filter((p: any) => p.UnitCode == item.UnitCode).map((p: any) => p.UnitName)[0] || item.UnitCode);
            item['INV_UNIT'] = htmlspecialchars(item.UnitName);

            item['UNIT_RATE'] = parseInt(item['UnitRate'].toString().replace(',', '')) || 0;

            item['AMT'] = parseInt(item['Amount'].toString().replace(',', '')) || 0;

            delete item['Amount'];

            item['QTY'] = htmlspecialchars(item['Qty']);
            delete item['Qty'];
            delete item['Unit'];
            if ((item['AMT'] + '') === '0') continue;
            strFinal += strReplaceAssoc(item, product_content);
          }
        }
        if (strFinal == '') {
          reject('nothing to publish')
          return;
        }

        let xmlInvData = "<![CDATA[<Invoices>" + invData.replace('PRODUCT_CONTENT', strFinal) + "</Invoices>]]>";
        let xmlbody = `
            <ImportAndPublishInv xmlns="http://tempuri.org/">
            <Account>${config.VNPT_PUBLISH_INV_ID}</Account>
            <ACpass>${config.VNPT_PUBLISH_INV_PWD}</ACpass>
            <xmlInvData>${xmlInvData}</xmlInvData>
            <username>${config.VNPT_SRV_ID}</username>
            <password>${config.VNPT_SRV_PWD}</password>
            <pattern>${config.INV_PATTERN}</pattern>
            <serial>${config.INV_SERIAL}</serial>
            <convert>0</convert>
        </ImportAndPublishInv>`;

        //remove all space between tag
        xmlbody = xmlbody.replace(/(\>)(\s)+(\<)/, '><');
        curlToInvoiceService("ImportAndPublishInv", config.PUBLISH_SERICE_ADDR || "PublishService", xmlbody, config)
          .then(xmlResponse => {
            let responseContent = getResultData("ImportAndPublishInv", xmlResponse);
            let responses = responseContent.split(':');
            if (responses.length > 1) {
              if (responses[0] == "ERR") {
                let errorMsg = getERR_ImportAndPublish(responses[1]);
                reject(errorMsg)
                return;
              }

              if (responses[0] == "OK") {
                invinfo = (responses[1] + '').split(';');
                if (invinfo.length > 0) {
                  let back = {
                    pattern: invinfo[0],
                    serial: invinfo[1].split("-")[0],
                    fkey: pincode,
                    invno: invinfo[1].split("_")[1],
                    OrderNo: datas[0]["OrderNo"],
                    JobModeCode: datas[0]["JobModeCode"],
                    main: datas[0].hasOwnProperty('main') ? datas[0]['main'] : true
                  };

                  resolve(back);

                  if (config.isGetMCCQThue) {
                    //add job get mccqt
                    const InvoiceModal = require('../../Model/invoice/InvoiceModel');
                    InvoiceModal.createJobGetMCCQThue(pincode, TerminalCode);
                  }
                  return;
                }
              }
            }
            else {
              reject(xmlResponse)
              return;
            }
          })
          .catch(err => {
            reject("curlToInvoiceService: " + (typeof err === 'string' ? err : (err || {message: 'null'}).message))
            return;
          })
      });
    },

    // view hóa đơn nháp
    public generateDraftInvoice = (args: any) => {
      return new Promise(async (resolve, reject) => {
        let datas = args.datas;
        let cusTaxCode: any = args.cusTaxCode + '';
        let appliedCusTaxCode = !isNaN(cusTaxCode) && cusTaxCode.length == 13 ? `${cusTaxCode.slice(0, 10)}-${cusTaxCode.slice(10)}` : cusTaxCode;

        let cusAddr = args.cusAddr;
        let cusName = args.cusName;
        let sum_amount = args.sum_amount;
        let vat_amount = args.vat_amount;
        let total_amount = args.total_amount;
        let inv_type = args.inv_type;
        let exchange_rate = args.exchange_rate;
        let currencyInDetails = args.currencyInDetails;

        const config = args.config;

        if (inv_type == currencyInDetails) {
          exchange_rate = 1;
        }

        if (exchange_rate != 0) {
          sum_amount = sum_amount * exchange_rate;
          total_amount = total_amount * exchange_rate;
          vat_amount = vat_amount * exchange_rate;
        }

        let vatRate = parseFloat(datas[0]?.VatRate) || "";
        let dvt = inv_type == "VND" ? " đồng" : " đô la Mỹ";
        let amount_in_words = convert_number_to_words(total_amount) + dvt;
        amount_in_words = htmlspecialchars(amount_in_words.toUpperCase());

        let invoiceData = {
          CEH_PATTERN: config.INV_PATTERN,
          CEH_SERIAL: config.INV_SERIAL,
          CEH_DAY_OF_INVOICE: moment().format('DD'),
          CEH_MONTH_OF_INVOICE: moment().format('MM'),
          CEH_YEAR_OF_INVOICE: moment().format('YYYY'),
          CEH_CUSTOMER_NAME: cusName,
          CEH_CUSTOMER_ADDRESS: cusAddr,
          CEH_CUSTOMER_TAXCODE: appliedCusTaxCode,
          CEH_PAYMENT_METHOD: 'TM/CK',
          CEH_PROD_DETAIL: '',
          CEH_TOTAL: sum_amount.toLocaleString(undefined, {minimumFractionDigits: 0}),
          CEH_VAT_RATE: `${vatRate} %`,
          CEH_VAT_AMOUNT: vat_amount.toLocaleString(undefined, {minimumFractionDigits: 0}),
          CEH_SUM_AMOUNT: total_amount.toLocaleString(undefined, {minimumFractionDigits: 0}),
          CEH_IN_WORDS: amount_in_words
        }

        let fs = require('fs');
        let path = require('path');
        let filedir = path.dirname('')
        fs.readFile(filedir, null, async (error: any, data: any) => {
          if (error) {
            reject('Không tìm thấy mẫu')
            return;
          }
          else {
            let strDetails = '';
            let invoice_details = `<tr style="height: 30px;">
                                          <td valign="top">
                                          <center>1</center>
                                          </td>
                                          <td style="padding-left:10px;" valign="top">
                                              <div class="ProdData" style="width:400px;">CEH_PROD_NAME</div>
                                          </td>
                                          <td style="padding-left:10px;" valign="top">
                                          <div class="ProdData" style="width:87px;">CEH_PROD_UNIT</div>
                                          </td>
                                          <td style="text-align:right; padding-right:10px;" valign="top">CEH_PROD_QTY</td>
                                          <td style="text-align:right; padding-right: 10px;" valign="top">CEH_PROD_PRICE</td>
                                          <td style="text-align:right; padding-right: 10px;" valign="top">CEH_PROD_AMOUNT</td>
                                      </tr>`;

            let units = datas.map((p: any) => p.UnitCode).filter((v: any, i: any, s: any) => s.indexOf(v) === i);
            let unitDatas: any = this.BS_CUSTOMERRepo.find({
              where: {
                CUSTOMER_CODE: {inq: units}
              }
            })
              .then(data => {
                if (data.length > 0) {
                  return data.map(item => {
                    return {
                      UnitCode: item.CUSTOMER_CODE,
                      UnitName: item.CUSTOMER_NAME
                    }
                  })
                }
              })

            for (let i = 0; i < datas.length; i++) {
              let item = datas[i];
              if (typeof item === 'object' && Object.keys(item).length > 0) {
                let n: any = {};
                let temp = item['TariffName'];
                let sz = item["IsoSizetype"] ? getContSize(item["IsoSizetype"]) : (item["Size"] ? item["Size"] : '');
                if (sz != '') {
                  temp += " (" + sz + item['FE'] + ")";
                }

                n['CEH_PROD_NAME'] = htmlspecialchars(decodeEntities(temp));
                n['CEH_PROD_UNIT'] = htmlspecialchars(unitDatas.filter((p: any) => p.UnitCode == item.UnitCode).map((p: any) => p.UnitName)[0] || item.UnitCode);
                n['CEH_PROD_QTY'] = htmlspecialchars(item['Qty']);
                let price = parseInt(item['UnitRate'].toString().replace(',', '')) || 0;
                n['CEH_PROD_PRICE'] = price.toLocaleString(undefined, {minimumFractionDigits: 0});

                let amt = parseInt(item['Amount'].toString().replace(',', '')) || 0;
                n['CEH_PROD_AMOUNT'] = amt.toLocaleString(undefined, {minimumFractionDigits: 0});

                strDetails += strReplaceAssoc(n, invoice_details);
              }
            }
            if (strDetails == '') {
              reject('Không tìm thấy mẫu')
              return;
            }
            invoiceData.CEH_PROD_DETAIL = strDetails;
            let finalStrInvoiceHtml = strReplaceAssoc(invoiceData, data.toString());

            resolve(finalStrInvoiceHtml)
            return;
          }
        });
      })
    }
  ) { }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  // @post('/vat-invoice/publish', spec)
  // async publish(
  //   @requestBody() req: any,
  // ): Promise<any> {
  //   const config = await getConfig('VNPT', 'SP-ITC');
  //   let args = {
  //     datas: req.datas.length > 0 ? req.datas : [],
  //     cusCode: req.cusCode ? req.cusCode : '',
  //     cusTaxCode: req.cusTaxCode ? req.cusTaxCode : '',
  //     cusAddr: req.cusAddr ? req.cusAddr : '',
  //     cusName: req.cusName ? req.cusName : '',
  //     sum_amount: req.sum_amount ? parseFloat(req.sum_amount) || 0 : 0,
  //     vat_amount: req.vat_amount ? parseFloat(req.vat_amount) || 0 : 0,
  //     total_amount: req.total_amount ? parseFloat(req.total_amount) || 0 : 0,
  //     transaction: req.transaction ? req.transaction : '',
  //     inv_type: req.inv_type ? req.inv_type : 'VND',
  //     //exchange_rate k có thì không gửi, exchange_rate là tỉ giá
  //     exchange_rate: req.exchange_rate ? parseFloat(req.exchange_rate) || 0 : 0,
  //     currencyInDetails: req.CURRENCYID ? req.CURRENCYID : 'VND',
  //     config: config
  //   }

  //   return this.importAndPublish(args)
  //     .then(result => {
  //       this.response['Status'] = true;
  //       this.response['Payload'] = result;
  //       this.response['Message'] = `Phát hành hóa đơn VNPT thành công!`;
  //       return this.response;
  //     })
  //     .catch(errMsg => {
  //       this.response['Status'] = false;
  //       this.response['Payload'] = errMsg;
  //       this.response['Message'] = "Phát hành hóa đơn VNPT thất bại!";
  //       return this.response;
  //     })
  // }

  @post('/vat-invoice/cancelInv', spec)
  async cancelInv(
    @requestBody() req: JSONObject,
  ): Promise<any> {
    let fkey = (req.fkey) ? req.fkey : '';
    const config = await getConfig('VNPT', "SP-ITC");

    let xmlcontent = `<cancelInv xmlns="http://tempuri.org/">
                                <Account>itchcmadmin</Account>
                                <ACpass>Einv@oi@vn#pt20</ACpass>
                                <fkey>${fkey}</fkey>
                                <userName>itchcmservice</userName>
                                <userPass>Einv@oi@vn#pt20</userPass>
                            </cancelInv>`;
    return curlToInvoiceService("cancelInv", "BusinessService", xmlcontent, config)
      .then(xmlResponse => {
        let responseContent = getResultData("cancelInv", xmlResponse);
        let responses = responseContent.split(":");
        if (responses.length > 0) {
          if (responses[0] == "ERR") {
            this.response['Status'] = false;
            this.response['Message'] = getERR_CancelInv(responses[1]);
            return this.response;
          }
          this.response['Status'] = true;
          this.response['Message'] = `Xóa hóa đơn thành công!`;
          return this.response;
        }
        this.response['Status'] = false;
        this.response['Message'] = responseContent;
        return this.response;
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Message'] = err;
        return this.response;
      })

  }
  catch(e: any) {
    this.response['Status'] = false;
    this.response['Message'] = e.message;
    return this.response;
  }

  //view hóa đơn nháp
  @post('/vat-invoice/view-draft-inv', spec)
  async view_draft_inv(
    @requestBody() req: JSONObject,
  ): Promise<any> {
    let pinCodes = req.fkeys;
    if (!Array.isArray(pinCodes)) {
      pinCodes = [pinCodes || ''];
    }

    let dataInv = await this.invDftRepo.find({
      include: [
        {
          relation: 'customerInfo'
        }
      ],
      where: {
        INV_NO: String(pinCodes)
      }
    })

    if (dataInv.length == 0) {
      this.response['Status'] = false;
      this.response['Payload'] = [];
      this.response['Message'] = "Không tìm thấy thông tin theo mã số hóa đơn nháp!"
      return this.response;
    }

    //get config for vnpt
    const config = await getConfig('VNPT', "SP-ITC");
    let draftParent = dataInv.map(p => p.INV_NO)
      .filter((v, i, s) => s.indexOf(v) === i)
      .map(draftNo => dataInv.filter(p => p.INV_NO == draftNo)[0]);

    let args = {
      datas: (dataInv.length > 0) ? dataInv : [],
      cusCode: (dataInv[0].PAYER) ? dataInv[0].PAYER : '',
      cusTaxCode: (dataInv[0]?.customerInfo?.CUSTOMER_CODE) ? dataInv[0]?.customerInfo?.CUSTOMER_CODE : '',
      cusAddr: (dataInv[0]?.customerInfo?.ADDRESS) ? dataInv[0]?.customerInfo?.ADDRESS : '',
      cusName: (dataInv[0]?.customerInfo?.CUSTOMER_NAME) ? dataInv[0]?.customerInfo?.CUSTOMER_NAME : '',
      sum_amount: draftParent.length > 0 ? draftParent.map((p: any) => p['SumAmount'] || 0).reduce((a, b) => parseFloat(a) + parseFloat(b)) : 0,
      vat_amount: draftParent.length > 0 ? draftParent.map((p: any) => p['VatAmount'] || 0).reduce((a, b) => parseFloat(a) + parseFloat(b)) : 0,
      total_amount: draftParent.length > 0 ? draftParent.map((p: any) => p['TotalAmount'] || 0).reduce((a, b) => parseFloat(a) + parseFloat(b)) : 0,
      inv_type: (dataInv[0].INV_TYPE) ? dataInv[0].INV_TYPE : 'VND',
      exchange_rate: (dataInv[0].RATE) ? (dataInv[0].RATE) || 0 : 0,
      currencyInDetails: (dataInv[0].CURRENCYID) ? dataInv[0].CURRENCYID : 'VND',
      config: config
    }

    return this.generateDraftInvoice(args)
      .then(result => result)
      .catch(errMsg => {
        console.log(errMsg)
      })
  }

  //tải hóa đơn dạng XML
  @post('/vat-invoice/downloadInvXML', spec)
  async downloadInvXML(
    @requestBody() req: any,
  ): Promise<any> {
    try {
      let pattern = req.pattern || '';
      let serial = req.serial || '';
      let number: any = req.number || 0;
      number = parseInt(number);

      let fkey = req.fkey || '';
      getInvoiceXML(fkey, pattern, serial, number)
        .then((xml: any) => {
          // res.writeHead(200, {'Content-Type': 'application/force-download', 'Content-disposition': 'attachment; filename=' + fkey + '.xml'});
          this.res.writeHead(200, {'Content-Type': 'application/force-download', 'Content-disposition': 'attachment; filename=' + fkey + '.xml'});
          this.res.status(200).end(Entities.decode(xml.message || ''));
          return;
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Message'] = err;
          return this.response;
        })
    }
    catch (e) {
      this.response['Status'] = false;
      this.response['Message'] = e.message;
      return this.response;
    }
  }

  //lay chi tiet hoa don: dạng data
  //tham so truyen vao
  //fkey
  // hoac mẫu hđ + ký hiệu hđ + số hđ + mã số thuế
  @post('/vat-invoice/loadInvoiceDetail', spec)
  async loadInvoiceDetail(
    @requestBody() req: any,
  ): Promise<any> {
    try {
      let mst: any = (req.mst) ? req.mst : '';

      if (htmlspecialchars(mst.trim()).length > 14 || htmlspecialchars(mst.trim()).length < 10) {
        this.response['Status'] = false;
        this.response['Message'] = '[Mã số thuế] không đúng!';
        return this.response;
      }

      let pattern: any = (req.pattern) ? req.pattern : '';

      if (htmlspecialchars(pattern.trim()).length > 14) {
        this.response['Status'] = false;
        this.response['Message'] = '[Mẫu hoá đơn] không đúng!';
        return this.response;
      }

      let serial: any = (req.serial) ? req.serial : '';
      if (htmlspecialchars(serial.trim()).length > 8) {
        this.response['Status'] = false;
        this.response['Message'] = '[Ký hiệu] không đúng!';
        return this.response;
      }

      let number: any = (req.number) ? parseFloat(req.number) || 0 : 0;
      if (number.trim().length > 7) {
        this.response['Status'] = false;
        this.response['Message'] = '[Số Hoá Đơn] không đúng!';
        return this.response;
      }

      let fkey = (req.sfkey) ? req.sfkey : '';

      if (htmlspecialchars(fkey.trim()).length > 15) {
        this.response['Status'] = false;
        this.response['Message'] = '[Mã Tra Cứu] không đúng!';
        return this.response;
      }

      if (fkey == '') {
        let cus: any = this.BS_CUSTOMERRepo.find({
          limit: 1,
          where: {
            TAX_CODE: mst
          }
        }).then(data => {
          if (data.length) {
            return data.map(e => e.ROWGUID)
          }
        })
        if (!cus || cus.length == 0) {
          this.response['Status'] = false;
          this.response['Message'] = '[Mã số thuế] không đúng!';
          return this.response;
        }
      }
      return getInvoiceXML(fkey, pattern, serial, number)
        .then((xml: any) => {
          let xmlRes = Entities.decode(xml.message);
          ParseString(xmlRes, {explicitArray: false}, function (err: any, result: any) {
            if (err) {
              return {
                Status: false, message: 'An error occurred! Please try again!'
              };;
            }

            if (result['Invoice']['Content']['CusTaxCode'] != mst) {
              return {
                Status: false, message: '[Mã số thuế] không đúng!'
              };
            }
            return {
              Status: true, message: 'Truy vấn dữ liệu thành công!', Payload: result.Invoice.Content
            };
          });
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Message'] = err;
          return this.response;
        })
    }
    catch (e) {
      this.response['Status'] = false;
      this.response['Message'] = e.message;
      return this.response;
    }
  }

  @get('/vat-invoice/downloadInvPDF/{id}', spec)
  async downloadInvPDF(
    // truyền params loopback 4
    @param.path.string('id') id: string
  ): Promise<any> {
    try {
      let fkey: any = id;
      let terminal_code = 'SP-ITC';
      let TerminalCode = terminal_code ? terminal_code : fkey.substring(0, 3).trim();

      //get config for vnpt
      const config = await getConfig('VNPT', TerminalCode);
      let withFkey = fkey != "" ? 1 : 0;
      let funcName: any;
      if (withFkey === 1) {
        funcName = config.fnDownloadPDF[1];
      } else {
        funcName = config.fnDownloadPDF[0];
      }

      let tagFindingInfo = `<fkey>${fkey}</fkey>`;
      let xmlcontent = `<${funcName} xmlns="http://tempuri.org/">
                      ${tagFindingInfo}
                      <userName>${config.VNPT_SRV_ID}</userName>
                      <userPass>${config.VNPT_SRV_PWD}</userPass>
                  </${funcName}>`;
      return curlToInvoiceService(funcName, "PortalService", xmlcontent, config)
        .then(async xmlResponse => {
          let responseContent = getResultData(funcName, xmlResponse);
          let errContent = '';
          switch (responseContent) {
            case 'ERR:1':
              errContent = "Tài khoản đăng nhập sai!";
              break;
            case 'ERR:6':
              errContent = "Không tìm thấy hóa đơn";
              break;
            case 'ERR:7':
              errContent = "User name không phù hợp, không tìm thấy company tương ứng cho user.";
              break;
            case 'ERR:12':
              errContent = `Do lỗi đường truyền hóa đơn chưa được cấp mã cơ quan thuế (CQT), quý khách vui lòng truy cập sau để nhận hóa đơn hoặc truy cập link ${config.PortalURL} để xem trước hóa đơn chưa có mã`;
              break;
            case 'ERR:':
              errContent = "Lỗi khác!";
              break;
            default:
              if (responseContent.includes('ERR:')) {
                errContent = "Lỗi khác!";
              }
              break;
          }

          if (errContent != '') {
            let result = {success: false, message: `[Hệ thống VNPT] ${errContent}`};
            return result.message
          }

          let name = `${fkey}.pdf`;
          let content: any = typeof Buffer.from === "function" ? Buffer.from(responseContent, 'base64') : new Buffer(responseContent, 'base64');

          this.res.set('Content-Type', 'application/pdf');
          this.res.set('Content-Length', content.length);
          this.res.set('Content-disposition', 'inline; filename="' + name + '"');
          this.res.send(content);
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = err;
          return this.response;
        })
    }
    catch (e) {
      this.response['Status'] = false;
      this.response['Payload'] = [];
      this.response['Message'] = e.message;
      return this.response;
    }
  }

  @post('/vat-invoice/publicVATInvoice', spec)
  async publicVATInvoice(
    @requestBody() req: any,
  ): Promise<any> {
    this.response['Status'] = true;
    if (!req.orderReq.length) {
      this.response['Status'] = false;
      this.response['Message'] = `Vui lòng cung cấp thông tin lưu lệnh!`;
      return this.response;
    }

    let orderReq: any = req.orderReq;
    let invVatReq: any = req.invVatReq;
    let drafReturn: any;
    //Xử lí lưu lệnh
    let orderReturn: any = await Promise.all(
      orderReq.map(async (item: any, index: number) => {
        let countPIN: string = `000${String(index + 1)}`.substr(-3);
        if (!item.VOYAGEKEY) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp key tàu!';
          return this.response;
        }
        if (!(item.CLASS_CODE === 1 || item.CLASS_CODE === 2)) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp hướng!';
          return this.response;
        }
        if (!item.CUSTOMER_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp mã khách hàng!';
          return this.response;
        }
        if (item.METHOD_CODE !== 'NKX' && !item.ACC_CD) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp mã hình thức thanh toán!';
          return this.response;
        }
        if (!item.ACC_TYPE && item.METHOD_CODE !== 'NKX') {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp loại thanh toán!';
          return this.response;
        }
        if (!item.ACC_CD && item.METHOD_CODE !== 'NKX') {
          this.response['Status'] = false;
          this.response['Message'] =
            'Vui lòng cung cấp mã hình thức thanh toán!';
          return this.response;
        }
        if (!item.ITEM_TYPE_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp mã loại hàng hóa!';
          return this.response;
        }
        // if (!item.EXP_DATE) {
        //   this.response['Status'] = false;
        //   this.response['Message'] = 'Vui lòng cung cấp ngày hết hạn lệnh!';
        //   return this.response;
        // }
        if (!item.METHOD_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp mã phương án!';
          return this.response;
        }
        if (!item.OWNER) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp thông tin chủ hàng!';
          return this.response;
        }
        if (!item.OWNER_REPRESENT) {
          this.response['Status'] = false;
          this.response['Message'] =
            'Vui lòng cung cấp thông tin tên người đại diện!';
          return this.response;
        }
        if (!item.OWNER_PHONE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp thông tin SĐT!';
          return this.response;
        }
        if (!item.CREATE_BY) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!';
          return this.response;
        }
        //sinh ra PIN
        let pinCode: string = `${moment().format('YYMMDD')}`;
        await this.dtOrderRepo
          .find({
            fields: ['PIN_CODE'],
            where: {PIN_CODE: {like: pinCode + '%'}},
            order: ['PIN_CODE DESC'],
          })
          .then((item: any) => {
            if (item.length === 0) {
              return (pinCode = `${pinCode}001-${countPIN}`);
            } else {
              let temp = item[0].PIN_CODE?.slice(6, 9);
              let pincodeTemp = `000${Number(temp) + 1}`.substr(-3);
              pinCode = `${pinCode}${pincodeTemp}-${countPIN}`;
            }
          });
        //Sinh ORDER_NO here
        let order_no_created: string = `${item.METHOD_CODE}${item.CLASS_CODE}${moment().format('YYMMDD')}`;
        await this.dtOrderRepo.find({
          fields: ['ORDER_NO'],
          where: {ORDER_NO: {like: order_no_created + '%'}},
          order: ['ORDER_NO DESC'],
        })
          .then((orderNo: any) => {
            if (orderNo.length === 0) {
              return (order_no_created = `${order_no_created}001`);
            } else {
              let tempOrderNo = orderNo[0].ORDER_NO?.substr(-3);
              let threeLastOrderNo = `000${Number(tempOrderNo) + 1}`.substr(-3);
              order_no_created = `${order_no_created}${threeLastOrderNo}`;
            }
          });
        let obj: any = {
          VOYAGEKEY: item.VOYAGEKEY,
          CLASS_CODE: item.CLASS_CODE,
          ORDER_NO: order_no_created,
          PIN_CODE: pinCode,
          CUSTOMER_CODE: item.CUSTOMER_CODE,
          ACC_TYPE: item.ACC_TYPE,
          ACC_CD: item.ACC_CD,
          DELIVERY_ORDER: item.DELIVERY_ORDER ? item.DELIVERY_ORDER : null,
          BILLOFLADING: item.BILLOFLADING ? item.BILLOFLADING : null,
          BOOKING_NO: item.BOOKING_NO ? item.BOOKING_NO : null,
          CNTRNO: item.CNTRNO ? item.CNTRNO : null,
          CNTRSZTP: item.CNTRSZTP ? item.CNTRSZTP : null,
          ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
          ITEM_TYPE_CODE_CNTR: item.ITEM_TYPE_CODE,
          METHOD_CODE: item.METHOD_CODE ? item.METHOD_CODE : null,
          ISSUE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
          EXP_DATE: moment(item.EXP_DATE).format('YYYY-MM-DD HH:mm:ss'),
          HOUSE_BILL: item.HOUSE_BILL ? item.HOUSE_BILL : null,
          BOOKING_FWD: item.BOOKING_FWD ? item.BOOKING_FWD : null,
          CARGO_PIECE: item.CARGO_PIECE ? item.CARGO_PIECE : null,
          UNIT_CODE: item.UNIT_CODE ? item.UNIT_CODE : null,
          CARGO_WEIGHT: item.CARGO_WEIGHT ? item.CARGO_WEIGHT : null,
          CBM: item.CBM ? item.CBM : null,
          RT: item.RT ? item.RT : null,
          LOT_NO: item.LOT_NO ? item.LOT_NO : null,
          NOTE: item.NOTE ? item.NOTE : null,
          DRAFT_NO: item.DRAFT_NO ? item.DRAFT_NO : null,
          INV_NO: item.INV_NO ? item.INV_NO : null,
          GATE_CHK: item.GATE_CHK,
          QUANTITY_CHK: item.QUANTITY_CHK,
          PAYMENT_CHK: item.PAYMENT_CHK,
          OWNER: item.OWNER,
          OWNER_REPRESENT: item.OWNER_REPRESENT,
          OWNER_PHONE: item.OWNER_PHONE,
          COMMODITYDESCRIPTION: item.COMMODITYDESCRIPTION,
          CREATE_BY: item.CREATE_BY,
          CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        try {
          let wherePackage: any = {
            VOYAGEKEY: item.VOYAGEKEY,
            CLASS_CODE: item.CLASS_CODE,
            [item.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: item.CLASS_CODE === 1 ? item.HOUSE_BILL : item.BOOKING_FWD,
          };
          let checkPackageMnf: any = await this.DT_PACKAGE_MNF_LDRepo.find({
            fields: ['SHIPMARKS', 'DECLARE_NO'],
            where: wherePackage
          });
          return await this.dtOrderRepo.create(obj)
            .then((data: any) => {
              this.response['Status'] = true;
              this.response['Payload'].push(Object.assign({
                SHIPMARKS: checkPackageMnf[0]?.SHIPMARKS,
                DECLARE_NO: checkPackageMnf[0]?.DECLARE_NO,
              }, data));
              this.response['Message'] = 'Lưu dữ liệu thành công!';
              return this.response;
            });
        } catch (err: any) {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = 'Không thể lưu mới dữ liệu!';
          return this.response;
        }
      })).then(async (value: any) => {
        if (this.response['Status'] && orderReq[0].METHOD_CODE !== 'NKX') {
          //Thoilc(*Bổ sung)-INV_DFT
          let checkCode: any = await this.invDftRepo.find({
            order: ['DRAFT_INV_NO DESC']
          });
          // console.log("AAAA", checkCode, " - ", checkCode[0]?.DRAFT_INV_NO.substr(8))
          let AMOUNT: any = invVatReq.sum_amount;
          let VAT_RATE: any = invVatReq.vat_amount;
          let TAMOUNT: any = invVatReq.total_amount;
          let idx_DRAFT_INV_NO: any = parseInt(checkCode[0]?.DRAFT_INV_NO.substr(8));
          let CURRENCY_CODE: any = orderReq[0].INV_DRAFT?.datainvDraft.CURRENCY_CODE;
          let CUSTOMER_CODE: any = orderReq[0].INV_DRAFT?.datainvDraft.CUSTOMER_CODE;
          let ACC_TYPE: any = orderReq[0].INV_DRAFT?.datainvDraft.ACC_TYPE;
          let invDftData: any = {
            DRAFT_INV_NO: idx_DRAFT_INV_NO ? "DR" + "/" + moment(new Date()).format("YYYY") + "/" + (parseInt('0000000', 10) + idx_DRAFT_INV_NO + 1).toString().padStart('0000000'.length, '0') : "DR" + "/" + moment(new Date()).format("YYYY") + "/" + `000000${String(1)}`,
            DRAFT_INV_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
            REF_NO: this.response['Payload'][0].ORDER_NO,
            PAYER_TYPE: ACC_TYPE,
            PAYER: CUSTOMER_CODE,
            AMOUNT: AMOUNT,
            VAT: VAT_RATE,
            PAYMENT_STATUS: "U",
            CURRENCYID: CURRENCY_CODE,
            TPLT_NM: "CFS",
            TAMOUNT: TAMOUNT,
            CREATE_BY: orderReq[0].CREATE_BY,
            CREATE_TIME: moment().format('YYYY-MM-DD HH:mm:ss'),
          };
          drafReturn = await this.invDftRepo.create(invDftData);
          let dataDetail: any = orderReq[0].INV_DRAFT.DETAIL_DRAFT.map((itemDetail: any, idx: any) => {
            let objINV_DETAIL: any = {
              DRAFT_INV_NO: invDftData.DRAFT_INV_NO,
              SEQ: idx + 1,
              TRF_CODE: itemDetail.TRF_CODE,
              INV_UNIT: itemDetail.UNIT_CODE,
              IX_CD: itemDetail.CLASS_CODE,
              CARGO_TYPE: itemDetail.ITEM_TYPE_CODE,
              AMOUNT: (itemDetail.AMOUNT).toLocaleString().replace(/\D/g, ''),
              VAT: Number(itemDetail.VAT),
              VAT_RATE: parseFloat(itemDetail.VAT_RATE),
              TAMOUNT: (itemDetail.TAMOUNT).toLocaleString().replace(/\D/g, ''),
              SZ: itemDetail.CNTRSZTP,
              QTY: Number(itemDetail.QTY),
              UNIT_RATE: parseFloat(itemDetail.UNIT_RATE),
              TRF_DESC: itemDetail.TRF_DESC,
              JOB_TYPE: itemDetail.METHOD_CODE,
              VAT_CHK: itemDetail.VAT_CHK,
              CREATE_BY: this.response['Payload'][0].CREATE_BY,
              CREATE_TIME: moment().format('YYYY-MM-DD HH:mm:ss'),
            };
            return objINV_DETAIL;
          });
          this.invDftDtlRepo.createAll(dataDetail);
        }
        return this.response;
      });
    if (!this.response['Status']) {
      return this.response;
    }
    // Phát hành hóa đơn VNPT
    const config = await getConfig('VNPT', 'SP-ITC');

    let args = {
      datas: invVatReq.datas.length > 0 ? invVatReq.datas : [],
      cusCode: orderReq[0]?.CUSTOMER_CODE ? orderReq[0]?.CUSTOMER_CODE : '',
      cusTaxCode: orderReq[0]?.TAX_CODE ? orderReq[0]?.TAX_CODE : '',
      cusAddr: orderReq[0]?.ADDRESS ? orderReq[0]?.ADDRESS : '',
      cusName: orderReq[0]?.CUSTOMER_NAME ? orderReq[0]?.CUSTOMER_NAME : '',
      sum_amount: invVatReq.sum_amount ? parseFloat(invVatReq.sum_amount) || 0 : 0,
      vat_amount: invVatReq.vat_amount ? parseFloat(invVatReq.vat_amount) || 0 : 0,
      total_amount: invVatReq.total_amount ? parseFloat(invVatReq.total_amount) || 0 : 0,
      transaction: invVatReq.transaction ? invVatReq.transaction : '',
      inv_type: invVatReq.inv_type ? invVatReq.inv_type : 'VND',
      //exchange_rate k có thì không gửi, exchange_rate là tỉ giá
      exchange_rate: invVatReq.exchange_rate ? parseFloat(invVatReq.exchange_rate) || 0 : 0,
      currencyInDetails: invVatReq.CURRENCYID ? invVatReq.CURRENCYID : 'VND',
      config: config
    }

    args.datas.map((item: any) => {
      item['PinCode'] = orderReturn.Payload[0].ORDER_NO
    }
    )
    let invVatReturn: any = await this.importAndPublish(args)
      .then(result => result)
      .catch(errMsg => {
        this.response['Status'] = false;
        this.response['Payload'] = errMsg;
        this.response['Message'] = "Phát hành hóa đơn VNPT thất bại!";
        return this.response;
      })
    if (!this.response['Status']) {
      return this.response;
    }

    console.log('invVatReturn', invVatReturn)

    let obj: any = {};
    obj['INV_NO'] = invVatReturn.serial + `00000000${invVatReturn.invno}`.substr(-8);
    obj['INV_DATE'] = moment().format('YYYY-MM-DD HH:mm:ss');
    obj['VOYAGEKEY'] = orderReturn.Payload[0].VOYAGEKEY;
    obj['REF_NO'] = orderReturn.Payload[0].ORDER_NO; // fkey
    obj['PAYER_TYPE'] = orderReturn.Payload[0].ACC_TYPE;
    obj['PAYER'] = orderReturn.Payload[0].CUSTOMER_CODE;
    drafReturn?.AMOUNT ? obj['AMOUNT'] = drafReturn.AMOUNT : '';
    drafReturn?.VAT ? obj['VAT'] = drafReturn.VAT : '';
    drafReturn?.DIS_AMT ? obj['DIS_AMT'] = drafReturn.DIS_AMT : '';
    drafReturn?.REMARK ? obj['REMARK'] = orderReturn.Payload[0].REMARK : '';
    drafReturn?.PAYMENT_STATUS ? obj['PAYMENT_STATUS'] = drafReturn.PAYMENT_STATUS : '';
    drafReturn?.CURRENCYID ? obj['CURRENCYID'] = drafReturn.CURRENCYID : '';
    drafReturn?.RATE ? obj['RATE'] = drafReturn.RATE : '';
    drafReturn?.INV_TYPE ? obj['INV_TYPE'] = drafReturn.INV_TYPE : '';
    drafReturn?.TPLT_NM ? obj['TPLT_NM'] = drafReturn.TPLT_NM : '';
    // obj['LOCAL_INV']
    drafReturn?.TAMOUNT ? obj['TAMOUNT'] = drafReturn.TAMOUNT : '';
    obj['ACC_CD'] = orderReturn.Payload[0].ACC_CD;
    // obj['IS_POSTED']
    obj['INV_PREFIX'] = invVatReturn.serial;
    obj['INV_NO_PRE'] = invVatReturn.invno;
    // obj['CANCEL_DATE']
    // obj['CANCLE_REMARK']
    // obj['CANCLE_BY']
    // obj['ISDFT_TO_INV']
    obj['PIN_CODE'] = orderReturn.Payload[0].PIN_CODE.split('-')[0];
    obj['CREATE_BY'] = orderReturn.Payload[0].CREATE_BY;
    obj['CREATE_DATE'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return await this.INV_VATRepo.create(obj)
      .then(data => {
        this.invDftRepo.updateById(drafReturn.ID, {INV_NO: data.INV_NO})
        this.response['Status'] = true;
        this.response['Payload'] = {
          order_noInfo: orderReturn.Payload,
          inv_vatInfo: data
        };
        this.response['Message'] = 'Phát hành hóa đơn thành công!'
        return this.response;
      })
      .catch(err => {
        console.log(err)
        return err
      })
  }
}

