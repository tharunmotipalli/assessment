import axios from "axios"
const Axios=axios.create()
class API extends Axios{

    constructor(){
        super()
    }
}
export default API