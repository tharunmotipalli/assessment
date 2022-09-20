import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public customerid:string
  @column()
  public customername:string

}
