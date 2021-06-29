import { Account } from "../types/account";
import { UnitResponse, UnitError, Include } from "../types/common";
import { Customer } from "../types/customer";
import { CreatePaymentRequest, Payment,ACHPayment, PatchPaymentRequest } from "../types/payments";
import { Transaction } from "../types/transactions";
import { BaseResource } from "./baseResource";
 
export class Payments extends BaseResource {
    constructor(token: string, basePath: string) {
        super(token, basePath + '/payments')
    }
 
    public async create(request: CreatePaymentRequest) : Promise<UnitResponse<ACHPayment> | UnitError> {
        return this.httpPost<UnitResponse<ACHPayment>>('',request)
    }
 
    public async update(id: number, request: PatchPaymentRequest) : Promise<UnitResponse<Payment> | UnitError> {
        return this.httpPatch<UnitResponse<Payment>>(`${id}`, {data: request})
    }
 
    /**
     * Optional. A comma-separated list of related resources to include in the response.
     * Related resources include: customer, account, transaction. See Getting Related Resources
     */
    public async get(id: number, include?: string) : Promise<UnitResponse<ACHPayment & Include<Account[] | Customer[] | Transaction[]>> | UnitError> {
        const params = {include : include ? `include=${include}` : ''}
        return this.httpGet<UnitResponse<ACHPayment & Include<Account[] | Customer[] | Transaction[]>>>(`${id}`,{params})
    }
 
    public async list(params?: PaymentListParams) : Promise<UnitResponse<ACHPayment[] & Include<Account[] | Customer[] | Transaction[]>> | UnitError> {
        let parameters = {
            'page[limit]': (params?.limit ? params.limit : 100),
            'page[offset]': (params?.offset ? params.offset : 0),
            ...(params?.accountId && { 'filter[accountId]': params.accountId }),
            ...(params?.customerId && { 'filter[customerIdcustomerId]': params.customerId }),
            ...(params?.tags && { 'filter[tags]': params.tags }),
            'sort': params?.sort ? params.sort : '-createdAt',
            'include': params?.include ? params.include : ''
        }
 
        return this.httpGet<UnitResponse<ACHPayment[] & Include<Account[] | Customer[] | Transaction[]>>>('', {params: parameters})
    }
}
 
export interface PaymentListParams {
    /**
     * Maximum number of resources that will be returned. Maximum is 1000 resources. See Pagination.
     * default: 100
     */
    limit?: number,
 
    /**
     * Number of resources to skip. See Pagination.
     * default: 0
     */
    offset?: number
 
    /**
     * Optional. Filters the results by the specified account id.
     * default: empty
     */
    accountId?: string
 
    /**
     * Optional. Filters the results by the specified customer id.
     * default: empty
     */
    customerId?: string
 
    /**
    * Optional. Filter Applications by Tags.
    * default: empty
    */
    tags?: Object
 
    /**
     * Optional. .Leave empty or provide sort = createdAt for ascending order.Provide sort = -createdAt(leading minus sign) for descending order.
     * default: sort=-createdAt	
     */
    sort?: string
 
    /**
    * Optional. A comma-separated list of related resources to include in the response. 
    * Related resources include: customer, account. [See Getting Related Resources](https://developers.unit.co/#intro-getting-related-resources)
    */
    include?: string
}