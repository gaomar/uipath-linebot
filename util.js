const axios = require('axios');

module.exports.sendRPA = async function sendRPA(message) {  
  // UiPathに渡すパラメータ
  const data = 
  {
    "message": message
  };

  // オプションを定義
  const jsonData =
  {
    "startInfo": {
      "ReleaseKey": process.env.RPA_RELEASEKEY,
      "Strategy": "All",
      "RobotIds": [],
      "NoOfRobots": 0,
      "InputArguments": JSON.stringify(data)
    }
  };

  return new Promise(function (resolve, reject) {
    axios.post(process.env.RPA_URL, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RPA_TOKEN}`,
        'X-UIPATH-TenantName': `${process.env.RPA_TENANTNAME}`
      }
    }).then(res => {
      resolve(true);
    }).catch(error => {
      reject(error.response);
    });
  });
};