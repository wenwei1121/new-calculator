const calculator = document.querySelector('.calculator')
const showplace = document.querySelector('.showPlace')
const keys = document.querySelector('.keys')

let currentOperatorBtn = 0
const aniBtn = document.querySelectorAll('.ani')

const removeActiveFn = () => {
  for(let i = currentOperatorBtn; i < aniBtn.length; i++) {
    aniBtn[i].classList.remove("active")
  }
}

keys.addEventListener('click', e => {
  if(e.target.matches("button")) {
    const target = e.target
    console.log(target)
    const keyContent = target.textContent
    let showNum = showplace.textContent
    const action = target.dataset.action
    // 前一個值的類型
    const preValueType = calculator.dataset.preValueType

    // 點擊到的是(+ or - or * or ÷)
    if(
      action === "add" ||
      action === "subtract" ||
      action === "multiply" ||
      action === "divide"
    ) {

      removeActiveFn()

      target.classList.add("active")

      const firstValue = calculator.dataset.firstValue
      const operator = calculator.dataset.operator
      const secondValue = showNum

      // 按等號後都會有modValue的值 所以再想不按ce直接另外四則運算時判斷modValue有無值
      // 有值的話 firstValue 跟第一次做四則運算時一樣抓的是 showNum(顯示數字地方的數字) 
      // 另外modValue要設為空值 不然後面用連續運算會壞掉
      if(firstValue && operator && calculator.dataset.modValue) {
        calculator.dataset.firstValue = showNum
        calculator.dataset.modValue = ""
      }

      // 連續運算
      else if(firstValue && operator) {
        if(preValueType === "percent" || preValueType === "number") {
          showplace.textContent = calFn(firstValue, operator, secondValue)
          // calculator.dataset.modValue = secondValue
          calculator.dataset.firstValue = showplace.textContent
          // (要抓取的是計算後的數 => 所以要寫showplace.textContent 而不是showNum 不然會跟secondValue一樣抓到要加的值)
        }

        else if(preValueType === "calculate") {
          calculator.dataset.firstValue = showNum
        }
      }

      else {
        calculator.dataset.firstValue = showNum
      }
      
      calculator.dataset.operator = action
      calculator.dataset.preValueType = "operator"
    }

    // 點擊到的是清除
    if(action === "clear") {

      removeActiveFn()

      if(keyContent === "AC") {
        calculator.dataset.firstValue = ""
        calculator.dataset.operator = ""
        calculator.dataset.modValue = ""
      }

      target.textContent = "AC"
      showplace.textContent = "0"
      calculator.dataset.preValueType = "clear"
    }

    // 點擊到的是百分之...
    // 未做運算,單純除以100
    if(action === "percent") {

      removeActiveFn()

      showplace.textContent = showNum / 100
      calculator.dataset.preValueType = "percent"
    }

    // 點擊到的是階層
    if(action === "factorial"){

      removeActiveFn()

      // 判斷要階層的數字是否小於0或是不是整數 
      //(ES6)Number.isInteger(X) => 直接判斷X是否為整數 回傳布林值 不是數字也是false
      if(parseFloat(showNum) < 0 || !Number.isInteger(parseFloat(showNum))) {
        showplace.textContent = "ERROR"
      }

      else {
        showplace.textContent = factorial(parseFloat(showNum))
      }

      calculator.dataset.preValueType = "factorial"
    }

    //點擊到的是小數點
    if(action === "demical") {

      removeActiveFn()

      if(showNum === "0") {
        showplace.textContent = "0."
      }

      else if(showNum.includes(".")) {
        showplace.textContent = showNum
      }

      else {
        showplace.textContent = showNum + "."
      }

      calculator.dataset.preValueType = "demical"
    }

    // 點擊到的是等號計算
    if(action === "calculate") {

      removeActiveFn()

      let firstValue = calculator.dataset.firstValue
      const operator = calculator.dataset.operator
      let secondValue = showNum

      if(firstValue) {
        // 按等號連續運算(不會動到calculator.dataset.firstValue)
        if(preValueType === "calculate") {
          // firstValue改抓顯示數字地方的數字
          firstValue = showNum   
          // secondValue抓按等號後都會有的modValue(因為等號連續運算的第二個數是固定的(ex: 1+2=3, 3+2=5) => 都是2)
          secondValue = calculator.dataset.modValue       
        }

        showplace.textContent = calFn(firstValue, operator, secondValue)
      }

      calculator.dataset.modValue = secondValue
      calculator.dataset.preValueType = "calculate"
    }

    // 點到的是其他(也就是數字)
    if(!action) {

      removeActiveFn()

      const clearBtn = document.querySelector('[data-action="clear"]')
      clearBtn.textContent = "CE"

      // 新的數
      if(showNum === "0" || preValueType === "calculate" || preValueType === "operator") {
        showplace.textContent = keyContent
      }

      else {
        showplace.textContent = showNum + keyContent
      }

      calculator.dataset.preValueType = "number"
    }
  }
})

// 運算函式
const calFn = (firstValue, operator, secondValue) => {
  let result = ""

  if(operator === "add") {
    // parseFloat 把原本是字串轉掉
    result = parseFloat(firstValue) + parseFloat(secondValue)
  }

  if(operator === "subtract") {
    result = parseFloat(firstValue) - parseFloat(secondValue)
  }

  if(operator === "multiply") {
    result = parseFloat(firstValue) * parseFloat(secondValue)
  }

  if(operator === "divide") {
    result = parseFloat(firstValue) / parseFloat(secondValue)
  }

  return result
}

// 階層函式
const factorial = (num) => {
  if(num === 0) {
    return 1
  }

  else {
    return num * factorial(num - 1)
  }
}

// 抓當前網址
let frontUrl = location.href

// Web APIs => URL url的searchParams屬性返回一個URLSearchParams物件 這個物件允許訪問當前URL中解碼後的GET方法裡的參數
let parseUrl = new URL(frontUrl)
// console.log(parseUrl.searchParams)

// search 抓?後的參數部分(包含?)
// searchParams 是一個物件{} 要檢視可用toString() 得到參數的部分
// console.log(parseUrl.searchParams.toString()) => 值如果是中文是亂碼
// 返回一个 USVString 如果没找到，返回 null
let value = parseUrl.searchParams.get('name') // 利用物件里的方法get()抓key的相對應value
// console.log(value)

const  userName = document.querySelector('.user-name')
userName.textContent = "你好!" + value