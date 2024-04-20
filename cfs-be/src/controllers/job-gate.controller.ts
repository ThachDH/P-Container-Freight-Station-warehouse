import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {JOB_GATE} from '../models';
import {
  BS_CUSTOMERRepository,
  DT_ORDERRepository,
  DtPackageStockRepository,
  DtPalletStockRepository,
  DtVesselVisitRepository,
  JOB_GATERepository,
  JOB_STOCKRepository,
  
} from '../repositories';
import { ReceiptsRepository } from '../repositories/receipts.repository';
import {BS_ROMOOCRepository} from '../repositories/bs-romooc.repository';
import {BS_TRUCKRepository} from '../repositories/bs-truck.repository';
import {JOB_QUANTITY_CHECKRepository} from '../repositories/job-quantity-check.repository';
const spec = {
  responses: {
    '200': {
      description: 'JOB_GATE detail list of filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    },
  },
};

export class JOB_GATEController {
  constructor(
    @repository(JOB_QUANTITY_CHECKRepository)
    public jobQuantRepo: JOB_QUANTITY_CHECKRepository,
    @repository(JOB_GATERepository)
    public jobGateRepo: JOB_GATERepository,
    @repository(DT_ORDERRepository)
    public dtOderRepo: DT_ORDERRepository,
    @repository(DtPackageStockRepository)
    public DtPackageStockRepo: DtPackageStockRepository,
    @repository(JOB_STOCKRepository)
    public JOB_STOCKRepo: JOB_STOCKRepository,
    @repository(DtPalletStockRepository)
    public DtPalletStockRepo: DtPalletStockRepository,
    @repository(BS_TRUCKRepository)
    public BS_TRUCKRepo: BS_TRUCKRepository,
    @repository(BS_ROMOOCRepository)
    public BS_ROMOOCRepo: BS_ROMOOCRepository,
    @repository(DtVesselVisitRepository)
    public dtVesselRepo: DtVesselVisitRepository,
    @repository(BS_CUSTOMERRepository)
    public BS_CUSTOMERRepo: BS_CUSTOMERRepository,
    @repository(ReceiptsRepository)
    public RECEIPTSRepo: ReceiptsRepository,
  ) {}
  public response: any = {
    Status: false,
    Payload: [],
    Message: '',
  };

  //Thoilc(*Note)-Thêm mới lúc xe vào cổng - lệnh nhập kho nhập
  @post('/job-gate/insert', spec)
  async insert(@requestBody() jobGate: JSONObject): Promise<any> {
    let flag = false;
    await this.dtOderRepo
      .find({
        where: {
          ORDER_NO: String(jobGate.ORDER_NO),
        },
      })
      .then((data: any) => {
        if (!data.length) {
          flag = true;
          this.response['Status'] = false;
          this.response['Message'] = 'Số lệnh không tồn tại!';
          return this.response;
        } else {
          if (
            data.filter(
              (p: any) => p.PIN_CODE?.split('-')[0] === jobGate.PIN_CODE,
            ).length === 0
          ) {
            flag = true;
            this.response['Status'] = false;
            this.response['Message'] = 'Số PIN không tồn tại!';
            return this.response;
          }
        }
        return data;
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Lỗi không thể tạo lệnh!';
        return this.response;
      });

    if (flag) {
      return this.response;
    }

    if (!(jobGate.CLASS_CODE === 1 || jobGate.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại hướng!';
      return this.response;
    }
    if (!jobGate.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại key tàu!';
      return this.response;
    }
    if (!jobGate.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số lệnh!';
      return this.response;
    }
    if (!jobGate.PIN_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số PIN!';
      return this.response;
    }
    if (!jobGate.GATE_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã cổng!';
      return this.response;
    }
    if (
      !(
        String(jobGate.IS_IN_OUT).toUpperCase() === 'I' ||
        String(jobGate.IS_IN_OUT).toUpperCase() === 'O'
      )
    ) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại cổng!';
      return this.response;
    }
    if (!jobGate.TRUCK_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số xe!';
      return this.response;
    }
    if (!jobGate.METHOD_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã phương án!';
      return this.response;
    }

    // if (!jobGate.REMOOC_NO) {
    //   this.response['Status'] = false;
    //   this.response['Message'] = "Vui lòng cung cấp lại số Remooc!";
    //   return this.response;
    // }
    // if (!jobGate.BILLOFLADING) {
    //   this.response['Status'] = false;
    //   this.response['Message'] = "Vui lòng cung cấp lại master bill!";
    //   return this.response;
    // }
    if (!jobGate.CREATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại người tạo!';
      return this.response;
    }
    // ------- check exist PIN code --------
    let checkCode = await this.jobGateRepo.find({
      where: {
        PIN_CODE: String(jobGate.PIN_CODE),
      },
    });
    if (checkCode.length > 0) {
      this.response['Status'] = false;
      this.response['Message'] = 'Mã PIN đã tồn tại!';
      return this.response;
    }

    await this.jobGateRepo
      .find({
        where: {
          TRUCK_NO: String(jobGate.TRUCK_NO),
        },
      })
      .then((data: any) => {
        if (data.length > 0) {
          data.map((item: any) => {
            if (item.IS_SUCCESS_OUT === false) {
              flag = true;
              this.response['Status'] = false;
              this.response['Payload'] = [];
              this.response[
                'Message'
              ] = `Số xe ${jobGate.TRUCK_NO} chưa ra cổng!`;
            }
          });
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response[
          'Message'
        ] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`;
        return this.response;
      });
    if (flag) {
      return this.response;
    }

    let obj: any;
    obj = {
      VOYAGEKEY: jobGate.VOYAGEKEY,
      [jobGate.CLASS_CODE === 1 ? 'BILLOFLADING' : 'BOOKING_FWD']:
        jobGate.CLASS_CODE === 1 ? jobGate.BILLOFLADING : jobGate.BOOKING_FWD,
      CLASS_CODE: jobGate.CLASS_CODE,
      ORDER_NO: jobGate.ORDER_NO,
      PIN_CODE: jobGate.PIN_CODE,
      GATE_CODE: 'IN',
      IS_IN_OUT: 'I',
      DRIVER: jobGate.DRIVER,
      TEL: jobGate.TEL,
      VGM: jobGate.VGM ? 1 : 0,
      METHOD_CODE: jobGate.METHOD_CODE,
      TRUCK_NO: jobGate.TRUCK_NO,
      WEIGHT_REGIS: jobGate.WEIGHT_REGIS,
      WEIGHT_REGIS_ALLOW: jobGate.WEIGHT_REGIS_ALLOW,
      REMOOC_NO: jobGate.REMOOC_NO,
      REMOOC_WEIGHT: jobGate.REMOOC_WEIGHT,
      REMOOC_WEIGHT_REGIS: jobGate.REMOOC_WEIGHT_REGIS,
      CNTRNO: jobGate.CNTRNO,
      CNTRSZTP: jobGate.CNTRSZTP,
      // HOUSE_BILL: jobGate.HOUSE_BILL,
      // BOOKING_NO: jobGate.BOOKING_NO,
      NOTE: jobGate.NOTE,
      CUSTOMER_CODE: jobGate.CUSTOMER_CODE,
      TIME_IN: moment().format('YYYY-MM-DD HH:mm:ss'),
      TIME_OUT: jobGate.TIME_OUT,
      IS_SUCCESS_IN: true,
      CREATE_BY: jobGate.CREATE_BY,
      CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
      QUANTITY_CHK : 0
    };

    let objTruck: any = {
      TRUCK_NO: obj.TRUCK_NO,
      WEIGHT_REGIS: obj.WEIGHT_REGIS,
      WEIGHT_REGIS_ALLOW: obj.WEIGHT_REGIS_ALLOW,
      TRUCK_DATE_EXP: moment(String(jobGate.TIME_REGIS), 'DD/MM/YYYY').format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      CREATE_BY: obj.CREATE_BY,
      CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    let objRomooc: any = {
      REMOOC_NO: obj.REMOOC_NO ? obj.REMOOC_NO : '',
      REMOOC_WEIGHT: obj.REMOOC_WEIGHT,
      REMOOC_WEIGHT_REGIS: obj.REMOOC_WEIGHT_REGIS,
      REMOOC_DATE_EXP: moment(String(jobGate.TIME_REMOOC), 'DD/MM/YYYY').format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      CREATE_BY: obj.CREATE_BY,
      CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    //Thoilc(*Note)-Kiểm tra dữ liệu số xe và số remooc
    let checkBSTRUCK: any = await this.BS_TRUCKRepo.find({
      where: {TRUCK_NO: objTruck.TRUCK_NO},
    });

    let checkBSROMOOC: any = await this.BS_ROMOOCRepo.find({
      where: {REMOOC_NO: objRomooc.REMOOC_NO},
    });
    //-----------------------------------------------

    //Thoilc(*Note)-Nếu không tìm thấy số xe và remooc thì thêm mới/cập nhật
    if (!checkBSTRUCK.length) {
      await this.BS_TRUCKRepo.create(objTruck);
    } else {
      const IDTruck: any = checkBSTRUCK.map(
        (itemBSTruck: any) => itemBSTruck.ID,
      );
      await this.BS_TRUCKRepo.updateById(IDTruck, {
        WEIGHT_REGIS: objTruck.WEIGHT_REGIS,
        WEIGHT_REGIS_ALLOW: objTruck.WEIGHT_REGIS_ALLOW,
        TRUCK_DATE_EXP: objTruck.TRUCK_DATE_EXP,
        UPDATE_BY: obj.CREATE_BY,
        UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    if (!checkBSROMOOC.length) {
      await this.BS_ROMOOCRepo.create(objRomooc);
    } else {
      const IDRemooc: any = checkBSROMOOC.map(
        (itemBSRemooc: any) => itemBSRemooc.ID,
      );
      await this.BS_ROMOOCRepo.updateById(IDRemooc, {
        REMOOC_WEIGHT: obj.REMOOC_WEIGHT,
        REMOOC_WEIGHT_REGIS: obj.REMOOC_WEIGHT_REGIS,
        REMOOC_DATE_EXP: objRomooc.REMOOC_DATE_EXP,
        UPDATE_BY: obj.CREATE_BY,
        UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    //--------------------------------------------------
    await this.jobGateRepo
      .create(obj)
      .then(async (data: any) => {
        await this.dtOderRepo.updateAll(
          {
            GATE_CHK: true,
            UPDATE_BY: obj.CREATE_BY,
            UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
          {ORDER_NO: obj.ORDER_NO},
        );
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = 'Lưu dữ liệu thành công!';
        return this.response;
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Lỗi không thể tạo lệnh!';
        return this.response;
      });
    return this.response;
  }

  //Thoilc(*Note)-Thêm mới lúc xe vào cổng - lệnh xuất nhập kho
  @post('/job-gate/insertEx', spec)
  async insertEx(@requestBody() jobGate: JSONObject): Promise<any> {
    let flag = false;
    let dataJobStock: any = [];
    await this.dtOderRepo
      .find({
        where: {
          ORDER_NO: String(jobGate.ORDER_NO),
        },
      })
      .then((data: any) => {
        if (!data.length) {
          flag = true;
          this.response['Status'] = false;
          this.response['Message'] = 'Số lệnh không tồn tại!';
          return this.response;
        } else {
          if (
            data.filter(
              (p: any) => p.PIN_CODE?.split('-')[0] === jobGate.PIN_CODE,
            ).length === 0
          ) {
            flag = true;
            this.response['Status'] = false;
            this.response['Message'] = 'Số PIN không tồn tại!';
            return this.response;
          }
        }
        return data;
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Lỗi không thể thêm lệnh!';
        return this.response;
      });

    if (flag) {
      return this.response;
    }

    if (!(jobGate.CLASS_CODE === 1 || jobGate.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại hướng!';
      return this.response;
    }
    if (!jobGate.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại key tàu!';
      return this.response;
    }
    if (!jobGate.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số lệnh!';
      return this.response;
    }
    if (!jobGate.PIN_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số PIN!';
      return this.response;
    }
    if (!jobGate.GATE_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã cổng!';
      return this.response;
    }
    if (
      !(
        String(jobGate.IS_IN_OUT).toUpperCase() === 'I' ||
        String(jobGate.IS_IN_OUT).toUpperCase() === 'O'
      )
    ) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại cổng!';
      return this.response;
    }
    if (!jobGate.TRUCK_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số xe!';
      return this.response;
    }
    if (!jobGate.METHOD_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã phương án!';
      return this.response;
    }
    if (!jobGate.CUSTOMER_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã khách hàng!';
      return this.response;
    }
    // if (!jobGate.REMOOC_NO) {
    //   this.response['Status'] = false;
    //   this.response['Message'] = "Vui lòng cung cấp lại số Remooc!";
    //   return this.response;
    // }
    if (jobGate.CLASS_CODE === 1) {
      if (!jobGate.HOUSE_BILL) {
        this.response['Status'] = false;
        this.response['Message'] = 'Vui lòng cung cấp lại house bill!';
        return this.response;
      }
    } else {
      if (!jobGate.BOOKING_NO) {
        this.response['Status'] = false;
        this.response['Message'] = 'Vui lòng cung cấp lại booking no!';
        return this.response;
      }
    }

    if (!jobGate.CREATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại người tạo!';
      return this.response;
    }
    // ------- check exist PIN code --------
    let checkCode = await this.jobGateRepo.find({
      where: {
        PIN_CODE: String(jobGate.PIN_CODE),
      },
    });
    if (checkCode.length) {
      this.response['Status'] = false;
      this.response['Message'] = 'Mã PIN đã tồn tại!';
      return this.response;
    }
    await this.jobGateRepo
      .find({
        where: {
          TRUCK_NO: String(jobGate.TRUCK_NO),
        },
      })
      .then((data: any) => {
        if (data.length > 0) {
          data.map((item: any) => {
            if (item.IS_SUCCESS_OUT === false) {
              flag = true;
              this.response['Status'] = false;
              this.response['Payload'] = [];
              this.response[
                'Message'
              ] = `Số xe ${jobGate.TRUCK_NO} chưa ra cổng!`;
            }
          });
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response[
          'Message'
        ] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`;
        return this.response;
      });
    if (flag) {
      return this.response;
    }
    let obj: any;
    if (jobGate.CLASS_CODE === 1) {
      obj = {
        VOYAGEKEY: jobGate.VOYAGEKEY,
        BILLOFLADING: jobGate.BILLOFLADING,
        CLASS_CODE: jobGate.CLASS_CODE,
        ORDER_NO: jobGate.ORDER_NO,
        PIN_CODE: jobGate.PIN_CODE,
        GATE_CODE:
          jobGate.METHOD_CODE === 'NKN' || jobGate.METHOD_CODE === 'NKX'
            ? 'IN'
            : 'OUT',
        IS_IN_OUT:
          jobGate.METHOD_CODE === 'NKN' || jobGate.METHOD_CODE === 'NKX'
            ? 'I'
            : 'O',
        DRIVER: jobGate.DRIVER,
        TEL: jobGate.TEL,
        VGM: jobGate.VGM ? 1 : 0,
        METHOD_CODE: jobGate.METHOD_CODE,
        TRUCK_NO: jobGate.TRUCK_NO,
        WEIGHT_REGIS: jobGate.WEIGHT_REGIS,
        WEIGHT_REGIS_ALLOW: jobGate.WEIGHT_REGIS_ALLOW,
        REMOOC_NO: jobGate.REMOOC_NO,
        REMOOC_WEIGHT: jobGate.REMOOC_WEIGHT,
        REMOOC_WEIGHT_REGIS: jobGate.REMOOC_WEIGHT_REGIS,
        CNTRNO: jobGate.CNTRNO,
        CNTRSZTP: jobGate.CNTRSZTP,
        HOUSE_BILL: jobGate.HOUSE_BILL,
        NOTE: jobGate.NOTE,
        CUSTOMER_CODE: jobGate.CUSTOMER_CODE,
        TIME_IN: moment().format('YYYY-MM-DD HH:mm:ss'),
        TIME_OUT: jobGate.TIME_OUT,
        IS_SUCCESS_IN: true,
        CREATE_BY: jobGate.CREATE_BY,
        CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
    } else {
      obj = {
        VOYAGEKEY: jobGate.VOYAGEKEY,
        BOOKING_FWD: jobGate.BOOKING_FWD,
        CLASS_CODE: jobGate.CLASS_CODE,
        ORDER_NO: jobGate.ORDER_NO,
        PIN_CODE: jobGate.PIN_CODE,
        GATE_CODE:
          jobGate.METHOD_CODE === 'NKN' || jobGate.METHOD_CODE === 'NKX'
            ? 'IN'
            : 'OUT',
        IS_IN_OUT:
          jobGate.METHOD_CODE === 'NKN' || jobGate.METHOD_CODE === 'NKX'
            ? 'I'
            : 'O',
        DRIVER: jobGate.DRIVER,
        TEL: jobGate.TEL,
        VGM: jobGate.VGM ? 1 : 0,
        METHOD_CODE: jobGate.METHOD_CODE,
        TRUCK_NO: jobGate.TRUCK_NO,
        WEIGHT_REGIS: jobGate.WEIGHT_REGIS,
        WEIGHT_REGIS_ALLOW: jobGate.WEIGHT_REGIS_ALLOW,
        REMOOC_NO: jobGate.REMOOC_NO,
        REMOOC_WEIGHT: jobGate.REMOOC_WEIGHT,
        REMOOC_WEIGHT_REGIS: jobGate.REMOOC_WEIGHT_REGIS,
        CNTRNO: jobGate.CNTRNO,
        CNTRSZTP: jobGate.CNTRSZTP,
        BOOKING_NO: jobGate.BOOKING_NO,
        NOTE: jobGate.NOTE,
        CUSTOMER_CODE: jobGate.CUSTOMER_CODE,
        TIME_IN: moment().format('YYYY-MM-DD HH:mm:ss'),
        TIME_OUT: jobGate.TIME_OUT,
        IS_SUCCESS_IN: true,
        CREATE_BY: jobGate.CREATE_BY,
        CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
    }
    let objTruck: any = {
      TRUCK_NO: obj.TRUCK_NO,
      WEIGHT_REGIS: obj.WEIGHT_REGIS,
      WEIGHT_REGIS_ALLOW: obj.WEIGHT_REGIS_ALLOW,
      TRUCK_DATE_EXP: moment(String(jobGate.TIME_REGIS), 'DD/MM/YYYY').format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      CREATE_BY: obj.CREATE_BY,
      CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    let objRomooc: any = {
      REMOOC_NO: obj.REMOOC_NO ? obj.REMOOC_NO : '',
      REMOOC_WEIGHT: obj.REMOOC_WEIGHT,
      REMOOC_WEIGHT_REGIS: obj.REMOOC_WEIGHT_REGIS,
      REMOOC_DATE_EXP: moment(String(jobGate.TIME_REMOOC), 'DD/MM/YYYY').format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      CREATE_BY: obj.CREATE_BY,
      CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    //Thoilc(*Note)-Kiểm tra dữ liệu số xe và số remooc
    const checkBSTRUCK: any = await this.BS_TRUCKRepo.find({
      where: {TRUCK_NO: objTruck.TRUCK_NO},
    });

    const checkBSROMOOC: any = await this.BS_ROMOOCRepo.find({
      where: {REMOOC_NO: objRomooc.REMOOC_NO},
    });
    //-----------------------------------------------

    //Thoilc(*Note)-Nếu không tìm thấy số xe và remooc thì thêm mới/cập nhật
    if (!checkBSTRUCK.length) {
      await this.BS_TRUCKRepo.create(objTruck);
    } else {
      const IDTruck: any = checkBSTRUCK.map(
        (itemBSTruck: any) => itemBSTruck.ID,
      );
      await this.BS_TRUCKRepo.updateById(IDTruck, {
        WEIGHT_REGIS: objTruck.WEIGHT_REGIS,
        WEIGHT_REGIS_ALLOW: objTruck.WEIGHT_REGIS_ALLOW,
        TRUCK_DATE_EXP: objTruck.TRUCK_DATE_EXP,
        UPDATE_BY: obj.CREATE_BY,
        UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    if (!checkBSROMOOC.length) {
      await this.BS_ROMOOCRepo.create(objRomooc);
    } else {
      const IDRemooc: any = checkBSROMOOC.map(
        (itemBSRemooc: any) => itemBSRemooc.ID,
      )[0];
      await this.BS_ROMOOCRepo.updateById(IDRemooc, {
        REMOOC_WEIGHT: obj.REMOOC_WEIGHT,
        REMOOC_WEIGHT_REGIS: obj.REMOOC_WEIGHT_REGIS,
        REMOOC_DATE_EXP: objRomooc.REMOOC_DATE_EXP,
        UPDATE_BY: obj.CREATE_BY,
        UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    //--------------------------------------------------
    let whereObj: any = {
      VOYAGEKEY: obj.VOYAGEKEY,
      CLASS_CODE: obj.CLASS_CODE,
      ORDER_NO: obj.ORDER_NO,
    };

    let tempDtOrder: any = await this.dtOderRepo
      .find({
        where: whereObj,
      })
      .then((data: any) => {
        return data;
      });
    let dataReturn: any;
    await Promise.all(
      tempDtOrder.map(async (itemAll: any) => {
        let whereFind: any = {
          VOYAGEKEY: obj.VOYAGEKEY,
          CLASS_CODE: obj.CLASS_CODE,
        };
        obj.HOUSE_BILL ? (whereFind['HOUSE_BILL'] = itemAll.HOUSE_BILL) : '';
        obj.BOOKING_FWD ? (whereFind['BOOKING_FWD'] = itemAll.BOOKING_FWD) : '';
        const checkCodePackage: any = await this.DtPackageStockRepo.find({
          where: whereFind,
        });

        if (!checkCodePackage.length) {
          this.response['Status'] = false;
          this.response['Message'] = 'Không tìm thấy kiện hàng!';
          return this.response;
        }
        await Promise.all(
          checkCodePackage.map(async (item: any) => {
            //Thoilc(*Note)-Tìm pallet
            this.DtPalletStockRepo.find({
              where: {IDREF_STOCK: item.ID},
            }).then((dataPallet: any) => {
              if (dataPallet.length) {
                flag = true;
                let arrJobStock: any = dataPallet.map(
                  (itemPallet: any, idx: any) => {
                    return {
                      VOYAGEKEY: item.VOYAGEKEY,
                      WAREHOUSE_CODE: item.WAREHOUSE_CODE,
                      CLASS_CODE: item.CLASS_CODE,
                      JOB_TYPE: 'XK',
                      BOOKING_FWD: item.BOOKING_FWD,
                      HOUSE_BILL: item.HOUSE_BILL,
                      ORDER_NO: item.ORDER_NO,
                      PIN_CODE: item.PIN_CODE,
                      PALLET_NO: itemPallet.PALLET_NO,
                      SEQ: idx + 1,
                      ACTUAL_CARGO_PIECE: itemPallet.CARGO_PIECE,
                      ACTUAL_UNIT: itemPallet.UNIT_CODE,
                      ACTUAL_CARGO_WEIGHT: item.CARGO_WEIGHT,
                      BLOCK: itemPallet.BLOCK,
                      SLOT: itemPallet.SLOT,
                      TIER: itemPallet.TIER,
                      JOB_STATUS: 'A',
                      CREATE_BY: obj.CREATE_BY,
                      CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
                    };
                  },
                );
                this.JOB_STOCKRepo.createAll(arrJobStock).then(data => {
                  dataReturn = data;
                });
              } else {
                this.response['Status'] = false;
                this.response['Message'] = 'Không tìm thấy pallet!';
                return this.response;
              }
              return dataReturn;
            });
            //Thoilc(*Note)-Cập nhật ORDER_NO lại
            await this.DtPackageStockRepo.updateAll(
              {
                ORDER_NO: obj.ORDER_NO,
                METHOD_OUT: obj.CLASS_CODE === 1 ? 'XKN' : 'XKX',
                UPDATE_BY: obj.CREATE_BY,
                UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
              },
              whereFind,
            );
            await this.dtOderRepo.updateAll(
              {
                GATE_CHK: true,
                UPDATE_BY: obj.CREATE_BY,
                UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
              },
              whereObj,
            );
          }),
        );
      }),
    );
    let dataJobGate: any = await this.jobGateRepo.create(obj);
    this.response['Status'] = true;
    this.response['Payload'] = {
      jobStockInfo: dataReturn,
      jobGateInfo: dataJobGate,
    };
    this.response['Message'] = 'Lưu dữ liệu thành công!';
    return this.response;
  }

  @post('/job-gate/getTruckList', spec)
  async getTruckList(): Promise<any> {
    const whereTruck: Object = {
      TIME_OUT: null,
    };
    return await this.jobGateRepo
      .find({
        fields: [
          'IS_IN_OUT',
          'PIN_CODE',
          'TRUCK_NO',
          'TIME_IN',
          'METHOD_CODE',
          'QUANTITY_CHK',
          'ORDER_NO',
          'VOYAGEKEY',
          'HOUSE_BILL',
          'CLASS_CODE',
        ],
        where: whereTruck,
      })
      .then((value: any) => {
        this.response['Status'] = true;
        this.response['Payload'] = value;
        this.response['Message'] = 'Tải dữ liệu thành công!';
        return this.response;
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Không thể load dữ liệu!';
        return this.response;
      });
  }

  @post('/job-gate/getTruckViaWarehouse', spec)
  async getTruck(@requestBody() truckList: JOB_GATE): Promise<any> {
    if (!(truckList.CLASS_CODE === 1 || truckList.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại hướng!';
      return this.response;
    }
    if (!truckList.METHOD_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp phương án!';
      return this.response;
    }
    return await this.jobGateRepo
      .find({
        where: {
          CLASS_CODE: truckList.CLASS_CODE,
          METHOD_CODE: truckList.METHOD_CODE,
          QUANTITY_CHK: 0,
        },
      })
      .then((data: any) => {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = 'Tải dữ liệu thành công!';
        return this.response;
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Lỗi không thể load dữ liệu!';
        return this.response;
      });
  }

  //Thoilc(*Note)-Xác nhận layout 1 xe qua cổng ở màn hình kiểm đếm
  @post('/job-gate/confirmOrder', spec)
  async confQunality(@requestBody() dataReq: JSONObject): Promise<any> {
    if (!dataReq.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã lệnh!';
      return this.response;
    }

    if (!dataReq.TRUCK_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số xe!';
      return this.response;
    }
    if (!(dataReq.CLASS_CODE === 1 || dataReq.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại hướng!';
      return this.response;
    }
    if (!dataReq.CREATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!';
      return this.response;
    }
    const obj: any = {
      ORDER_NO: dataReq.ORDER_NO,
      TRUCK_NO: dataReq.TRUCK_NO,
    };
    dataReq.CNTRNO ? (obj['CNTRNO'] = dataReq.CNTRNO) : '';
    const dataCode: any = String(dataReq.ORDER_NO).substr(0, 3);
    if (String(dataCode) === 'XKX') {
      if (!dataReq.VOYAGEKEY) {
        this.response['Status'] = false;
        this.response['Message'] = 'Vui lòng cung cấp tàu chuyến!';
        return this.response;
      }

      if (!(dataReq.CLASS_CODE === 1 || dataReq.CLASS_CODE === 2)) {
        this.response['Status'] = false;
        this.response['Message'] = 'Vui lòng cung cấp lại hướng!';
        return this.response;
      }

      if (!dataReq.CNTRNO) {
        this.response['Status'] = false;
        this.response['Message'] = 'Vui lòng cung cấp số cont!';
        return this.response;
      }
      const whereObj: any = {
        VOYAGEKEY: dataReq.VOYAGEKEY,
        CLASS_CODE: dataReq.CLASS_CODE,
        ORDER_NO: dataReq.ORDER_NO,
      };
      dataReq.HOUSE_BILL ? (whereObj['HOUSE_BILL'] = dataReq.HOUSE_BILL) : '';
      // ------- check exist equipment type --------
      let checkCode: any = await this.dtOderRepo.find({
        where: whereObj,
      });

      if (checkCode.length) {
        let dataDTPackage: any = {
          CNTRNO: checkCode[0].CNTRNO,
          UPDATE_BY: dataReq.CREATE_BY,
          UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        await this.DtPackageStockRepo.updateAll(dataDTPackage, whereObj);
      } else {
        this.response['Status'] = false;
        this.response['Message'] = 'Không có dữ liệu!';
        return this.response;
      }
    }
    // Sinh ra Receipts NKN,XKX,XKN,NKX
    let dataORDER_NO: any = await this.dtOderRepo
      .find({
        where: {
          ORDER_NO: String(dataReq.ORDER_NO),
        },
      })
      .then(data => {
        if (data.length) {
          return data;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response[
            'Message'
          ] = `Không tìm thấy dữ liệu của lệnh ${dataReq.DT_ORDER}!`;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response[
          'Message'
        ] = `Phát sinh lỗi ! Vui lòng liên hệ bộ phận kĩ thuật!`;
      });

    if (dataORDER_NO.length === 0) {
      return this.response;
    }

    let vesselFound: any = await this.dtVesselRepo
      .find({
        where: {
          VOYAGEKEY: String(dataORDER_NO[0].VOYAGEKEY),
        },
      })
      .then(data => {
        if (data.length) {
          return {
            name: data[0].VESSEL_NAME,
            inbound: data[0].INBOUND_VOYAGE,
            outbound: data[0].OUTBOUND_VOYAGE,
          };
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response[
          'Message'
        ] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`;
        return this.response;
      });

    let customerInfo: any = await this.BS_CUSTOMERRepo.find({
      where: {
        CUSTOMER_CODE: String(dataORDER_NO[0].CUSTOMER_CODE),
      },
    })
      .then((data: any) => {
        if (data.length) {
          return data[0];
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response[
          'Message'
        ] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`;
        return this.response;
      });
    let receiptHeader: any = {
      TRUCK_NO: dataReq.TRUCK_NO,
      VOYAGEKEY: dataORDER_NO[0].VOYAGEKEY,
      WAREHOUSE_CODE: dataReq.WAREHOUSE_CODE,
      ORDER_NO: dataReq.ORDER_NO,
      CLASS_CODE: dataReq.CLASS_CODE,
      JOB_TYPE: ['XKX', 'XKN'].includes(String(dataCode)) ? 'XK' : 'NK',
      RECEIPT_NO: `${String(dataCode)}${moment().format('YYMMDDHHmmss')}`,
      RECEIPT_DATE: moment().format('YYYY-MM-DD hh:mm:ss'),
      BILLOFLADING: dataORDER_NO[0].BILLOFLADING
        ? dataORDER_NO[0].BILLOFLADING
        : null,
      BOOKING_NO: dataORDER_NO[0].BOOKING_NO
        ? dataORDER_NO[0].BOOKING_NO
        : null,
      CNTRNO: dataORDER_NO[0].CNTRNO ? dataORDER_NO[0].CNTRNO : null,
      CNTRSZTP: dataORDER_NO[0].CNTRSZTP ? dataORDER_NO[0].CNTRSZTP : null,
      ITEM_TYPE_CODE: dataORDER_NO[0].ITEM_TYPE_CODE
        ? dataORDER_NO[0].ITEM_TYPE_CODE
        : null,
      ITEM_TYPE_CODE_CNTR: dataORDER_NO[0].ITEM_TYPE_CODE_CNTR
        ? dataORDER_NO[0].ITEM_TYPE_CODE_CNTR
        : null,
      UNIT_CODE: dataORDER_NO[0].UNIT_CODE ? dataORDER_NO[0].UNIT_CODE : null,
      VESSEL_NAME: vesselFound?.name,
      OWNER: ['NKN', 'XKX'].includes(String(dataCode))
        ? customerInfo?.CUSTOMER_NAME
        : dataORDER_NO[0].OWNER,
      ADDRESS: ['NKN', 'XKX'].includes(String(dataCode))
        ? customerInfo?.ADDRESS
        : null,
      PAYER: customerInfo?.CUSTOMER_NAME,
      OWNER_PHONE: ['NKN', 'XKX'].includes(String(dataCode))
        ? null
        : dataORDER_NO[0].OWNER_PHONE,
      CREATE_BY: dataReq.CREATE_BY,
      CREATE_DATE: moment().format('YYYY-MM-DD hh:mm:ss'),
      VESSEL_BOUND:
        dataReq.CLASS_CODE === 1
          ? vesselFound.inbound
            ? vesselFound.inbound
            : null
          : vesselFound.outbound
          ? vesselFound.outbound
          : null,
    };

      let whereQuantityCheck: any = {
        VOYAGEKEY: '',
        HOUSE_BILL: [],
        BOOKING_FWD: [],
        ORDER_NO: '',
      };
      let insertReceipt = dataORDER_NO.map((item: any) => {
      let detail: any = {};
      whereQuantityCheck['ORDER_NO'] = item.ORDER_NO;
      whereQuantityCheck['VOYAGEKEY'] = item.VOYAGEKEY;
      if (dataReq.CLASS_CODE === 1) {
        whereQuantityCheck['HOUSE_BILL'].push(item.HOUSE_BILL);
        detail['HOUSE_BILL'] = item.HOUSE_BILL ? item.HOUSE_BILL : null;
      } else {
        whereQuantityCheck['BOOKING_FWD'].push(item.BOOKING_FWD);
        detail['BOOKING_FWD'] = item.BOOKING_FWD ? item.BOOKING_FWD : null;
      }
      detail['COMMODITYDESCRIPTION'] = item.COMMODITYDESCRIPTION
        ? item.COMMODITYDESCRIPTION
        : null;
      detail['ACTUAL_CARGO_PIECE'] = item.CARGO_PIECE ? item.CARGO_PIECE : null;
      detail['CARGO_WEIGHT'] = item.CARGO_WEIGHT ? item.CARGO_WEIGHT : null;
      detail['CBM'] = item.CBM ? item.CBM : null;

      Object.assign(detail, receiptHeader);
      return detail;
    });

    let getQuantityCheckNote: any = [];
    whereQuantityCheck.HOUSE_BILL.length > 0
    ?
     getQuantityCheckNote = await this.jobQuantRepo
    .find({
      where: {
        ORDER_NO: whereQuantityCheck.ORDER_NO,
        VOYAGEKEY: whereQuantityCheck.VOYAGEKEY,
        HOUSE_BILL: {inq: whereQuantityCheck.HOUSE_BILL},
      },
      fields: ['NOTE', 'HOUSE_BILL', 'BOOKING_FWD'],
    })
    :  getQuantityCheckNote = await this.jobQuantRepo
    .find({
      where: {
        ORDER_NO: whereQuantityCheck.ORDER_NO,
        VOYAGEKEY: whereQuantityCheck.VOYAGEKEY,
        BOOKING_FWD: {inq: whereQuantityCheck.BOOKING_FWD},
      },
      fields: ['NOTE', 'HOUSE_BILL', 'BOOKING_FWD'],
    })

      console.log('get', getQuantityCheckNote);
      console.log('inert', insertReceipt)
    let insertReceiptWithNote = insertReceipt.map((item: any) => {
      let mappedNote = getQuantityCheckNote.filter((p: any) => item.HOUSE_BILL === p.HOUSE_BILL || item.BOOKING_FWD === p.BOOKING_FWD )[0];
      if (mappedNote.NOTE && mappedNote.NOTE.length > 0 ) {
        item['NOTE'] = mappedNote.NOTE;
      } else {
        item['NOTE'] = ''
      }
      return item;
    });
   await this.RECEIPTSRepo.createAll(insertReceiptWithNote).catch(err => {
      this.response['Status'] = false;
      this.response['Payload'] = err;
      this.response[
        'Message'
      ] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`;
      return this.response;
    });

    await this.jobGateRepo
      .find({
        where: obj,
      })
      .then(async (data: any) => {
        if (data.length) {
          let ID: any = data.map((item: any) => item.ID);
          let obj: any = {
            QUANTITY_CHK: true,
            UPDATE_BY: dataReq.UPDATE_BY,
            UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
          };
          return await this.jobGateRepo.updateById(ID, obj).then(() => {
            this.response['Status'] = true;
            this.response['Payload'] = dataReq;
            this.response['Message'] = 'Xác nhận qua cổng!';
            return this.response;
          });
        } else {
          this.response['Status'] = false;
          this.response['Message'] = 'Không tìm thấy dữ liệu!';
          return this.response;
        }
      });
    return this.response;
  }

  //Thoilc(*Note)-Load khi chọn số xe
  @post('/job-gate/loadCar', spec)
  async loadCar(@requestBody() truckList: JSONObject): Promise<any> {
    if (!truckList.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại tàu chuyến!';
      return this.response;
    }
    if (!truckList.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại lệnh!';
      return this.response;
    }
    if (!truckList.PIN_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số pin!';
      return this.response;
    }
    if (!truckList.METHOD_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã phương án!';
      return this.response;
    }

    await this.jobGateRepo
      .find({
        include: [
          {
            relation: 'bsTruck',
            scope: {
              fields: ['TRUCK_DATE_EXP'],
            },
          },
          {
            relation: 'bsRemooc',
            scope: {
              fields: ['REMOOC_DATE_EXP'],
            },
          },
        ],
        where: {
          and: [
            {VOYAGEKEY: String(truckList.VOYAGEKEY)},
            {ORDER_NO: String(truckList.ORDER_NO)},
            {PIN_CODE: String(truckList.PIN_CODE)},
            {METHOD_CODE: String(truckList.METHOD_CODE)},
            {TRUCK_NO: String(truckList.TRUCK_NO)},
            {QUANTITY_CHK: 1},
          ],
        },
      })
      .then((data: any) => {
        let arr: any = [];
        if (data.length) {
          data.map((item: any) => {
            let obj: any = {
              VOYAGEKEY: item.VOYAGEKEY,
              CLASS_CODE: item.CLASS_CODE,
              METHOD_CODE: item.METHOD_CODE,
              ORDER_NO: item.ORDER_NO,
              PIN_CODE: item.PIN_CODE,
              GATE_CODE: item.GATE_CODE,
              HOUSE_BILL: item.HOUSE_BILL,
              BOOKING_NO: item.BOOKING_NO,
              IS_IN_OUT: item.IS_IN_OUT,
              DRIVER: item.DRIVER,
              TEL: item.TEL,
              TRUCK_NO: item.TRUCK_NO,
              WEIGHT_REGIS: item.WEIGHT_REGIS,
              WEIGHT_REGIS_ALLOW: item.WEIGHT_REGIS_ALLOW,
              REMOOC_WEIGHT: item.REMOOC_WEIGHT,
              REMOOC_WEIGHT_REGIS: item.REMOOC_WEIGHT_REGIS,
              CNTRNO: item.CNTRNO,
              CNTRSZTP: item.CNTRSZTP,
              CUSTOMER_CODE: item.CUSTOMER_CODE,
              NOTE: item.NOTE,
              TIME_IN: item.TIME_IN,
              TIME_OUT: item.TIME_OUT,
              IS_SUCCESS_IN: item.IS_SUCCESS_IN,
              IS_SUCCESS_OUT: item.IS_SUCCESS_OUT,
              VGM: item.VGM,
              REMOOC_NO: item.REMOOC_NO,
              BILLOFLADING: item.BILLOFLADING,
              QUANTITY_CHK: item.QUANTITY_CHK,
              TRUCK_DATE_EXP:
                item.bsTruck === undefined ? '' : item.bsTruck.TRUCK_DATE_EXP,
              REMOOC_DATE_EXP:
                item.bsRemooc === undefined
                  ? ''
                  : item.bsRemooc.REMOOC_DATE_EXP,
            };
            arr.push(obj);
          });
          this.response['Status'] = true;
          this.response['Payload'] = arr;
          this.response['Message'] = 'Load dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = 'Số xe hiện tại chưa hoàn tất công việc!';
          return this.response;
        }
      });
    return this.response;
  }

  //Thoilc(*Note)-Xác nhận xe ra cổng
  @post('/job-gate/confirmOrderCar', spec)
  async confirmOrderCar(@requestBody() truckList: JSONObject): Promise<any> {
    if (!truckList.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại tàu chuyến!';
      return this.response;
    }
    if (!truckList.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại lệnh!';
      return this.response;
    }
    if (!truckList.PIN_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số pin!';
      return this.response;
    }
    if (!truckList.METHOD_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã phương án!';
      return this.response;
    }
    if (!truckList.UPDATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại người cập nhật!';
      return this.response;
    }

    if (truckList.QUANTITY_CHK) {
      let obj: any = {
        VOYAGEKEY: truckList.VOYAGEKEY,
        ORDER_NO: truckList.ORDER_NO,
        PIN_CODE: truckList.PIN_CODE,
        METHOD_CODE: truckList.METHOD_CODE,
        QUANTITY_CHK: truckList.QUANTITY_CHK,
        IS_SUCCESS_OUT: true,
        TIME_OUT: moment().format('YYYY-MM-DD HH:mm:ss'),
        NOTE: truckList.NOTE,
        UPDATE_BY: truckList.UPDATE_BY,
        UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      await this.jobGateRepo
        .find({
          where: {
            and: [
              {ORDER_NO: obj.ORDER_NO},
              {PIN_CODE: obj.PIN_CODE},
              {METHOD_CODE: obj.METHOD_CODE},
              {QUANTITY_CHK: obj.QUANTITY_CHK},
            ],
          },
        })
        .then(async (data: any) => {
          if (data.length) {
            await this.jobGateRepo
              .updateAll(obj, {
                and: [
                  {ORDER_NO: obj.ORDER_NO},
                  {PIN_CODE: obj.PIN_CODE},
                  {METHOD_CODE: obj.METHOD_CODE},
                  {QUANTITY_CHK: obj.QUANTITY_CHK},
                ],
              })
              .then(() => {
                this.response['Status'] = true;
                this.response['Payload'] = truckList;
                this.response['Message'] = 'Hoàn tất xe qua cổng!';
                return this.response;
              });
          } else {
            this.response['Status'] = false;
            this.response['Message'] = 'Lệnh chưa hoàn tất kiểm đếm!';
            return this.response;
          }
        });
    } else {
      this.response['Status'] = false;
      this.response['Message'] = 'Lệnh chưa hoàn tất kiểm đếm!';
      return this.response;
    }
    return this.response;
  }

  //Thoilc(*Note)-Xác nhận xe ra cổng
  @post('/job-gate/confirmOrderCarEx', spec)
  async confirmOrderExCar(@requestBody() truckList: JSONObject): Promise<any> {
    if (!truckList.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại tàu chuyến!';
      return this.response;
    }
    if (!(truckList.CLASS_CODE === 1 || truckList.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại hướng!';
      return this.response;
    }
    if (truckList.CLASS_CODE === 1) {
      if (!truckList.HOUSE_BILL) {
        this.response['Status'] = false;
        this.response['Message'] = 'Vui lòng cung cấp lại số house bill!';
        return this.response;
      }
    } else {
      if (!truckList.BOOKING_NO) {
        this.response['Status'] = false;
        this.response['Message'] = 'Vui lòng cung cấp lại số booking no!';
        return this.response;
      }
    }
    if (!truckList.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại lệnh!';
      return this.response;
    }
    if (!truckList.PIN_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số pin!';
      return this.response;
    }
    if (!truckList.METHOD_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã phương án!';
      return this.response;
    }
    if (!truckList.UPDATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại người cập nhật!';
      return this.response;
    }

    if (truckList.QUANTITY_CHK) {
      let obj: any = {
        VOYAGEKEY: truckList.VOYAGEKEY,
        ORDER_NO: truckList.ORDER_NO,
        PIN_CODE: truckList.PIN_CODE,
        METHOD_CODE: truckList.METHOD_CODE,
        QUANTITY_CHK: truckList.QUANTITY_CHK,
        IS_SUCCESS_OUT: true,
        TIME_OUT: moment().format('YYYY-MM-DD HH:mm:ss'),
        NOTE: truckList.NOTE,
        UPDATE_BY: truckList.UPDATE_BY,
        UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      truckList.HOUSE_BILL ? (obj['HOUSE_BILL'] = truckList.HOUSE_BILL) : '';
      truckList.BOOKING_NO ? (obj['BOOKING_NO'] = truckList.BOOKING_NO) : '';
      await this.jobGateRepo
        .find({
          where: {
            and: [
              {ORDER_NO: obj.ORDER_NO},
              {PIN_CODE: obj.PIN_CODE},
              {METHOD_CODE: obj.METHOD_CODE},
              {QUANTITY_CHK: obj.QUANTITY_CHK},
            ],
          },
        })
        .then(async (data: any) => {
          if (data.length) {
            let tempObj: any = {
              VOYAGEKEY: obj.VOYAGEKEY,
              ORDER_NO: obj.ORDER_NO,
              CLASS_CODE: obj.CLASS_CODE,
            };
            truckList.HOUSE_BILL
              ? (tempObj['HOUSE_BILL'] = truckList.HOUSE_BILL)
              : '';
            truckList.BOOKING_NO
              ? (tempObj['BOOKING_NO'] = truckList.BOOKING_NO)
              : '';
            await this.DtPackageStockRepo.updateAll(
              {
                STATUS: 'D',
                TIME_OUT: moment().format('YYYY-MM-DD HH:mm:ss'),
                UPDATE_BY: obj.UPDATE_BY,
                UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
              },
              tempObj,
            );
            await this.jobGateRepo
              .updateAll(obj, {
                and: [
                  {ORDER_NO: obj.ORDER_NO},
                  {PIN_CODE: obj.PIN_CODE},
                  {METHOD_CODE: obj.METHOD_CODE},
                  {QUANTITY_CHK: obj.QUANTITY_CHK},
                ],
              })
              .then(() => {
                this.response['Status'] = true;
                this.response['Payload'] = truckList;
                this.response['Message'] = 'Hoàn tất xe qua cổng!';
                return this.response;
              });
          } else {
            this.response['Status'] = false;
            this.response['Message'] = 'Lệnh chưa hoàn tất kiểm đếm!';
            return this.response;
          }
        });
    } else {
      this.response['Status'] = false;
      this.response['Message'] = 'Lệnh chưa hoàn tất kiểm đếm!';
      return this.response;
    }
    return this.response;
  }
}
