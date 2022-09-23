
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"
import Hotel from "App/Models/Hotel"

export default class HotelsController {
  public async read() {
    let data = await Hotel.query()
      .select('*')
      .select('hotels.id')
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
    const hotel = new Hotel()
    hotel.hotelname = request.input('hotelname')
    hotel.customerid = request.input('customerid')
    hotel.doorno = request.input('doorno')
    hotel.street = request.input('street')
    hotel.landmark = request.input('landmark')
    hotel.city = request.input('city')
    hotel.pincode = request.input('pincode')
    await hotel.save()
    return hotel
  }
  public async delete({ request }) {
    const deleteItem = await Hotel.findByOrFail('hotels.id', request.params().id)
    deleteItem.delete()
    await deleteItem.save()
  }
  public async update({ request }) {
    const edititem = await Hotel.findByOrFail('id', request.params().id)
    edititem.hotelname = request.input('hotelname')
    edititem.customerid = request.input('customerid')
    edititem.doorno = request.input('doorno')
    edititem.street = request.input('street')
    edititem.landmark = request.input('landmark')
    edititem.city = request.input('city')
    edititem.pincode = request.input('pincode')
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
      .orWhere((query: any) => {
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
  public async sortasc({ request }: HttpContextContract) {
    const sortItem = request.input('sortItem')
    let data = await Hotel.query()
      .select('*')
      .select('hotels.id')
      .select(Database.raw(`json_build_object('doorno', doorno,'street',street,'landmark',landmark,'city',city,'pincode',pincode) as address`))
      .join('customers', 'hotels.customerid', '=', 'customers.customerid')
      .orderBy(`${sortItem}`, `asc`)
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
  public async sortdesc({ request }: HttpContextContract) {
    const sortItem = request.input('sortItem')
    let data = await Hotel.query()
      .select('*')
      .select('hotels.id')
      .select(Database.raw(`json_build_object('doorno', doorno,'street',street,'landmark',landmark,'city',city,'pincode',pincode) as address`))
      .join('customers', 'hotels.customerid', '=', 'customers.customerid')
      .orderBy(`${sortItem}`, `desc`)
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
