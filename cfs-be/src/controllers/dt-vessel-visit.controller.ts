import { JSONObject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { post, requestBody } from '@loopback/rest';
import moment from 'moment';
import { ccurl } from '../general';
import { DT_VESSEL_VISIT } from '../models/dt-vessel-visit.model';
import { API_TOSRepository } from '../repositories';
import { DtVesselVisitRepository } from '../repositories/dt-vessel-visit.repository';
const spec = {
  responses: {
    '200': {
      description: 'DT_VESSEL_VISIT list of filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    },
  },
};

export class DtVesselVisitController {
  constructor(
    @repository(DtVesselVisitRepository)
    public dtVesselVisitRepository: DtVesselVisitRepository,
    @repository(API_TOSRepository)
    public API_TOSRepo: API_TOSRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: '',
  };

  @post('/dt-vessel-visits/CFStoVTOS_getVessel', spec)
  async CFStoVTOS_getVessel(@requestBody() dataReq: JSONObject): Promise<any> {
    if (!(dataReq.fromDate && dataReq.toDate)) {
      this.response['Status'] = false;
      this.response['Message'] = `Vui lòng gửi từ ngày đến ngày!`;
      return this.response;
    }
    if (!dataReq.CREATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] =
        'Vui lòng cung cấp lại tên người truy vấn dữ liệu!';
      return this.response;
    }
    const CFStoVTOS_getVessel = async () => {
      let dataSend = JSON.stringify({
        fromDate: moment(String(dataReq.fromDate))
          .utcOffset(-8)
          .format('YYYY-MM-DD HH:mm:ss'),
        toDate: moment(String(dataReq.toDate))
          .utcOffset(12)
          .format('YYYY-MM-DD HH:mm:ss'),
      });

      return new Promise(async (resolve, reject) => {
        const options = {
          hostname: process.env.API_TOS_URL,
          port: 181,
          path: '/index.php/api_server/CFStoVTOS_getVessel',
          method: 'POST',
          body: dataSend,
        };
        try {
          let result: any = await ccurl(dataSend, options);
          let objResult = JSON.parse(result);
          resolve(objResult);
        } catch (err) {
          reject(err);
          return;
        }
      });
    };
    return CFStoVTOS_getVessel()
      .then((data: any) => {
        console.log('data', data)
        let objTOS: any = {
          TOS_ROWGUID: null,
          FUNCTION_PATCH: 'Vessel',
          FUNCTION_NAME: 'Insert',
          POST_DATA: '',
          GET_DATA: JSON.stringify(dataReq),
          MES_STATUS: this.response['Status'],
          CREATE_BY: dataReq.CREATE_BY,
          CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        if (data.Payload.length) {
          let tempData = data.Payload.map((e: any) => {
            return {
              VOYAGEKEY: e.ShipKey,
              VESSEL_NAME: e.ShipName,
              INBOUND_VOYAGE: e.ImVoy,
              OUTBOUND_VOYAGE: e.ExVoy,
              ETA: e.ETA,
              ETD: e.ETD,
              CallSign: e.CallSign,
              IMO: e.IMO,
              TOS_SHIPKEY: e.ShipKey,
            };
          });
          objTOS.POST_DATA = JSON.stringify({
            Status: true,
            Payload: tempData,
            Message: `Truy vấn dữ liệu thành công!`,
          });
          objTOS.MES_STATUS = true;
          this.response['Status'] = true;
          this.response['ResSever'] = data;
          this.response['ReqBE'] = JSON.stringify({
            fromDate: moment(String(dataReq.fromDate))
              .utcOffset(-8)
              .format('YYYY-MM-DD HH:mm:ss'),
            toDate: moment(String(dataReq.toDate))
              .utcOffset(12)
              .format('YYYY-MM-DD HH:mm:ss'),
          });
          this.response['test'] = `${process.env.API_TOS_URL}/index.php/api_server/CFStoVTOS_getVessel`;
          this.response['Payload'] = tempData;
          this.response['Message'] = 'Nạp dữ liệu thành công!';
          this.API_TOSRepo.create(objTOS);
          return this.response;
        } else {
          objTOS.POST_DATA = JSON.stringify({
            Status: false,
            Payload: [],
            Message: 'Không tìm thấy dữ liệu!',
          });
          objTOS.MES_STATUS = false;
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['ResSever'] = data;
          this.response['ReqBE'] = JSON.stringify({
            fromDate: moment(String(dataReq.fromDate))
              .utcOffset(-8)
              .format('YYYY-MM-DD HH:mm:ss'),
            toDate: moment(String(dataReq.toDate))
              .utcOffset(12)
              .format('YYYY-MM-DD HH:mm:ss'),
          });
          this.response['test'] = `${process.env.API_TOS_URL}/index.php/api_server/CFStoVTOS_getVessel`;
          this.response['Message'] = 'Không tìm thấy dữ liệu!';
          this.API_TOSRepo.create(objTOS);
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['ReqBE'] = JSON.stringify({
          fromDate: moment(String(dataReq.fromDate))
            .utcOffset(-8)
            .format('YYYY-MM-DD HH:mm:ss'),
          toDate: moment(String(dataReq.toDate))
            .utcOffset(12)
            .format('YYYY-MM-DD HH:mm:ss'),
        });
        this.response['test'] = `${process.env.API_TOS_URL}/index.php/api_server/CFStoVTOS_getVessel`;
        this.response['Message'] =
          'PHÁT SINH LỖI! VUI LÒNG LIÊN HỆ BỘ PHẬN KĨ THUẬT!';
        return this.response;
      });
  }
  //ThachHD(*Note) : Hiển thị dữ liệu quản lý tàu chuyến
  @post('/dt-vessel-visits/view', spec)
  async viewAll(): Promise<DT_VESSEL_VISIT[]> {
    return this.dtVesselVisitRepository.find({
      fields: [
        'ID',
        'VOYAGEKEY',
        'VESSEL_NAME',
        'INBOUND_VOYAGE',
        'OUTBOUND_VOYAGE',
        'ETA',
        'ETD',
        'TOS_SHIPKEY',
      ],
      order: ['ETA DESC']
    })
      .then((data) => {
        let temp = data.map((res: any) => {
          res.ETA = moment(res.ETA).utc().format('YYYY-MM-DD HH:mm:ss');
          res.ETD = moment(res.ETD).utc().format('YYYY-MM-DD HH:mm:ss');
          return res;
        })
        return temp;
      })
  }

  //ThachHD(*Note):Hiển thị dữ liệu quản lý tàu chuyến
  @post('/dt-vessel-visits/getItem', spec)
  //  @authenticate({strategy: 'jwt', options: {required: ['frmVoyageManage', 'IsView']}})
  async view(@requestBody() dtVessel: JSONObject): Promise<any> {
    try {
      let whereObj: any = {};
      let _from = dtVessel._from
        ? moment(String(dtVessel._from))
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        : '';
      let _to = dtVessel._to
        ? moment(String(dtVessel._to))
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        : '';
      _from && _to
        ? (whereObj['ETA'] = {
          between: [_from, _to],
        })
        : '';
      return await this.dtVesselVisitRepository
        .find({
          where: whereObj,
        })
        .then(data => {
          if (data.length) {
            let temp = data.map((res: any) => {
              res.ETA = moment(res.ETA).utc().format("YYYY-MM-DD HH:mm:ss");
              res.ETD = moment(res.ETD).utc().format("YYYY-MM-DD HH:mm:ss");
              return res;
            });
            this.response['Status'] = true;
            this.response['Payload'] = temp;
            this.response['Message'] = 'Nạp dữ liệu thành công!';
            return this.response;
          } else {
            this.response['Status'] = false;
            this.response['Payload'] = [];
            this.response['Message'] = 'Không có dữ liệu cần tìm!';
            return this.response;
          }
        });
    } catch {
      this.response['Status'] = true;
      this.response['Message'] = 'Không thể load dữ liệu!';
      return this.response;
    }
  }

  //ThachHD(*Note)-Xoá quản lý tàu chuyến
  @post('/dt-vessel-visits/delete', spec)
  //  @authenticate({strategy: 'jwt', options: {required: ['frmVoyageManage', 'IsDelete']}})
  async createVessels(
    @requestBody() dtVessel: DT_VESSEL_VISIT[],
  ): Promise<any> {
    return Promise.all(
      dtVessel.map(async item => {
        try {
          if (!item.ID) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại số ID';
            return this.response;
          }
          return await this.dtVesselVisitRepository
            .deleteById(item.ID)
            .then(() => {
              this.response['Status'] = true;
              this.response['Message'] = 'Xóa dữ liệu thành công!';
              return this.response;
            });
        } catch {
          this.response['Status'] = false;
          this.response['Message'] = 'Xóa dữ liệu không thành công!';
        }
      }),
    ).then(() => {
      return this.response;
    });
  }

  @post('/dt-vessel-visits/insertAndUpdate', spec)
  async insertAndUpdate(@requestBody() dtVessel: JSONObject[]): Promise<any> {
    let tempArrDuplicate: any = [];
    let tempArrDuplicateVesselName: any = [];
    return Promise.all(
      dtVessel.map(async (item: any, index: any) => {
        switch (item.status) {
          case 'insert':
            if (!item.VESSEL_NAME) {
              this.response['Status'] = false;
              this.response['Message'] = 'Vui lòng cung cấp lại tên tàu!';
              return this.response;
            }
            if (!item.INBOUND_VOYAGE) {
              this.response['Status'] = false;
              this.response['Message'] = 'Vui lòng cung cấp lại chuyến nhập!';
              return this.response;
            }
            if (!item.OUTBOUND_VOYAGE) {
              this.response['Status'] = false;
              this.response['Message'] = 'Vui lòng cung cấp lại chuyến xuất!';
              return this.response;
            }
            if (!item.ETA) {
              this.response['Status'] = false;
              this.response['Message'] = 'Vui lòng cung cấp lại ngày tàu đến!';
              return this.response;
            }
            if (!item.ETD) {
              this.response['Status'] = false;
              this.response['Message'] = 'Vui lòng cung cấp lại ngày tàu đi!';
              return this.response;
            }
            if (!item.CREATE_BY) {
              this.response['Status'] = false;
              this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo';
              return this.response;
            }
            let obj: any = {
              VOYAGEKEY: `${item.VESSEL_NAME.slice(0, 4)}${item.INBOUND_VOYAGE}${moment(item.ETA, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid() ?
                moment(item.ETA, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("YYYYMMDD") :
                moment(item.ETA, "DD/MM/YYYY HH:mm:ss").format("YYYYMMDD")}`,
              VESSEL_NAME: item.VESSEL_NAME,
              INBOUND_VOYAGE: item.INBOUND_VOYAGE,
              OUTBOUND_VOYAGE: item.OUTBOUND_VOYAGE,
              ETA: moment(item.ETA, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid() ?
                moment(item.ETA, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("YYYY-MM-DD HH:mm:ss") :
                moment(item.ETA, 'DD/MM/YYYY HH:mm:ss:').format("YYYY-MM-DD HH:mm:ss"),
              ETD: moment(item.ETD, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid() ?
                moment(item.ETD, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("YYYY-MM-DD HH:mm:ss") :
                moment(item.ETD, 'DD/MM/YYYY HH:mm:ss:').format("YYYY-MM-DD HH:mm:ss"),
              IMO: item.IMO ? item.IMO : 'NA',
              CallSign: item.CallSign ? item.CallSign : 'NA',
              TOS_SHIPKEY: item.TOS_SHIPKEY ? item.TOS_SHIPKEY : null,
              CREATE_BY: item.CREATE_BY,
              CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
            };
            // ------- check exist equipment type --------
            let whereObj: any = {
              VESSEL_NAME: obj.VESSEL_NAME,
              INBOUND_VOYAGE: obj.INBOUND_VOYAGE,
              OUTBOUND_VOYAGE: obj.OUTBOUND_VOYAGE,
              CallSign: obj.CallSign,
              IMO: obj.IMO,
            };
            item.TOS_SHIPKEY
              ? (whereObj['TOS_SHIPKEY'] = item.TOS_SHIPKEY)
              : '';
            let checkCode = await this.dtVesselVisitRepository.find({
              where: whereObj,
            });
            if (!checkCode.length) {
              await this.dtVesselVisitRepository
                .create(obj)
                .then((data: any) => {
                  this.response['Status'] = true;
                  this.response['Payload'].push(data);
                  this.response['Message'] = 'Lưu dữ liệu thành công!';
                })
                .catch(err => {
                  this.response['Status'] = false;
                  this.response['Payload'] = err;
                  this.response['Message'] =
                    'Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!';
                });
            } else {
              await tempArrDuplicate.push(checkCode[0]);
              tempArrDuplicateVesselName = tempArrDuplicate.map(
                (e: any) => e.VESSEL_NAME,
              );
            }
            return this.response;
          case 'update':
            if (!item.ID) {
              this.response['Status'] = false;
              this.response['Message'] = 'Vui lòng cung cấp lại số ID!';
              return this.response;
            }
            if (!item.UPDATE_BY) {
              this.response['Status'] = false;
              this.response['Message'] =
                'Vui lòng cung cấp lại tên người cập nhật!';
              return this.response;
            }
            item.UPDATE_DATE = moment().format('YYYY-MM-DD HH:mm:ss');
            item.ETA = moment(item.ETA, 'DD/MM/YYYY HH:mm:ss:');
            item.ETD = moment(item.ETD, 'DD/MM/YYYY HH:mm:ss:');
            try {
              return await this.dtVesselVisitRepository
                .updateById(item.ID, item)
                .then(() => {
                  this.response['Status'] = true;
                  this.response['Payload'].push(item);
                  this.response['Message'] = 'Lưu dữ liệu thành công!';
                  return this.response;
                });
            } catch {
              this.response['Status'] = false;
              this.response['Message'] = 'Không thể lưu mới dữ liệu!';
              return this.response;
            }
          default:
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại trạng thái!';
            return this.response;
        }
      }),
    ).then(returnValue => {
      if (tempArrDuplicate.length) {
        this.response['Status'] = false;
        this.response['Payload'] = tempArrDuplicate;
        this.response[
          'Message'
        ] = `Số tàu chuyến : ${tempArrDuplicateVesselName} đã tạo!`;
        return this.response;
      } else {
        return this.response;
      }
    });
  }
}
