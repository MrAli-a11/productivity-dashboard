function openFeatures() {
  const allElem = document.querySelectorAll('.elem')
  const fullElemPage = document.querySelectorAll('.fullElem')
  const fullElemBackBtn = document.querySelectorAll('.fullElem .back')

  allElem.forEach((elem) => {
    elem.addEventListener('click', () => {
      const page = fullElemPage[elem.id];
      page.style.display = 'block';
      page.classList.add("fixed", "inset-0", "z-50", "overflow-auto", "bg-white");
      document.body.style.overflow = 'hidden'; 
      fullElemPage[elem.id].style.display = 'block';
    })
  })

  fullElemBackBtn.forEach((back) => {
    back.addEventListener('click', () => {
      const page = fullElemPage[back.id];
      page.style.display = 'none';
      page.classList.remove("fixed", "inset-0", "z-50", "overflow-auto", "bg-white");
      document.body.style.overflow = 'auto'; 
      fullElemPage[back.id].style.display = 'none';
    })
  })
}

openFeatures()


function todoList() {
  let currentTaskList = []
  let allTask = document.querySelector('.allTask')

  if (localStorage.getItem('currentTaskList')) {
    currentTaskList = JSON.parse(localStorage.getItem('currentTaskList'))
  } else {
    console.log('task list is empty')
  }

  window.toggleDetails = function (id) {
    const para = document.getElementById(`details-${id}`);
    if (para) {
      para.classList.toggle("hidden");
    } else {
      console.warn(`details-${id} not found in DOM`);
    }
  }


  function renderedTask() {
    let sum = ''

    currentTaskList.forEach((elem, idx) => {
      const impClass = elem.imp ? 'opacity-100' : 'opacity-0'

      sum += `
        <div class="task flex flex-col w-full bg-white border-2 border-black text-black p-2 rounded">
          <div class="flex items-center justify-between">
            <h5 class="text-black text-2xl font-semibold flex items-start gap-[10px]">
              ${elem.task}
              <span class="${impClass} bg-red-500 text-white text-[11px] px-[8px] py-[4px] rounded-2xl">Imp</span>
            </h5>
            <div class="flex gap-2">
              <i class="fa-regular fa-square-caret-down text-black text-xl cursor-pointer active:scale-95 md:text-2xl" onclick="toggleDetails(${idx})"></i>
              <i class="icon fa-solid fa-check-double text-black text-xl cursor-pointer active:scale-95 md:text-2xl" id="${idx}"></i>
            </div>
          </div>
          <p id="details-${idx}" class="text-black border-t-1 pt-2 border-gray-300 mt-2 hidden transition-all duration-300 ease-in-out">
            ${elem.details}
          </p>
        </div>
      `
    })

    allTask.innerHTML = sum
    localStorage.setItem('currentTaskList', JSON.stringify(currentTaskList))

    let allTaskH5 = document.querySelector('.allTask h5')
    if (allTaskH5 === null) {
      allTask.style.display = 'none'
    } else {
      allTask.style.display = 'flex'
    }

    const markAsCompletedBtn = document.querySelectorAll('.task .icon')
    markAsCompletedBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentTaskList.splice(btn.id, 1)
        renderedTask()
      })
    })
  }

  renderedTask()

  const todoForm = document.querySelector('.addTask form')
  let taskInput = document.querySelector('.addTask form input')
  const taskDetailsInput = document.querySelector('.addTask form textarea')
  let inputCheckBox = document.querySelector('#checkbox')

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (taskInput.value === '') {
      alert("Oops! You forgot to add a task 😅");
      return false
    }

    currentTaskList.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: inputCheckBox.checked
    })
    renderedTask()
    taskInput.value = ''
    taskDetailsInput.value = ''
    inputCheckBox.checked = false
  })

}

todoList()

function dailyPlanner() {
  let dayPlanner = document.querySelector('.day-planner');
  let dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {};

  const hours = Array.from({ length: 18 }, (_, idx) =>
    `${6 + idx}:00 - ${7 + idx}:00`
  );

  let wholeDaySum = '';
  hours.forEach((time, idx) => {
    const savedData = dayPlanData[idx] || '';
    wholeDaySum += `
    <div class="flex flex-col bg-white border-2 border-black p-2 rounded">
      <p class="text-black text-lg font-semibold mb-2">${time}</p>
      <input 
        id="${idx}" 
        class="border-2 border-black text-black px-3 py-2 text-base md:text-lg rounded outline-none" 
        type="text" 
        placeholder="Write your plan..." 
        value="${savedData || ""}">
    </div>
  `;
  });

  dayPlanner.innerHTML = wholeDaySum;

  document.querySelectorAll('.day-planner input').forEach((input) => {
    input.addEventListener('input', () => {
      dayPlanData[input.id] = input.value;
      localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData));
    });
  });
}

dailyPlanner();


async function fetchQuote() {
  let reloadQuote = document.querySelector('.reload-quote');
  let quoteContent = document.querySelector('.motivation-quote');
  let quoteAuthor = document.querySelector('.motivation-author');

  if (reloadQuote) reloadQuote.addEventListener('click', fetchQuote);

  try {
    let fetchedData = await fetch('https://api.quotable.io/random');
    const data = await fetchedData.json();

    quoteContent.textContent = data.content;
    quoteAuthor.textContent = '- ' + data.author;
  } catch (error) {
    quoteContent.textContent = 'Could not fetch quote. Please try again.';
    quoteAuthor.textContent = '';
  }
}

fetchQuote();


function pomodoroTimer() {
  const startTimer = document.querySelector('.start-timer')
  const pauseTimer = document.querySelector('.pause-timer')
  const resetTimer = document.querySelector('.reset-timer')
  let session = document.querySelector('.session')

  let totalSeconds = 25 * 60
  const timer = document.querySelector('.pomo-time')
  let intervalId
  let isWorkSession = true

  function updateTimer() {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  function startTimerAction() {
    clearInterval(intervalId)

    intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--
        updateTimer()
      } else {
        isWorkSession = !isWorkSession
        clearInterval(intervalId)
        if (isWorkSession) {
          session.textContent = 'Work Session'
          totalSeconds = 25 * 60
        } else {
          session.textContent = 'Take Rest'
          totalSeconds = 5 * 60
        }
        updateTimer()
      }
    }, 1000)
  }

  function pauseTimerAction() {
    clearInterval(intervalId)
  }

  function resetTimerAction() {
    clearInterval(intervalId)
    totalSeconds = isWorkSession ? 25 * 60 : 5 * 60
    updateTimer()
  }

  startTimer.addEventListener('click', startTimerAction)
  pauseTimer.addEventListener('click', pauseTimerAction)
  resetTimer.addEventListener('click', resetTimerAction)

  updateTimer()
}

pomodoroTimer()


async function getWeatherData() {
  const apiKey = '5a2de221b5b0470fae2141216250908'
  const area = 'hyderabad'
  let data
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${area}`)
  data = await response.json()

  const headerH2 = document.querySelector('.header1 h2')
  const headerH1 = document.querySelector('.header1 h1')
  const headerH4 = document.querySelector('.header1 h4')
  const header2 = document.querySelector('.header2')

  function updateTimeDate() {
    const now = new Date()

    const time = now.toLocaleTimeString('en-IN', {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })

    const date = now.toLocaleDateString('en-IN', {
      dateStyle: 'medium'
    })

    headerH1.innerHTML = time
    headerH2.innerHTML = date
  }

  setInterval(updateTimeDate, 1000)
  updateTimeDate()


  headerH4.innerHTML = `${data.location.name} (${data.location.region})`
  header2.innerHTML = `
      <div class="flex-1">
        <h2 class="text-5xl  font-bold">${data.current.temp_c} °C</h2>
        <h3 class="text-2xl font-bold mb-3 md:mb-6">${data.current.condition.text}</h3>
      </div>
      <div class="flex-1 space-y-2">
        <h3 class="text-sm sm:text-xl">Precipitation: ${data.current.precip_mm} mm</h3>
        <h3 class="text-sm sm:text-xl">Humidity: ${data.current.humidity}%</h3>
        <h3 class="text-sm sm:text-xl">Wind: ${data.current.wind_kph} km/h</h3>
      </div>
          `
}

getWeatherData()

function dailyGoals() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const getText = document.querySelectorAll('.get-text')
  getText.forEach((elem, idx) => {
    const key = `goal-${days[idx]}`
    const saved = localStorage.getItem(key)
    if (saved) elem.value = saved

    elem.addEventListener('input', () => {
      localStorage.setItem(key, elem.value)
    })
  })

  const clearGoalsBtn = document.querySelectorAll('.clear-goals')
  clearGoalsBtn.forEach((elem, idx) => {
    const key = `goal-${days[idx]}`
    elem.addEventListener('click', () => {
      localStorage.removeItem(`${key}`)
      getText[idx].value = ''
    })
  })
}

dailyGoals()























// getWeatherData()

// let x = document.documentElement
// let moon = document.querySelector('.moon')
// let sun = document.querySelector('.sun')

// moon.addEventListener('click',()=>{
//   x.style.setProperty('--pri', 'cyan')
// })

// sun.addEventListener('click',()=>{
//   x.style.removeProperty('--pri', 'cyan')
// })
