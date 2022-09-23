import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Customer from '../../Models/Customer';


export default class CustomersController {
  public async read() {
    const read = await Customer.query()
      .leftJoin('hotels', 'hotels.customerid', '=', 'customers.customerid')
      .select('customers.*')
      .groupBy('customers.id')
      .count('hotels.customerid as count')
    const newRead = read.map((el) => Object.assign({}, el.$attributes, { count: el.$extras.count }))
    return newRead
  }
  public async insert({ request }: HttpContextContract) {
    const customer = new Customer()
    customer.customerid =request.input('customerid')
    customer.customername =request.input('customername')
    await customer.save()
    return Customer.all()
  }
  public async delete({ request }) {
    const deleteItem = await Customer.findByOrFail('id', request.params().id)
    deleteItem.delete()
    await deleteItem.save()
  }
  public async update({ request }) {
    const edititem = await Customer.findByOrFail('id', request.params().id)
    edititem.customerid =request.input('customerid')
    edititem.customername =request.input('customername')
    await edititem.save()
    return edititem
  }
  public async search({ request }: HttpContextContract) {
    var searchitem = request.input('value')
    const search = await Customer.query()
      .leftJoin('hotels', 'hotels.customerid', '=', 'customers.customerid')
      .select('customers.*')
      .select('customers.id')
      .groupBy('customers.id')
      .count('hotels.customerid as count').where((query) => {
        if (/^[0-9]/.test(searchitem)) {
          query.where('customerid', searchitem)
        }
      })
      .orWhere((query: any) => {
        query
          .where("customername", "ilike", `%${searchitem}%`)
      })
    const newSearch = search.map((el) => Object.assign({}, el.$attributes, { count: el.$extras.count }))
    return newSearch
  }
  public async sort({ request }: HttpContextContract) {
    const sortItem = request.input('sortItem')
    const order=request.input('order')
    const read = await Customer.query()
      .leftJoin('hotels', 'hotels.customerid', '=', 'customers.customerid')
      .select('customers.*')
      .select('customers.id')
      .groupBy('customers.id')
      .count('hotels.customerid as count').orderBy(`customers.${sortItem}`, order)
    const newRead = read.map((el) => Object.assign({}, el.$attributes, { count: el.$extras.count }))
    return newRead
  }

}
