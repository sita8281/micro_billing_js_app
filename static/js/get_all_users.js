export const getFolder = () =>  {fetch('http://127.0.0.1:5000/api/manage/folders/1', {headers: {'Authorization': 'Basic ' + btoa('artem' + ':' + 'artem')}})
		.then(response => response.json())
		.then(data => console.log(data))
		.catch(error => console.log('Ошибка бля:', error))
}

