const http = require('http');
const fs = require('fs');
const request = require('request');
const PORT = 1234;
const dynamicData = ({currentFileContent, apiData}) => {
  currentFileContent = currentFileContent.replace('{%city%}', apiData.name);
  currentFileContent = currentFileContent.replace('{%country%}', apiData.sys.country);
  currentFileContent = currentFileContent.replace('{%weatherStatus%}', apiData.weather[0].main);
  currentFileContent = currentFileContent.replace('{%temperature%}', (apiData.main.temp - 273).toFixed(2));
  currentFileContent = currentFileContent.replace('{%temperatureMin%}', (apiData.main.temp_min - 273).toFixed(2));
  currentFileContent = currentFileContent.replace('{%temperatureMax%}', (apiData.main.temp_max - 273).toFixed(2));
  return currentFileContent;
}
const sever = http.createServer((req, res) => {
  if (req.url == "/") {
    const currentFile = './index.html';
    let currentFileContent = fs.readFileSync(currentFile, 'utf-8');
    request('https://api.openweathermap.org/data/2.5/weather?q=Dhaka,bd&appid=a7c88228b3cf1a8d601e3cc8840153a9')
      .on('data', chunk => {
        const apiData = JSON.parse(chunk);
        currentFileContent = dynamicData({apiData,currentFileContent});
        res.write(currentFileContent);
      })
      .on('end', error => {
        if (error) return console.log('error occureed');
        console.log('successfuly end');
        res.end();
      })
  }

}).listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
