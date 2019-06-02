// console.log('test');
httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = getContents;
// httpRequest.open('GET', 'https://www.google.co.kr/search?source=hp&ei=h2jzXJbwOYXYhwOwn5WgDA&q=test&oq=test&gs_l=psy-ab.12..0l4j0i131l2j0l2j0i131j0.1204.1536..1657...0.0..0.104.490.2j3......0....1..gws-wiz.....0..35i39j0i20i263.HQ4KbYC-C8c');
httpRequest.open('GET', 'https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EB%82%A0%EC%94%A8&oquery=%EB%82%A0%EC%94%A8&tqi=UnLNVwp0YidssmREnbNssssssmC-456315');
httpRequest.send();

function getElement(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    console.log(div);
    return div;
}

function parseHTML(html) {
    console.log(html);
    var el = getElement(html);

    // 주소
    var juso = el.querySelector('.btn_select').innerHTML;
    document.querySelector('#juso').innerHTML = juso;


    // 날씨
    var degree = el.querySelector('.todaytemp').innerHTML;
    var weather = el.querySelector('.cast_txt').innerHTML;
    document.querySelector('#weather').innerHTML = degree +'도, '+weather;

    // 미세먼지
    var finedust = el.querySelectorAll('dd>.num')[0].innerHTML;
    document.querySelector('#finedust').innerHTML = finedust +' '+ dustGrade(finedust.substr(0,finedust.length-3), 'normal');

    // 초미세먼지
    var chofinedust = el.querySelectorAll('dd>.num')[1].innerHTML;
    document.querySelector('#chofinedust').innerHTML = chofinedust +' '+ dustGrade(chofinedust.substr(0,chofinedust.length-3),'cho');

}

function dustGrade(num, gubun){
    var str;
    var normalGrade = [30, 50, 100];
    var choGrade = [15, 25, 50];
    var gijun;
    if (gubun == 'normal') gijun = normalGrade;
    else gijun = choGrade;
    if(num<=gijun[0]) str = '좋음';
    else if(num<=gijun[1]) str = '보통';
    else if(num<=gijun[2]) str = '나쁨';
    else str = '매우나쁨';
    return str;
}

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