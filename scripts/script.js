// все переменные 
var id = 0;
var usersOnCLient = []
// buttons 

var closeButton = '<button onclick= "deleteTask()" class="close"><i class="fas fa-times"></i></button>'
var doneButton = '<button onclick = "addToDoneList()" class="done"><i class="fas fa-check"></i></button>'
/*
var closeButton = document.createElement('button');
closeButton.onclick = "deleteTask()";
closeButton.classname = "close";
closeButton.innerHTML = '<i class="fas fa-times"></i>';
var doneButton = document.createElement('button');
doneButton.onclick = "addToDoneList()";
doneButton.classname = "done";
doneButton.innerHTML = '<i class="fas fa-check"></i>';
*/
//registration form 
var nickname = document.getElementById('nickname');
var password = document.getElementById('password');
var checkPassword = document.getElementById('checkPassword');
//Sign form 
var nicknameSign = document.getElementById('nicknameSign');
var passwordSign = document.getElementById('passwordSign');

//json-server 
// получаем инфу по юзерам из сервера 
function getUsersInfo() {
	fetch('http://localhost:3000/users')
		.then(resolve => resolve.json()
			.then(
				(users) => {
					for (var x = usersOnCLient.length; x < users.length; x++) {
						usersOnCLient.push(users[x])
					}
				}
			)
		)
}
//Форма Regitration 

// Проверка правильности введеного пароля
function passwordInputCheck(password, checkPassword) {
	console.log(password.value)
	console.log(checkPassword.value)
	if (Sha256.hash(password.value) === Sha256.hash(checkPassword.value)) {
		return true;
	}
	else {
		alert("Wrong password input");
		return false;
	}
}
// Проверка на наличие такого-же никнейма
function checkForExist(nickname) {
	for (var x of usersOnCLient) {
		if (x.nickname == nickname.value) {
			alert("User with this nickname already exist");
			return false
		}
	}
	return true
}
// Добавление в масив пользователей после всех проверок
function addToUsers() {
	var nickname = document.getElementById('nickname');
	var password = document.getElementById('password');
	var exist = checkForExist(nickname);
	var passCheck = passwordInputCheck(password, checkPassword);
	if (exist == true && passCheck == true) {
		fetch('http://localhost:3000/users', {
			method: 'POST',
			body: JSON.stringify({
				nickname: nickname.value,
				password: Sha256.hash(password.value)
			}),
			headers: {
				"Content-type": "application/json"
			}
		})
			.then(response => {
				console.log('response: ', response)
			})
		alert("You have been successfully registered");
		console.log(usersOnCLient)
	}
	getUsersInfo()
}

//Форма Sign IN 
//войти как юзер 
function signAsUser() {
	getUsersInfo()
	for (var x of usersOnCLient) {
		if (x.nickname === nicknameSign.value) {
			console.log(x.nickname)
			console.log(x.password)
			console.log(Sha256.hash(passwordSign.value))
			if (x.password === Sha256.hash(passwordSign.value)) {
				alert(`You signed as ${x.nickname}`);
				document.getElementById('userSign').innerHTML =  `Sign as ${x.nickname}`
				return true;
			}
			else {
				alert("Wrong password");
				return false
			}
		}
	}
}



// Сама ТУ ДУ, работа с элементами ДОМ 

// Добавляю примеры заданий
function addExampleElements() {
	var parent = document.getElementById('undoneList');
	for (var x = 1; x < 3; x++) {
		var exampLi = document.createElement('li')
		exampLi.innerHTML = `This is a task number ${x}`
		exampLi.innerHTML += closeButton
		exampLi.innerHTML += doneButton
		parent.appendChild(exampLi);
	}
}

// Проверяю на заполнение поле инпут 
function valueCheck(value) {
	if (!value) {
		alert("Input a task")
		var error = new Error;
		error.message = "Input field is empty"
		console.error(error)
		return false;
	}
	else return true;
}

// Добавляю элемент в список невыполненых 
function addNewElement() {
	var parent = document.getElementById('undoneList');
	var task = document.getElementById('inp').value;
	var check = valueCheck(task);
	if (!!check) {
		var li = document.createElement('li');
		li.id = id++;
		li.innerHTML = `<p>${task}</p>`;
		li.innerHTML += closeButton
		li.innerHTML += doneButton
		parent.appendChild(li);
	}
	deleteTask()
	addToDoneList()
}

// Добавляю в список выполненых 
function addToDoneList( ) {
	var parent = document.getElementById('doneList')
	var move = document.getElementsByClassName('done')
	for (var i = 0; i < move.length; i++) {
		move[i].onclick = function () {
			var element = this.parentElement;
			element.innerHTML = element.innerText
			element.innerHTML += closeButton
			parent.appendChild(element);
			deleteTask()
		}
	}
}

//Удалить задание
function deleteTask() {
	var close = document.getElementsByClassName('close');
	for (var i = 0; i < close.length; i++) {
		close[i].onclick = function () {
			var div = this.parentElement;
			div.style.display = 'none';
		}
	}
}


//Запуск всех функций 
function start() {
	addExampleElements()
	deleteTask()
	addToDoneList()
	getUsersInfo()
}
start()
