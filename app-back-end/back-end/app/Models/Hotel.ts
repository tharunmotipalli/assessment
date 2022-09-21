
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Hotel extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public hotelname: string
  @column()
  public customerid:number
  @column()
  public doorno: number
  @column()
  public street: string
  @column()
  public landmark: string
  @column()
  public city: string
  @column()
  public pincode: number
  static $extras: any
}
