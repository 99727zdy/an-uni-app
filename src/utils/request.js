export default (params) =>{
  return new Promise((resolve, reject)=>{
      uni.showLoading({
        title:'拼命加载中'
      })

      wx.request({
        ...params,
        success(res){
          resolve(res.data);
        },
        fail(err){
          reject(err);
        },
        complete(){
          uni.hideLoading();
        }
      })
  })
}