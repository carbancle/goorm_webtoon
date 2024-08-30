const loadWebtoonData = async () => {
    const response = await axios.get('./data.json');
    const data = response.data;

    localStorage.setItem('webtoonData', JSON.stringify(data));
}

// 랜덤으로 웹툰을 선택하는 함수
const getRandomWebtoons = (webtoons, count = 3) => {
    const randomWebtoons = [];
    while (randomWebtoons.length < count) {
        const randomIndex = Math.floor(Math.random() * webtoons.length);
        const selected = webtoons[randomIndex];

        // 중복되지 않도록 추가
        if (!randomWebtoons.includes(selected)) {
            randomWebtoons.push(selected);
        }
    }
    return randomWebtoons;
};

// 웹툰을 렌더링하는 함수
const renderWebtoons = (webtoons, container) => {
    container.innerHTML = ''; // 기존 콘텐츠 초기화
    webtoons.forEach((item) => {
        const webtoon = document.createElement('div');
        webtoon.className = 'col-4';
        webtoon.innerHTML = `
            <div class="card webtoon-box">
                <a href="https://comic.naver.com/${item.link}" class="new-webtoon-link">
                    <div class="card-img" style="background:${item.bg}">
                        ${item.img1 ? `<img src="${item.img1}" class="card-img-top" alt="${item.title}">` : ""}
                        ${item.img2 ? `<img src="${item.img2}" class="card-img-top" alt="${item.title}">` : ""}
                        ${item.img3 ? `<img src="${item.img3}" class="card-img-top" alt="${item.title}">` : ""}
                    </div>
                </a>
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="https://comic.naver.com/${item.link}" class="new-webtoon-link">
                            ${truncateString(item.title, 25)}</h5>
                        </a>
                    <h6 class="card-subtitle mb-2 text-body-secondary">
                        <a href="https://comic.naver.com/webtoon" class="new-webtoon-link">
                            ${item.author}
                        </a>
                    </h6>
                    <p class="card-text">${truncateString(item.description, 50)}</p>
                </div>
            </div>
        `;
        container.appendChild(webtoon);
    });
};

// 실제 사용되는 함수
const renderNewWebtoon = async () => {
    const newWebtoon = document.querySelector(".new-webtoon .row");
    const data = JSON.parse(localStorage.getItem('webtoonData'));
    const randomWebtoons = getRandomWebtoons(data.NewWebtoon);
    renderWebtoons(randomWebtoons, newWebtoon);
};

// 오늘 요일
const week = ['일','월','화','수', '목', '금', '토'];
const dayOfWeek = week[new Date().getDay()];

const renderDayWebtoon = async () => {
    const dayWebtoon = document.querySelector('.day-webtoon .row');
    const data = JSON.parse(localStorage.getItem('webtoonData'));

    console.log(Object.keys(data.DayWebtoon));

    Object.keys(data.DayWebtoon).forEach((day) => { 
        let html = '';
        const webtoon = document.createElement('div');
        webtoon.className = 'col';
        html += `<div class="col">
                    <div class="d-flex flex-column day-box ${dayOfWeek == day ? 'today' : ''}">
                        <div class="title ${dayOfWeek == day ? 'today' : ''}">${day}요웹툰</div>
                `;

        // 요일별 웹툰 정보 가져오기
        data.DayWebtoon[day].forEach((item) => {
            const NWebtoonURL = "https://comic.naver.com";
            html +=  `
                        <div class="card">
                            <div class="poster-img">
                                <a href="${NWebtoonURL + item.details}">
                                    <img src="${item.img}" class="card-img-top" alt="${item.title}">
                                </a>
                            </div>
                            <div class="card-body">
                                <a href="${NWebtoonURL + item.details}">
                                    <h6 class="card-title">${truncateString(item.title, 10)}</h6>
                                </a>
                            </div>
                        </div>
            `;
        });
        
        html += `
                    </div>
                </div>
        `;

        webtoon.innerHTML = html;
        dayWebtoon.appendChild(webtoon);
    });

}

function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + '...';
    } else {
        return str;
    }
}

loadWebtoonData()
    .then(renderNewWebtoon)
    .then(renderDayWebtoon);