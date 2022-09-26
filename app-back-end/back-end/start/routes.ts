import Route from '@ioc:Adonis/Core/Route'
Route.group(()=>{
Route.get('/read','CustomersController.read')
Route.post('/insert','CustomersController.insert')
Route.put('/update/:id','CustomersController.update')
Route.delete('/delete/:id','CustomersController.delete')
Route.post('/search','CustomersController.search')
Route.post('/sort','CustomersController.sort')
}).prefix('/customers').middleware('auth')
Route.group(()=>{
Route.get('/read','HotelsController.read')
Route.post('/insert','HotelsController.insert')
Route.put('/update/:id','HotelsController.update')
Route.delete('/delete/:id','HotelsController.delete')
Route.post('/search','HotelsController.search')
Route.post('/sort','HotelsController.sort')

Route.post('/address/:id','HotelsController.address')
Route.get('/add','HotelsController.add')
}).prefix('/hotels').middleware('auth')