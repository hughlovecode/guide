import axios from 'axios'
import qs from 'qs' //qs可以将url解析成对象
let http={
    post:"",
    get:""
}
http.post=function (api,data) {
    let params = qs.stringify(data)
    return new Promise((resolve,reject)=>{
        axios.post(api,params).then((res)=>{
            resolve(res.data)
        })
    })

}

http.get=function (api,data) {
    let params = qs.stringify(data)
    return new Promise((resolve,reject)=>{
        axios.get(api,params).then((res)=>{
            //console.log(res.data);
            resolve(res.data)
        })
    })

}
export default http