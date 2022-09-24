const fs = require('fs');
const dataPath = './db/ordersdb.json' 

/********** Util Functions ***********/ 
module.exports = {
    getDate:  function(){
    let dateObj = new Date();
    let date = ("0" + dateObj.getDate()).slice(-2);
    let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    let year = dateObj.getFullYear();
    return date + "/" + month + '/' + year
  },
  getTime: function(){
    let dateObj = new Date();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getSeconds();
    return hours + ":" + minutes + ':' + seconds
  }, 
  saveOrderData: function(data){  
    // convert json object to json string
    const stringifyData = JSON.stringify(data)
    // write order to db.json
    fs.writeFileSync(dataPath, stringifyData)
  },
  getOrderData: function(){
    // read orders from db.json
    const jsonData = fs.readFileSync(dataPath)
    // convert json string to json object
    return JSON.parse(jsonData)
  }
};