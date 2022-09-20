 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"
import Hotel from "App/Models/Hotel"

export default class HotelsController {
    public read(){
        return Database.from('hotels').select('*').orderBy('id')
    
      }
      public async insert({request}:HttpContextContract){
        const hotel=new Hotel()
        hotel.hotelname=request.input('hotelname')
        hotel.customerid=request.input('customerid')
        hotel.doorno=request.input('doorno')
        hotel.street=request.input('street')
        hotel.landmark=request.input('landmark')
        hotel.city=request.input('city')
        hotel.pincode=request.input('pincode')
        await hotel.save()
        const address=await Database.from('hotels').select('doorno','street','city','landmark','pincode').as('address')
        console.log(address)
        return address
      }
      public async delete({ request }) {
        const deleteItem = await Hotel.findByOrFail('id', request.params().id)
        deleteItem.delete()
        await deleteItem.save()
      }
      public async update({ request }) {
    const edititem = await Hotel.findByOrFail('id', request.params().id)
       edititem.hotelname=request.input('hotelname')
       edititem.customerid=request.input('customerid')
       edititem.doorno=request.input('doorno')
       edititem.street=request.input('street')
       edititem.landmark=request.input('landmark')
       edititem.city=request.input('city')
       edititem.pincode=request.input('pincode')
      
        await edititem.save()
        return 
      }
      public async search({ request }: HttpContextContract) {
        var searchitem = request.input('value')
        const search = await Database.from('hotels').select('*').where((query) => {
          if (/^[0-9]/.test(searchitem)) {
            query.where('id', searchitem).orWhere('doorno',searchitem).orWhere('pincode',searchitem).orWhere('customerid',searchitem)
          }
        })
          .orWhere((query: any) => {
            query
              .where("hotelname", "ilike", `%${searchitem}%`)
              .orWhere("street", "ilike", `%${searchitem}%`)  
              .orWhere("landmark", "ilike", `%${searchitem}%`)
              .orWhere("city", "ilike", `%${searchitem}%`)  
          })
        return search
        }
        public async sortasc({ request }: HttpContextContract) {
            const sortItem = request.input('sortItem')
        
            const sort = await Database.from('hotels').select('*').orderBy(`${sortItem}`, `asc`)
            return sort
          } public async sortdesc({ request }: HttpContextContract) {
            const sortItem = request.input('sortItem')
        
            const sort = await Database.from('hotels').select('*').orderBy(`${sortItem}`, `desc`)
            return sort
          }
         




}
