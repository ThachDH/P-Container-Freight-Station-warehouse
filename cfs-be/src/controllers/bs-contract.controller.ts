import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, HttpErrors, post, requestBody
} from '@loopback/rest';
import moment from 'moment';
import {BS_CONTRACT} from '../models';
import {BsContractRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'BS_CONTRACT list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

export class BsContractController {
  constructor(
    @repository(BsContractRepository)
    public bsContractRepository: BsContractRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Hiển thị hợp đồng
  @post('/bs-contracts/view', spec)
  async view(): Promise<BS_CONTRACT[]> {
    return this.bsContractRepository.find({
      fields: ['ID', 'CUSTOMER_CODE', 'CONTRACT_CODE', 'CONTRACT_NAME', 'FROM_DATE', 'TO_DATE', 'NOTE'],
    });
  }

  //Thoilc(*Note)-Cập nhật và thêm mới hợp đồng
  @post('/bs-contracts/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() bsContract: JSONObject,
  ): Promise<any> {
    switch (bsContract.status) {
      case 'insert':
        if (!bsContract.CUSTOMER_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại mã khách hàng";
          return this.response;
        }
        if (!bsContract.CONTRACT_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại mã hợp đồng";
          return this.response;
        }
        if (!bsContract.CONTRACT_NAME) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại tên hợp đồng";
          return this.response;
        }
        if (!bsContract.FROM_DATE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại ngày bắt đầu";
          return this.response;
        }
        if (!bsContract.TO_DATE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại ngày hết hạn";
          return this.response;
        }
        if (!bsContract.CREATE_BY) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
          return this.response;
        }

        let obj: any = {
          CUSTOMER_CODE: bsContract.CUSTOMER_CODE,
          CONTRACT_CODE: bsContract.CONTRACT_CODE,
          CONTRACT_NAME: bsContract.CONTRACT_NAME,
          FROM_DATE: moment(String(bsContract.FROM_DATE), "DD/MM/YYYY").format("YYYY-MM-DD"),
          TO_DATE: moment(String(bsContract.TO_DATE), "DD/MM/YYYY").format("YYYY-MM-DD"),
          NOTE: bsContract.NOTE,
          CREATE_BY: bsContract.CREATE_BY,
          CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss")
        };
        // ------- check exist customer type code --------
        let checkCode = await this.bsContractRepository.find({
          where: {
            CONTRACT_CODE: String(bsContract.CONTRACT_CODE)
          }
        });

        if (checkCode.length > 0) {
          this.response['Status'] = false;
          this.response['Message'] = "Mã hợp đồng thuê đã tồn tại!";
          return this.response;
        }
        // -----------------------------------------------
        try {
          return await this.bsContractRepository.create(obj)
            .then(data => {
              this.response['Status'] = true;
              this.response['Payload'].push(data);
              this.response['Message'] = "Lưu dữ liệu thành công!";
              return this.response;
            });
        } catch {
          this.response['Status'] = false;
          this.response['Message'] = "Không thể lưu mới dữ liệu!";
          return this.response;
        }
      case 'update':
        if (!bsContract.ID) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại số ID";
          return this.response;
        }
        if (!bsContract.UPDATE_BY) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại tên người cập nhật";
          return this.response;
        }
        bsContract.UPDATE_DATE = moment().format("YYYY-MM-DD hh:mm:ss");
        try {
          return await this.bsContractRepository.updateById(Number(bsContract.ID), bsContract)
            .then(() => {
              this.response['Status'] = true;
              this.response['Payload'].push(bsContract);
              this.response['Message'] = "Lưu dữ liệu thành công!";
              return this.response;
            });
        } catch {
          this.response['Status'] = false;
          this.response['Message'] = "Không thể lưu mới dữ liệu!";
          return this.response;
        }
      default:
        throw new HttpErrors.Forbidden("ERROR");
    }
  }

  //Thoilc(*Note)-Xoá hợp đồng
  @post('/bs-contracts/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(BS_CONTRACT)) bsContract: BS_CONTRACT[],
  ): Promise<any> {
    return Promise.all(bsContract.map(async item => {
      try {
        if (!item.ID) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại số ID";
          return this.response;
        }
        return await this.bsContractRepository.deleteById(item.ID)
          .then(() => {
            this.response['Status'] = true;
            this.response['Message'] = "Xóa dữ liệu thành công!";
            return this.response;
          });
      } catch {
        this.response['Status'] = false;
        this.response['Message'] = "Xóa dữ liệu không thành công!";
      }
    })).then(() => {
      return this.response;
    });
  }
}
