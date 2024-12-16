document.addEventListener("DOMContentLoaded", () => {

    // Scroll Event for Header
    setupScrollEffect();

    // Setup existing artists
    setupInitialArtists();

    setupInitialTickets(); // 기존 티켓 이미지 업로드 이벤트 초기화

    // Add Artist Button Event (360x416 Main Lineup)
    const addArtistButton = document.getElementById('add-artist-button');
    if (addArtistButton) {
        addArtistButton.addEventListener('click', addArtist360x416);
    }

    // Add Artist Button Event (216x250 Complete Lineup)
    const addCompleteArtistButton = document.getElementById('add-artist-button-complete');
    if (addCompleteArtistButton) {
        addCompleteArtistButton.addEventListener('click', () =>
            addArtistGeneric('the-complete-lineup-artists', 216, 250)
        );
    }

    // Add Time Table Block Button Event
    const addTimeTableButton = document.getElementById('add-time-table-button');
    if (addTimeTableButton) {
        addTimeTableButton.addEventListener('click', addTimeTableBlock);
    }

    // Add Ticket Block Button Event
    const addTicketButton = document.getElementById('add-ticket-button');
    if (addTicketButton) {
        addTicketButton.addEventListener('click', addTicketBlock);
    }
});

// Load External Components (Header/Footer)
function loadComponent(url, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}`);
                }
                return response.text();
            })
            .then(data => {
                container.innerHTML = data;
            })
            .catch(error => {
                console.error(`Error loading ${url}:`, error);
            });
    } else {
        console.warn(`Container with ID '${containerId}' not found.`);
    }
}

// Scroll Effect for Header
function setupScrollEffect() {
    const headerBar = document.querySelector('.site-header .header-bar');
    if (!headerBar) {
        console.error('Header bar element not found.');
        return;
    }

    window.addEventListener('scroll', () => {
        headerBar.classList.toggle('scrolled', window.scrollY > 0);
    });
}

// Setup Image Upload with Size Adjustment
function setupImageUpload(imageElement, uploadInput, resizeWidth, resizeHeight) {
    if (!imageElement || !uploadInput) return;

    // 기존 클릭 이벤트 제거 후 재등록
    if (imageElement._uploadClickHandler) {
        imageElement.removeEventListener('click', imageElement._uploadClickHandler);
    }

    const clickHandler = () => uploadInput.click();
    imageElement._uploadClickHandler = clickHandler;
    imageElement.addEventListener('click', clickHandler);

    // 업로드 이벤트도 중복되지 않도록 설정
    if (uploadInput._changeHandler) {
        uploadInput.removeEventListener('change', uploadInput._changeHandler);
    }

    const changeHandler = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = resizeWidth;
                    canvas.height = resizeHeight;
                    ctx.drawImage(img, 0, 0, resizeWidth, resizeHeight);
                    imageElement.src = canvas.toDataURL('image/png');
                };
            };
            reader.readAsDataURL(file);
        }
    };

    uploadInput._changeHandler = changeHandler;
    uploadInput.addEventListener('change', changeHandler);
}

// Initialize Existing Artists
function setupInitialArtists() {
    // Lineup Artists (360x416)
    setupArtistsBySize('.lineup-artists-wrap', 360, 416);

    // Complete Lineup Artists (216x250)
    setupArtistsBySize('.the-complete-lineup-artists .editable-image', 216, 250);
}

// Generic function for artist initialization by size
function setupArtistsBySize(selector, resizeWidth, resizeHeight) {
    document.querySelectorAll(selector).forEach((wrap) => {
        const image = wrap.querySelector('img');
        const input = wrap.querySelector('input[type="file"]');
        setupImageUpload(image, input, resizeWidth, resizeHeight);
    });
}

// Add New Artist for 360x416
function addArtist360x416() {
    const totalArtists = document.querySelectorAll('.lineup-artists-wrap').length + 1;
    const artistId = totalArtists;

    const newArtistWrap = document.createElement('div');
    newArtistWrap.classList.add('lineup-artists-wrap', 'flex', 'flex-wrap');
    newArtistWrap.setAttribute('id', `artist-${artistId}`);

    if (artistId % 2 === 1) {
        // 홀수: 왼쪽 이미지, 오른쪽 설명
        newArtistWrap.innerHTML = `
            <figure class="featured-image editable-image">
                <a><img id="artist-image-${artistId}" src="images/360x416.png" alt="New Artist Image"></a>
                <input type="file" id="artist-image-upload-${artistId}" class="hidden-input" accept="image/*">
            </figure>
            <div class="lineup-artists-description">
                <div class="lineup-artists-description-container">
                    <div class="entry-title" contenteditable="true">아티스트 이름을 입력해주세요.</div>
                    <div class="entry-content" contenteditable="true">
                        <p>아티스트에 대한 설명을 입력해주세요.</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        // 짝수: 새로운 HTML 형식 적용
        newArtistWrap.innerHTML = `
            <div class="lineup-artists-description">
                <figure class="featured-image d-md-none">
                    <a><img id="artist-image-${artistId}-small" src="images/360x416.png" alt="New Artist Image"></a>
                    <input type="file" id="artist-image-upload-${artistId}-small" class="hidden-input" accept="image/*">
                </figure>

                <div class="lineup-artists-description-container">
                    <div class="entry-title" contenteditable="true">아티스트 이름을 입력해주세요.</div>
                    <div class="entry-content" contenteditable="true">
                        <p>아티스트에 대한 설명을 입력해주세요.</p>
                    </div>
                </div>
            </div>
            <figure class="featured-image d-none d-md-block">
                <a><img id="artist-image-${artistId}" src="images/360x416.png" alt="New Artist Image"></a>
                <input type="file" id="artist-image-upload-${artistId}" class="hidden-input" accept="image/*">
            </figure>
        `;
    }

    document.querySelector('.lineup-artists').appendChild(newArtistWrap);

    // 이미지 업로드 이벤트 추가
    if (artistId % 2 === 1) {
        const newImageElement = newArtistWrap.querySelector(`#artist-image-${artistId}`);
        const newFileInput = newArtistWrap.querySelector(`#artist-image-upload-${artistId}`);
        setupImageUpload(newImageElement, newFileInput, 360, 416);
    } else {
        const newSmallImageElement = newArtistWrap.querySelector(`#artist-image-${artistId}-small`);
        const newSmallFileInput = newArtistWrap.querySelector(`#artist-image-upload-${artistId}-small`);
        setupImageUpload(newSmallImageElement, newSmallFileInput, 360, 416);

        const newImageElement = newArtistWrap.querySelector(`#artist-image-${artistId}`);
        const newFileInput = newArtistWrap.querySelector(`#artist-image-upload-${artistId}`);
        setupImageUpload(newImageElement, newFileInput, 360, 416);
    }

    // Add Button 이동
    const addButton = document.getElementById('add-artist-button');
    if (addButton) {
        addButton.parentElement.appendChild(addButton);
    }
}

// Generic Add New Artist for other sizes
function addArtistGeneric(sectionClass, resizeWidth, resizeHeight) {
    const artistContainer = document.querySelector(`.${sectionClass}`);
    const totalArtists = artistContainer.querySelectorAll('.artist-single').length + 1;

    const newArtistBlock = document.createElement('div');
    newArtistBlock.classList.add('col-6', 'col-md-4', 'col-lg-3', 'artist-single');

    newArtistBlock.innerHTML = `
        <figure class="featured-image editable-image">
            <a>
                <img id="artist-image-${totalArtists}" src="images/${resizeWidth}x${resizeHeight}.png" alt="New Artist Image">
            </a>
            <input type="file" id="artist-image-upload-${totalArtists}" class="hidden-input" accept="image/*">
        </figure>
        <h2 contenteditable="true">아티스트 이름</h2>
    `;

    // 블록 추가
    artistContainer.appendChild(newArtistBlock);

    // 이미지 업로드 이벤트 추가
    const newImageElement = newArtistBlock.querySelector(`#artist-image-${totalArtists}`);
    const newFileInput = newArtistBlock.querySelector(`#artist-image-upload-${totalArtists}`);
    setupImageUpload(newImageElement, newFileInput, resizeWidth, resizeHeight);
}

// Add Time Table Block
function addTimeTableBlock() {
    const timeTableContainer = document.querySelector('.time-table-container');
    const totalBlocks = timeTableContainer.querySelectorAll('.time-table-block').length + 1;

    const newBlock = document.createElement('div');
    newBlock.classList.add('time-table-block', 'text-center', 'mb-4');

    newBlock.innerHTML = `
        <figure class="editable-image">
            <img id="time-table-image-${totalBlocks}" src="images/930x1000.png" alt="Time Table Image ${totalBlocks}" style="max-width: 100%; height: auto;">
            <input type="file" id="time-table-upload-${totalBlocks}" class="hidden-input" accept="image/*" style="display: none;">
        </figure>
    `;

    timeTableContainer.appendChild(newBlock);

    const newImageElement = newBlock.querySelector(`#time-table-image-${totalBlocks}`);
    const newUploadInput = newBlock.querySelector(`#time-table-upload-${totalBlocks}`);
    setupImageUpload(newImageElement, newUploadInput, 930, 1000);
}

// Add Ticket Block
// Add Ticket Block Function
function addTicketBlock() {
    const ticketContainer = document.querySelector('.ticket-container');
    const totalTickets = ticketContainer.querySelectorAll('.ticket-single').length + 1;

    // Create a new ticket block
    const newTicket = document.createElement('div');
    newTicket.classList.add('col-12', 'col-md-6', 'ticket-single');

    // Define the HTML for the new ticket block
    newTicket.innerHTML = `
        <figure class="featured-image editable-image">
            <img id="ticket-image-${totalTickets}" src="images/456x271.png" alt="ticket">
            <input type="file" id="ticket-image-upload-${totalTickets}" class="hidden-input" accept="image/*">
        </figure>
        <div class="box-link-date">
            <a>2024.12.25.</a>
        </div>
        <div class="link-input-container mt-2">
            <input type="text" id="ticket-link-input-${totalTickets}" class="form-control" placeholder="하이퍼링크 입력" />
            <button class="btn btn-primary mt-1" onclick="updateTicketNameLink(${totalTickets})">하이퍼링크 입력</button>
        </div>
        <div class="content-wrapper">
            <div class="entry-content">
                <div class="entry-header">
                    <h2>
                        <a id="ticket-name-link-${totalTickets}" href="#" target="_blank" contenteditable="true">티켓 이름 입력</a>
                    </h2>
                </div>
            </div>
        </div>
    `;

    // Append the new ticket block to the container
    ticketContainer.appendChild(newTicket);

    // Set up image upload for the new ticket
    const newImageElement = newTicket.querySelector(`#ticket-image-${totalTickets}`);
    const newUploadInput = newTicket.querySelector(`#ticket-image-upload-${totalTickets}`);
    setupImageUpload(newImageElement, newUploadInput, 456, 271);
}

// FAQ 추가 버튼 이벤트 설정
document.addEventListener("DOMContentLoaded", () => {
    const addFaqButton = document.getElementById("add-faq-button");
    if (addFaqButton) {
        addFaqButton.addEventListener("click", addFaqItem);
    }
});

// FAQ 추가 기능
function addFaqItem() {
    const faqContainer = document.querySelector("#faqAccordion");
    if (!faqContainer) return;

    const totalFaqItems = faqContainer.querySelectorAll(".accordion-item").length + 1;
    const newFaqItem = document.createElement("div");
    newFaqItem.classList.add("accordion-item");

    newFaqItem.innerHTML = `
        <h2 class="accordion-header" id="faqHeading${totalFaqItems}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#faqCollapse${totalFaqItems}" aria-expanded="false" aria-controls="faqCollapse${totalFaqItems}">
                <span contenteditable="true">새 질문을 입력해주세요.</span>
            </button>
        </h2>
        <div id="faqCollapse${totalFaqItems}" class="accordion-collapse collapse" aria-labelledby="faqHeading${totalFaqItems}" data-bs-parent="#faqAccordion">
            <div class="accordion-body" contenteditable="true">
                새 질문에 대한 답변을 입력해주세요.
            </div>
        </div>
    `;

    faqContainer.appendChild(newFaqItem);
}
document.addEventListener("DOMContentLoaded", () => {
    const changeCoverButton = document.getElementById("change-cover-button");
    const coverImageUpload = document.getElementById("cover-image-upload");

    // 버튼 클릭 시 파일 선택창 열기
    changeCoverButton.addEventListener("click", () => {
        coverImageUpload.click();
    });

    // 파일 업로드 처리
    coverImageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    // Canvas를 생성하고 크기 설정
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = 1920;
                    canvas.height = 1093;

                    // Canvas에 이미지 그리기 (리사이징)
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Canvas 데이터를 URL로 변환
                    const resizedImage = canvas.toDataURL("image/jpeg", 0.9); // 0.9는 품질 설정

                    // Hero Content 배경 이미지 변경
                    const heroContent = document.querySelector(".hero-content");
                    heroContent.style.backgroundImage = `url(${resizedImage})`;
                };
            };
            reader.readAsDataURL(file);
        }
    });
});
let fileCounter = 1; // 파일 카운터 초기화

// HTML 파일 다운로드 함수
function downloadHtmlFile() {
    // 로그인 상태 확인
    if (!isUserLoggedIn()) {
        alert("로그인이 필요한 기능입니다.");
        return;
    }

    const user = getLoggedInUser();
    console.log("다운로드 요청 사용자:", user);

    disableEditing(); // 수정 기능 비활성화
    removeButtonsExceptAccordion(); // 아코디언 버튼 제외하고 모든 버튼 제거

    // 하이퍼링크 입력 컨테이너 삭제
    const linkInputContainers = document.querySelectorAll(".link-input-container");
    linkInputContainers.forEach((container) => {
        container.remove(); // DOM에서 삭제
    });

    const fileName = `demo-${fileCounter}.html`; // 순차적으로 파일 이름 설정
    const htmlContent = document.documentElement.outerHTML; // 전체 HTML 문서 내용 가져오기

    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    fileCounter++; // 다음 파일 이름으로 업데이트
}


// 사용자 로그인 상태 확인 함수
function isUserLoggedIn() {
    // 세션에서 로그인 정보를 확인
    const loggedInUser = localStorage.getItem("loggedInUser");
    return loggedInUser !== null; // 로그인 정보가 존재하면 true 반환
}

// 로그인된 사용자 정보 가져오기
function getLoggedInUser() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    return loggedInUser ? JSON.parse(loggedInUser) : null; // JSON 파싱 후 반환
}



// 수정 기능 비활성화
function disableEditing() {
    const editableElements = document.querySelectorAll("[contenteditable='true']");
    editableElements.forEach((el) => {
        el.removeAttribute("contenteditable"); // contenteditable 속성 제거
    });

    const hiddenInputs = document.querySelectorAll(".hidden-input");
    hiddenInputs.forEach((input) => {
        input.remove(); // 파일 입력 요소 제거
    });
}

// 아코디언 버튼 제외하고 모든 버튼 제거
function removeButtonsExceptAccordion() {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        if (!button.closest(".accordion-header")) {
            button.remove(); // 아코디언 관련 버튼이 아닌 경우 제거
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const changeFooterImageButton = document.getElementById("change-footer-image-button");
    const footerImageUpload = document.getElementById("footer-image-upload");

    // 버튼 클릭 시 파일 선택창 열기
    changeFooterImageButton.addEventListener("click", () => {
        footerImageUpload.click();
    });

    // 파일 업로드 처리
    footerImageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = 1920; // 리사이징 너비
                    canvas.height = 542; // 리사이징 높이
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // 리사이징된 이미지 URL 가져오기
                    const resizedImageUrl = canvas.toDataURL("image/jpeg");

                    // 푸터 배경 이미지 변경
                    const footer = document.querySelector(".site-footer");
                    footer.style.backgroundImage = `url(${resizedImageUrl})`;
                };
            };
            reader.readAsDataURL(file);
        }
    });
});


function updateTicketNameLink(ticketId) {
    const linkInput = document.getElementById(`ticket-link-input-${ticketId}`);
    const ticketNameLink = document.getElementById(`ticket-name-link-${ticketId}`);
    
    if (linkInput && ticketNameLink) {
        const newLink = linkInput.value.trim();
        if (newLink) {
            // 설정된 링크를 업데이트
            ticketNameLink.href = newLink;
            alert(`Link updated for Ticket ${ticketId}: ${newLink}`);
        } else {
            // 링크를 제거
            ticketNameLink.href = "#";
            alert("No valid link entered. Hyperlink removed.");
        }
    } else {
        console.error(`Elements for ticket ${ticketId} not found.`);
    }
}
function setupInitialTickets() {
    document.querySelectorAll('.ticket-single').forEach((ticket) => {
        const image = ticket.querySelector('img');
        const input = ticket.querySelector('input[type="file"]');
        if (image && input) {
            setupImageUpload(image, input, 456, 271); // 티켓 이미지는 456x271로 리사이즈
        }
    });
}

// DOMContentLoaded에서 setupInitialTickets 호출
document.addEventListener("DOMContentLoaded", () => {
    setupScrollEffect();
    setupInitialArtists();
    setupInitialTickets(); // 기존 티켓 이미지 초기화
});
document.addEventListener("DOMContentLoaded", () => {
    const SESSION_KEY = "loggedInUser";

    // 로그인 상태 확인
    const isUserLoggedIn = () => localStorage.getItem(SESSION_KEY) !== null;

    // 현재 로그인된 사용자 정보 가져오기
    const getLoggedInUser = () => JSON.parse(localStorage.getItem(SESSION_KEY));

    // 세션 정보 표시
    const updatePageWithSessionInfo = () => {
        if (isUserLoggedIn()) {
            const user = getLoggedInUser();
            document.getElementById("welcomeMessage").textContent = `안녕하세요, ${user.name}님!`;
        } else {
            document.getElementById("welcomeMessage").textContent = "로그인 정보가 없습니다.";
        }
    };

    updatePageWithSessionInfo();
});