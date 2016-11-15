const apiKey = 'c5e94c788664f9506e9ede3a27d5660f';

export default {
	getWeather(city) {
		let promise = fetch('http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID='+apiKey+'&units=metric');
		return promise.then(r => r.json())
	}
}