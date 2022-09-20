import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import Customer from '../../Models/Customer';


export default class CustomersController {
 public read(){
    return Database.from('customers').select('*').orderBy('customerid')

  }
  public async insert({request}:HttpContextContract){
    const customer=new Customer()
    customer.customerid=request.input('customerid')
    customer.customername=request.input('customername')
    await customer.save()
    return Customer.all()
  }
  public async delete({ request }) {
    const deleteItem = await Customer.findByOrFail('id', request.params().id)
    deleteItem.delete()
    await deleteItem.save()
  }
  public async update({ request }) {
    console.log(request.params().id)
    const edititem = await Customer.findByOrFail('id', request.params().id)
    edititem.customername = request.input('customername')
    await edititem.save()
    return edititem
  }
  public async search({ request }: HttpContextContract) {
    var searchitem = request.input('value')
    const search = await Database.from('customers').select('*').where((query) => {
      if (/^[0-9]/.test(searchitem)) {
        query.where('customerid', searchitem)
      }
    })
      .orWhere((query: any) => {
        query
          .where("customername", "ilike", `%${searchitem}%`)
      })  
    
    return search
    }
    public async sortasc({ request }: HttpContextContract) {
        const sortItem = request.input('sortItem')
    
        const sort = await Database.from('customers').select('*').orderBy(`${sortItem}`, `asc`)
        return sort
      } public async sortdesc({ request }: HttpContextContract) {
        const sortItem = request.input('sortItem')
    
        const sort = await Database.from('customers').select('*').orderBy(`${sortItem}`, `desc`)
        return sort
      }




}
