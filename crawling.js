// console.log('test');
httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = getContents;

httpRequest.open('GET', 'https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EB%82%A0%EC%94%A8&oquery=%EB%82%A0%EC%94%A8&tqi=UnLNVwp0YidssmREnbNssssssmC-456315');
httpRequest.send();

let elJuso = document.querySelector('#juso');
let elWeather = document.querySelector('#weather');
let elFindeust = document.querySelector('#finedust');
let elUltrafinedust = document.querySelector('#ultrafinedust');
let elFine = document.querySelector('#fine');
let elUltra = document.querySelector('#ultra');





function getContents() {
    console.log('readyState : '+httpRequest.readyState);
    console.log('status : '+httpRequest.status);
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            console.log('success');
            parseHTML(httpRequest.responseText);
        } else {
            console.log('fail');
            document.querySelector('.box').innerHTML = '온도 읽기 실패';
        }
    }
}

function parseHTML(html) {
    var el = getElement(html);

    // 주소
    var juso = el.querySelector('.btn_select').textContent;
    elJuso.textContent = juso;


    // 날씨
    var degree = el.querySelector('.todaytemp').textContent;
    var weather = el.querySelector('.cast_txt').textContent;
    elWeather.textContent = degree +'도, '+weather;

    // 미세먼지
    var finedust = el.querySelectorAll('dd>.num')[0].textContent;
    var finedustGrade = dustGrade(finedust.substr(0,finedust.length-3), 'normal');
    elFindeust.textContent = finedust +' '+ finedustGrade;
    setColorAndIcon(finedustGrade, elFindeust);

    // 초미세먼지
    var chofinedust = el.querySelectorAll('dd>.num')[1].textContent;
    var ultraFinedustGrade = dustGrade(chofinedust.substr(0,chofinedust.length-3),'ultra')
    elUltrafinedust.textContent = chofinedust +' '+ ultraFinedustGrade;
    setColorAndIcon(ultraFinedustGrade, elUltrafinedust);
}

function getElement(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div;
}



function dustGrade(num, kind){
    var str;
    // 한국 기준 미세먼지 : 0~30 좋음, 31~80 보통, 81~150 나쁨, 151~ 매우나쁨 
    // 한국 기준 초미세먼지 : 0~15 좋음, 16~35 보통, 36~75 나쁨, 76~ 매우나쁨 
    // WHO 기준으로 함
    // WHO 기준 미세먼지 : 0~30 좋음, 31~50 보통, 51~100 나쁨, 101~ 매우나쁨 
    // WHO 기준 초미세먼지 : 0~15 좋음, 16~25 보통, 26~50 나쁨, 51~ 매우나쁨 
    var normalGrade = [30, 50, 100];
    var ultraGrade = [15, 25, 50];
    var dustValue;
    if (kind == 'normal') dustValue = normalGrade;
    else dustValue = ultraGrade;
    
    if(num<=dustValue[0]) str = '좋음';
    else if(num<=dustValue[1]) str = '보통';
    else if(num<=dustValue[2]) str = '나쁨';
    else str = '매우나쁨';
    return str;
}

function setColorAndIcon(grade, element){
    let pathAndIcon = getPathAndColor(grade);
    let path = pathAndIcon[0];
    let color = pathAndIcon[1];
    setIcon(path, element);
    setColor(color, element);
}

function getPathAndColor(grade){
    let path = '';
    let color = '';
    switch (grade){
        case "좋음":
            path = './status_good.png';
            color = '#32a1ff';
            break;
        
        case "보통":
            path = './status_normal.png';
            color = '#00c73c';
            break;
        
        case "나쁨":
            path = './status_bad.png';
            color = '#fd9b5a';
            break;

        case "매우나쁨":
            path = './status_verybad.png';
            color = '#ff5959';
            break;
        default:
    }
    return [path, color]
}

function setColor(color, element){
    element.style.color = color;
}

function setIcon(path, element){
    let finedustIcon = document.createElement('img')
    finedustIcon.src = path;
    finedustIcon.width= 15;
    finedustIcon.style.verticalAlign='text-bottom';
    element.appendChild(finedustIcon);
}
