//Поля в котором выводится результат и знак
let screen = document.querySelector('.screen')
let hystory = document.getElementById('hystory-value')

let buffer = '0'
let runningTotal = 0
let previousOperator = null
let maxNumbers = 12

//Функция нажатия клавиши
function buttonClick(value) {
	if (isNaN(value)) {
		addSymbol(value)
	} else {
		addNumber(value)
	}
	chkErrors()
}

function chkErrors() {
	screen.textContent = buffer
	if (isNaN(runningTotal) || isNaN(buffer) || runningTotal === 'ERROR') {
		runningTotal = 0
		screen.textContent = 'ERROR'
	}
	runningTotal === 0
		? (hystory.textContent = `operation`)
		: (hystory.textContent = runningTotal + previousOperator)
}

//Добавляем число в строку
function addNumber(str) {
	if (
		buffer === 'ERROR' ||
		// проверка (напр) 5-5 и после = 0, то невозможно было добавить цифру
		buffer.length === undefined
	) {
		buffer = ''
	}
	if (buffer.length <= maxNumbers - 1) {
		if (buffer === '0') {
			buffer = str
		} else {
			buffer += str
		}
	} else {
		buffer = buffer.substring(0, maxNumbers)
	}
}
//Добавляем символ в строку
function addSymbol(symbol) {
	switch (symbol) {
		case 'C':
			buffer = '0'
			runningTotal = 0
			previousOperator = null
			break
		case '=':
			if (previousOperator === null) {
				return
			}
			calculate(Number(buffer))
			previousOperator = null
			buffer = runningTotal
			runningTotal = 0
			break
		case 'DEL':
			// по замечанию 3
			if (buffer === 'ERROR') {
				addSymbol('C')
			}
			if (buffer.length === 1) {
				buffer = '0'
			} else {
				buffer = buffer.toString().substring(0, buffer.toString().length - 1)
			}
			break
		case ',':
			if (buffer.length === 1 && buffer === '0') {
				buffer = '0.'
			} else if (buffer.includes('.')) {
				return
			} else {
				if (buffer.length < maxNumbers) {
					buffer += '.'
				}
			}
			break
		case '+/-':
			buffer = buffer * -1
			break
		case '%':
			buffer = (buffer / 100).toString()
			break
		case '+':
		case '-':
		case 'x':
		case '/':
			handleMath(symbol)
			break
	}
}
//Проверка перед калькуляцией
function handleMath(symbol) {
	if (buffer === '0') {
		previousOperator = symbol
		hystory.textContent = previousOperator
		return
	}
	const intBuffer = Number(buffer)
	if (runningTotal === 0) {
		runningTotal = intBuffer
		previousOperator = symbol
	} else {
		calculate(intBuffer)
	}
	previousOperator = symbol
	buffer = '0'
}
// Считаем обычные числа
function calculate(intBuffer) {
	try {
		runningTotal = Number(runningTotal)
		if (previousOperator === '+') {
			runningTotal += intBuffer
		} else if (previousOperator === '-') {
			runningTotal -= intBuffer
		} else if (previousOperator === 'x') {
			runningTotal *= intBuffer
		} else if (previousOperator === '/') {
			runningTotal /= intBuffer
		}
		runningTotal = +runningTotal.toFixed(6)
		if (runningTotal.toString().length >= maxNumbers * 2) {
			throw Error
		} else {
			runningTotal = runningTotal.toString().substring(0, maxNumbers * 2)
		}
	} catch (error) {
		runningTotal = 'ERROR'
	}
	isFinite(runningTotal) ? runningTotal : (runningTotal = 'ERROR')
}
//присваиваем каждому диву слушатель событий
function init() {
	document.querySelectorAll('.item').forEach((button) =>
		button.addEventListener('click', function (event) {
			buttonClick(button.textContent)
		})
	)
}
init()

//Привязка клавиш
document.addEventListener('keydown', function (event) {
	let patternForNumbers = /[0-9]/g
	let patternForOperators = /[+\-*%x\/]/g

	if (event.key.match(patternForNumbers)) {
		event.preventDefault()
		buttonClick(event.key)
	}
	if (event.key === '.' || event.key === ',') {
		event.preventDefault()
		buttonClick(',')
	}
	if (event.key.match(patternForOperators)) {
		event.preventDefault()
		buttonClick(event.key)
		if (event.key === '*') {
			buttonClick('x')
		}
	}
	if (event.key === 'Enter' || event.key === '=') {
		event.preventDefault()
		buttonClick('=')
	}
	if (event.key === 'Backspace') {
		event.preventDefault()
		buttonClick('DEL')
	}
	if (event.key == 'Delete' || event.key === 'c') {
		event.preventDefault()
		buttonClick('C')
	}
	if (event.key == 'r') {
		event.preventDefault()
		buttonClick('+/-')
	}
})
