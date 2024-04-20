import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, HttpErrors, post, requestBody
} from '@loopback/rest';
import moment from 'moment';
import {BS_CONTRACT_BLOCK} from '../models';
import {BsContractBlockRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'BS_CONTRACT_BLOCK detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class BsContractBlockController {
  constructor(
    @repository(BsContractBlockRepository)
    public bsContractBlockRepository: BsContractBlockRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Hiển thị hợp đồng kho
  @post('/bs-contract-blocks/getItem', spec)
  async view(
    @requestBody() bsContractBlock: JSONObject
  ): Promise<any> {
    let whereObj: any = {};
    bsContractBlock.CONTRACT_CODE ? whereObj['CONTRACT_CODE'] = bsContractBlock.CONTRACT_CODE : '';
    let _from = Array.isArray(bsContractBlock.CREATE_DATE) ? moment(String(bsContractBlock.CREATE_DATE[0]), "DD/MM/YYYY").format("YYYY-MM-DD") : '';
    let _to = Array.isArray(bsContractBlock.CREATE_DATE) ? moment(String(bsContractBlock.CREATE_DATE[1]), "DD/MM/YYYY").format("YYYY-MM-DD") : '';
    _from && _to ? whereObj['CREATE_DATE'] = {
      between: [_from, _to]
    } : '';
    return this.bsContractBlockRepository.find({
      fields: ['ID', 'WAREHOUSE_CODE', 'BLOCK', 'ACREAGE'],
      where: whereObj
    })
      .then(data => {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = "Load dữ liệu thành công!";
        return this.response;
      })
      .catch(() => {
        this.response['Status'] = false;
        this.response['Message'] = "Không thể load dữ liệu!";
        return this.response;
      });
  }

  //Thoilc(*Note)-Cập nhật và thêm mới hợp đồng kho
  @post('/bs-contract-blocks/insertAndUpdate', spec)
  async createUpdate(
    @requestBody() bsContractBlock: JSONObject[]
  ): Promise<any> {
    return Promise.all(bsContractBlock.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.CONTRACT_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã hợp đồng";
            return this.response;
          }
          if (!item.WAREHOUSE_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã kho";
            return this.response;
          }
          if (!item.BLOCK) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại BLOCK";
            return this.response;
          }
          if (!item.ACREAGE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại diện tích kho";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
            return this.response;
          }
          let obj: any = {
            CONTRACT_CODE: item.CONTRACT_CODE,
            WAREHOUSE_CODE: item.WAREHOUSE_CODE,
            BLOCK: item.BLOCK,
            ACREAGE: item.ACREAGE > 0 ? item.ACREAGE : undefined,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };

          if (!obj.ACREAGE) {
            this.response['Status'] = false;
            this.response['Message'] = "Diện tích kho > 0";
            return this.response;
          }
          // ------- check exist customer type code --------
          // let checkCode = await this.bsContractBlockRepository.find({
          //   where: {
          //     CONTRACT_CODE: item.CONTRACT_CODE
          //   }
          // });

          // if (checkCode.length > 0) {
          //   this.response['Status'] = false;
          //   this.response['Message'] = "Mã hợp đồng đã tồn đã tồn tại!";
          //   return this.response;
          // }
          // -----------------------------------------------
          try {
            return await this.bsContractBlockRepository.create(obj)
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
          if (!item.ID) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại số ID";
            return this.response;
          }
          if (!item.UPDATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người cập nhật";
            return this.response;
          }
          item.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
          try {
            return await this.bsContractBlockRepository.updateById(item.ID, item)
              .then(() => {
                this.response['Status'] = true;
                this.response['Payload'].push(item);
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
    }))
      .then(() => {
        return this.response;
      });
  }

  //Thoilc(*Note)-Xoá hợp đồng kho
  @post('/bs-contract-blocks/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(BS_CONTRACT_BLOCK)) bsContractBlock: BS_CONTRACT_BLOCK[]
  ): Promise<any> {
    return Promise.all(bsContractBlock.map(async item => {
      try {
        if (!item.ID) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại số ID";
          return this.response;
        }
        return await this.bsContractBlockRepository.deleteById(item.ID)
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
