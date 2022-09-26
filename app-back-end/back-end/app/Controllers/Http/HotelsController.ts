
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"
import Hotel from "App/Models/Hotel"
import HotelValidator from '../../Validators/HotelValidator';

export default class HotelsController {
  public async read() {
    let data = await Hotel.query()
      .select('*') .select('hotels.id')
      .select(Database.raw(`json_build_object('doorno', doorno,'street',street,'landmark',landmark,'city',city,'pincode',pincode) as address`))
      .join('customers', 'hotels.customerid', '=', 'customers.customerid')
      .then(data => data.map(el => {
        const data = el.toJSON()
        return {
          ...data,
          customername: el.$extras.customername,
          address: el.$extras.address
        }
      }))
    return data
  }
  public async insert({ request }: HttpContextContract) {
    const payload=await request.validate(HotelValidator)
    const hotel = new Hotel()
    hotel.hotelname = payload['hotelname']
    hotel.customerid = payload['customerid']
    hotel.doorno = payload['doorno']
    hotel.street = payload['street']
    hotel.landmark = payload['landmark']
    hotel.city = payload['city']
    hotel.pincode = payload['pincode']
    await hotel.save()
    return hotel
  }
  public async delete({ request }) {
    const deleteItem = await Hotel.findByOrFail('hotels.id', request.params().id)
    deleteItem.delete()
    await deleteItem.save()
  }
  public async update({ request }) {
    const payload=await request.validate(HotelValidator)
    const edititem = await Hotel.findByOrFail('id', request.params().id)
    edititem.hotelname = payload['hotelname']
    edititem.customerid = payload['customerid']
    edititem.doorno = payload['doorno']
    edititem.street = payload['street']
    edititem.landmark = payload['landmark']
    edititem.city = payload['city']
    edititem.pincode = payload['pincode']
    await edititem.save()
    return
  }
  public async search({ request }: HttpContextContract) {
    var searchitem = request.input('value')
    let data = await Hotel.query()
      .select('*')
      .select('hotels.id')
      .select(Database.raw(`json_build_object('doorno', doorno,'street',street,'landmark',landmark,'city',city,'pincode',pincode) as address`))
      .join('customers', 'hotels.customerid', '=', 'customers.customerid')
      .where((query) => {
        if (/^[0-9]/.test(searchitem)) {
          query.where('hotels.customerid', searchitem).orWhere('pincode',searchitem)
        }
      })
      .orWhere((query) => {
        query
          .where("hotelname", "ilike", `%${searchitem}%`)
          .orWhere("customers.customername","ilike", `%${searchitem}%`)
          
        })
      .then(data => data.map(el => {
        const data = el.toJSON()
        return {
          ...data,
          customername: el.$extras.customername,
          address: el.$extras.address
        }
      }))
      console.log(data)
    return data
  }
  public async sort({ request }: HttpContextContract) {
    const sortItem = request.input('sortItem')
    const order=request.input('order')
    let data = await Hotel.query()
      .select('*')
      .select('hotels.id')
      .select(Database.raw(`json_build_object('doorno', doorno,'street',street,'landmark',landmark,'city',city,'pincode',pincode) as address`))
      .join('customers', 'hotels.customerid', '=', 'customers.customerid')
      .orderBy(`${sortItem}`, order)
      .then(data => data.map(el => {
        const data = el.toJSON()
        return {
          ...data,
          customername: el.$extras.customername,
          address: el.$extras.address
        }


      }))
    return data
  }

}
