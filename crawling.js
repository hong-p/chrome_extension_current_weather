
// window load 후 실행
window.onload = function (){
    // 셋팅할 El들 미리 가져온다.
    let elJuso = document.querySelector('#juso');
    let elWeather = document.querySelector('#weather');
    let elFindeust = document.querySelector('#finedust');
    let elUltrafinedust = document.querySelector('#ultrafinedust');

    // xmlhttp 요청정보 셋팅
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = getContents;
    httpRequest.open('GET', 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=날씨');
    httpRequest.send();
    
    // xmlhttp 결과
    function getContents() {
        console.log('readyState : '+httpRequest.readyState);
        console.log('status : '+httpRequest.status);
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                console.log('success');
                // 정상적으로 결과를 받으면 메인로직 실행
                mainJob(httpRequest.responseText);
                
            } else {
                console.log('fail');
                document.querySelector('.box').innerHTML = '온도 읽기 실패';
            }
        }
    }
    
    function mainJob(html) {
        // parsing result to DOMElement
        let el = parseHTML(html);
        // get info
        let info = getInfo(el);
        // set info
        setInfo(info);
    }
    
    // 요청으로 받은 결과를 DOMParser를 통해 Element로 parsing한다.  
    function parseHTML(html) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html')
        let body = doc.querySelector('body')
        return body;
    }
    

    // parsing한 결과에서 필요한 정보를 추출한다.
    function getInfo(el){
        let info = new Object();
        // 주소
        info.juso = el.querySelector('.btn_select').firstElementChild.textContent;        
        // 날씨
        info.degree = el.querySelector('.todaytemp').textContent;
        info.weather = el.querySelector('.cast_txt').textContent;
        // 미세먼지
        info.finedust = el.querySelectorAll('dd>.num')[0].textContent;
        info.finedustGrade = dustGrade(info.finedust.substr(0,info.finedust.length-3), 'normal');
        // 초미세먼지
        info.chofinedust = el.querySelectorAll('dd>.num')[1].textContent;
        info.ultraFinedustGrade = dustGrade(info.chofinedust.substr(0,info.chofinedust.length-3),'ultra')

        return info;
    }

    // 결과에서 추출한 정보를 유저에게 보여주기 위한 화면에 셋팅한다.
    function setInfo(info){
        // 주소
        elJuso.textContent = info.juso;
        //날씨
        elWeather.textContent = info.degree +'˚C , '+info.weather;
        // 미세먼지
        elFindeust.textContent = info.finedust +' '+ info.finedustGrade;
        setColorAndIcon(info.finedustGrade, elFindeust);
        // 초미세먼지
        elUltrafinedust.textContent = info.chofinedust +' '+ info.ultraFinedustGrade;
        setColorAndIcon(info.ultraFinedustGrade, elUltrafinedust);
    }
    
    // 미세먼지, 초미세먼지 수치에 따라 4단계로 구분한다.
    function dustGrade(num, kind){
        let str;
        // 한국 기준 미세먼지 : 0~30 좋음, 31~80 보통, 81~150 나쁨, 151~ 매우나쁨 
        // 한국 기준 초미세먼지 : 0~15 좋음, 16~35 보통, 36~75 나쁨, 76~ 매우나쁨 
        // WHO 기준으로 함
        // WHO 기준 미세먼지 : 0~30 좋음, 31~50 보통, 51~100 나쁨, 101~ 매우나쁨 
        // WHO 기준 초미세먼지 : 0~15 좋음, 16~25 보통, 26~50 나쁨, 51~ 매우나쁨 
        let normalGrade = [30, 50, 100];
        let ultraGrade = [15, 25, 50];
        let dustValue;
        if (kind == 'normal') dustValue = normalGrade;
        else dustValue = ultraGrade;
        
        if(num<=dustValue[0]) str = '좋음';
        else if(num<=dustValue[1]) str = '보통';
        else if(num<=dustValue[2]) str = '나쁨';
        else str = '매우나쁨';
        return str;
    }
    
    // 단계별로 글자색과 아이콘 셋팅
    function setColorAndIcon(grade, element){
        let pathAndIcon = getPathAndColor(grade);
        let path = pathAndIcon[0];
        let color = pathAndIcon[1];
        setIcon(path, element);
        setColor(color, element);
    }
    
    // 단계별 아이콘파일 경로와 색깔을 리턴
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
    
    // 각 El에 색깔 셋팅
    function setColor(color, element){
        element.style.color = color;
    }
    
    // 각 El에 아이콘 셋팅
    function setIcon(path, element){
        let finedustIcon = document.createElement('img')
        finedustIcon.src = path;
        finedustIcon.width= 15;
        finedustIcon.style.verticalAlign='text-bottom';
        element.appendChild(finedustIcon);
    }
}






