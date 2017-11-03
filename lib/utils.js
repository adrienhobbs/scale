const parseOpenScaleData = function (dataStr) {
  var dataArray = dataStr.split(',');
  var data = {};

  //If valid array of data, populate data object
  if (dataArray.length > 3 && dataArray.indexOf("lbs") != -1) {
    data.weight = Number(dataArray[1]);
    data.weightUnit = dataArray[2];
    data.temp = Math.round((Number(dataArray[3]) * 9/5) + 32);
    data.rawValue = Number(dataArray[4]);
    data.tempUnit = "Celsius";
    return data;
  } else {
    return false;
  }
};

const parseData = function (data) {
  var parsedData;

  for (var i = 0; i < data.length; i++) {
    if (data[i] > 31) {
      string += String.fromCharCode(data[i]);
    } else {
      if (string) {
        data = parseOpenScaleData(string);
        if (data !== false) {
          console.log(data)
        }
      }
      string = "";
    }
  }
  return data
}


module.exports = {
  parseOpenScaleData,
  parseData
}
