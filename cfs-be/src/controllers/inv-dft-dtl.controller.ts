import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {INV_DFT_DTL} from '../models/inv-dft-dtl.model';
import {InvDftDtlRepository} from '../repositories/inv-dft-dtl.repository';

const spec = {
  responses: {
    '200': {
      description: 'INV_DFT_DTL detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class InvDftDtlController {
  constructor(
    @repository(InvDftDtlRepository)
    public invDftDtlRepository: InvDftDtlRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/inv-dft-dtls')
  async create(
    @requestBody() invDftDtl: INV_DFT_DTL,
  ): Promise<INV_DFT_DTL> {
    return this.invDftDtlRepository.create(invDftDtl);
  }

}
