var http = require('http');

const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Tulsa&appid=0eb60cd397250222e067a312fc4b5775&units=imperial';

exports.handler = async (event) => {
    let dataString = ''; // initialize variable

    const response = await new Promise((resolve, reject) => {
        const req = http.get(apiUrl, function(res) { // Retrieve data from the weather api
            res.on('data', chunk => { // Called when data is received.
                // Append this part of the response stream to the complete response.
                dataString += chunk;
            });
            res.on('end', () => { // Called when the data stream is closed.
                // Transform the completed data string into a more usable JSON object with only the elements we are going to use.
                const dataJson = JSON.parse(dataString);
                const respData = {
                    condition: dataJson.weather[0].main,
                    currTemp: dataJson.main.temp,
                    feelsLike: dataJson.main.feels_like,
                    highTemp: dataJson.main.temp_max,
                    lowTemp: dataJson.main.temp_min
                };
                // Notify the caller that the function is finished.
                resolve({statusCode: 200, body: JSON.stringify(respData), headers: {'Access-Control-Allow-Origin': '*'}});
            });
        }).end();
        req.on('error', (e) => { // Uh oh!
            // Log the error in CloudWatch.  In a production system, this would be implemented differently to capture specific error information, hopefully with viable exception handling.
            console.log(e);
            // Notify the caller that there was an error.
            reject({statusCode: 500, body: 'Unable to retieve weather, internal error.'});
        });
    });
    return response;
};