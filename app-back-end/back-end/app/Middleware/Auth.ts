import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { appKey } from 'Config/app'
export default class Appkey {
  public async handle({request,response}: HttpContextContract, next: () => Promise<void>) {
    if(appKey!=request.header('appKey')){
      response.status(401).send('NO Proper App KEY')
      return
    }
    await next()
  }
}
module.exports=Appkey