import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {INV_DFT} from '../models/inv-dft.model';
import {InvDftRepository} from '../repositories/inv-dft.repository';

const spec = {
  responses: {
    '200': {
      description: 'INV_DFT detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class InvDftController {
  constructor(
    @repository(InvDftRepository)
    public invDftRepository: InvDftRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Test
  @post('/inv-dfts')
  async create(
    @requestBody() invDft: INV_DFT,
  ): Promise<INV_DFT> {
    return this.invDftRepository.create(invDft);
  }
}
