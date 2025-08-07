const cards = {
  test_ready: testReadyComp(),
  test_wait: document.getElementById('test-wait'),
  test_wait_click: document.getElementById('test-wait-click'),
  test_clicked: document.getElementById('test-clicked'),
  test_record: document.getElementById('test-record')
}

const main = document.getElementById('main');
const top_text = document.getElementById('top-text');
const top_pbar = document.getElementById('top-pbar');

const resetProgress = () => {
  top_text.innerText = '';
  top_text.style.border = 'none';
  top_pbar.style.width = '0';
};

replaceCard(cards.test_wait);
replaceCard(cards.test_wait_click);
replaceCard(cards.test_clicked);
replaceCard(cards.test_record);
replaceCard(cards.test_ready);

let measureResults = [];

const getRecords = () => {
  const records = {
    max: -1,
    min: -1,
    avg: -1
  };
  
  let sum = 0;
  for (r of measureResults) {
    records.max = records.max === -1 ? r : records.max > r ? records.max : r;
    records.min = records.min === -1 ? r : records.min < r ? records.min : r;
    sum += r;
  }
  records.avg = sum / 5;

  return records;
};

// start-button이 생기기 전에 부르는 것을 주의해야한다
const startBtn = document.getElementById('start-button');

const startWaitHandler = (e) => {
  replaceCard(cards.test_wait);
  main.classList.remove('measure-end');
  main.classList.add('waiting');
  top_text.innerText = `${measureResults.length} / 5`;
  top_text.style.border = '1px solid black';
  waitClick();
}

const tryAgainHandler = (e) => {
  replaceCard(cards.test_ready);
  main.classList.remove('finish');
  resetProgress();
  measureResults = [];
  startBtn.addEventListener('click', startWaitHandler);
}

startBtn.addEventListener('click', startWaitHandler);

let measure_start_time;
let measure_end_time;

let measure_id;
let tooFastClickHandler;

function waitClick() {
  main.removeEventListener('click', startWaitHandler);

  measure_id = window.setTimeout(() => {
    measureStart();
  }, parseInt(Math.random() * 4501 + 500));

  
  tooFastClickHandler = (e) => {
    window.clearTimeout(measure_id);
    main.removeEventListener('click', tooFastClickHandler); // 빨리 클릭 이벤트 제거
    alert('Fali Avada Kedavra!'); // 경고창
    main.classList.remove('waiting');
    measureResults = []; // 기록 날리기
    resetProgress();
    replaceCard(cards.test_ready);
  };
  
  window.setTimeout(() => {
    main.addEventListener('click', tooFastClickHandler);
  }, 10);
}

// 측정이 시작될 때 메인에 잠시 이벤트 붙이기
const measureStartHandler = (e) => {
  measureEnd();
}

function measureStart() {
  // 시간 측정 시작
  measure_start_time = new Date().getTime();
  main.classList.remove('waiting');
  replaceCard(cards.test_wait_click);
  main.removeEventListener('click', tooFastClickHandler);
  main.addEventListener('click', measureEnd);
}

function measureEnd() {
  // 시간 측정 완료
  measure_end_time = new Date().getTime();
  const result = (measure_end_time - measure_start_time);
  measureResults.push(result);
  top_text.innerText = `${measureResults.length} / 5`;
  top_pbar.style.width = `${measureResults.length * 20}%`;
  
  if (measureResults.length < 5) {
    const to_show = cards.test_clicked;
    to_show.querySelector('.millisec').innerText = `${result} ms`;
    main.classList.add('measure-end');
  
    replaceCard(to_show);
  
    main.removeEventListener('click', measureEnd);
    main.addEventListener('click', startWaitHandler);
  } else {
    const to_show = cards.test_record;
    const records = getRecords();

    to_show.querySelector('.avg-time > .millisec').innerText = `${records.avg} ms`;
    to_show.querySelector('.best-time > .millisec').innerText = `${records.min} ms`;
    to_show.querySelector('.worst-time > .millisec').innerText = `${records.max} ms`;

    to_show.querySelector('.try-again-button').addEventListener('click', tryAgainHandler);
    
    main.classList.add('finish');
    replaceCard(to_show);
    main.removeEventListener('click', measureEnd);
    main.removeEventListener('click', tryAgainHandler);
  }
}

function replaceCard(card) {
  // firstChild는 첫 번째 노드를 가져온다 (텍스트 노드도 포함)
  // firstElementChild는 첫 번째 요소를 가져온다
  const currCard = main.firstElementChild;
  main.replaceChild(card, currCard);
}

function testReadyComp() {
  const wrapper = document.createElement('div');
  wrapper.id = 'test-ready';

  const icon = document.createElement('div');
  icon.classList.add('main-icon');
  wrapper.appendChild(icon);

  const title = document.createElement('div');
  const titleText = document.createTextNode('React Time Test');
  title.classList.add('title');
  title.appendChild(titleText);
  wrapper.appendChild(title);

  const button = document.createElement('div');
  const buttonText = document.createTextNode('Start');
  button.id = 'start-button';
  button.classList.add('test-start-button');
  button.appendChild(buttonText);
  wrapper.appendChild(button);

  return wrapper;
}