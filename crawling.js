// console.log('test');
httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = getContents;
httpRequest.open('GET', 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%ED%98%84%EC%9E%AC+%EC%9C%84%EC%B9%98+%EB%82%A0%EC%94%A8');
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

    // 도/시
    var dosi = el.querySelector('._depth0 > .dep1 > a').innerHTML;
    document.querySelector('#dosi').innerHTML = dosi;

    // 구/군
    var gu = el.querySelector('._depth1 > .dep2 > a').innerHTML;
    document.querySelector('#gu').innerHTML = gu;

    // 동/면
    var dong = el.querySelector('._depth2 > .dep3 > a').innerHTML;
    document.querySelector('#dong').innerHTML = dong;

    // 날씨
    var weather = el.querySelector('.w_now2 > ul > li > .fl > em').innerHTML;
    document.querySelector('#weather').innerHTML = weather;
}

function getContents() {
    console.log(httpRequest.readyState);
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