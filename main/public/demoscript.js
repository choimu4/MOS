document.addEventListener("DOMContentLoaded", () => {
    // Header와 Footer 로드
    loadComponent("header.html", "header-container");
    loadComponent("footer.html", "footer-container");

    // Scroll Event for Header
    setupScrollEffect();

    // Setup existing artists
    setupInitialArtists();

    // Setup editable main section image
    setupMainSectionImage();

    // Add Artist Button Event (360x416 Main Lineup)
    const addArtistButton = document.getElementById('add-artist-button');
    if (addArtistButton) {
        addArtistButton.addEventListener('click', addArtist360x416);
    }

    // Add Artist Button Event (216x250 Complete Lineup)
    const addCompleteArtistButton = document.getElementById('add-artist-button-complete');
    if (addCompleteArtistButton) {
        addCompleteArtistButton.addEventListener('click', () => addArtistGeneric('the-complete-lineup-artists', 216, 250));
    }

    // Add Time Table Block Button Event
    const addTimeTableButton = document.getElementById('add-time-table-button');
    if (addTimeTableButton) {
        addTimeTableButton.addEventListener('click', addTimeTableBlock);
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

// Setup editable image for main section
function setupMainSectionImage() {
    const mainImage = document.getElementById('editable-main-image');
    const uploadInput = document.getElementById('main-image-upload');

    setupImageUpload(mainImage, uploadInput, 930, 1000);
}

// Add New Time Table Block
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
        // 짝수: 모바일/데스크탑 이미지를 동시에 관리하는 HTML 구조
        newArtistWrap.innerHTML = `
            <div class="lineup-artists-description">
                <figure class="featured-image d-md-none">
                    <a><img id="artist-image-${artistId}-small" src="images/360x416.png" alt="New Artist Image"></a>
                    <input type="file" id="artist-image-upload-${artistId}" class="hidden-input" accept="image/*">
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
            </figure>
        `;
    }

    document.querySelector('.lineup-artists').appendChild(newArtistWrap);

    if (artistId % 2 === 1) {
        const newImageElement = newArtistWrap.querySelector(`#artist-image-${artistId}`);
        const newFileInput = newArtistWrap.querySelector(`#artist-image-upload-${artistId}`);
        setupImageUpload(newImageElement, newFileInput, 360, 416);
    } else {
        const smallImageElement = newArtistWrap.querySelector(`#artist-image-${artistId}-small`);
        const desktopImageElement = newArtistWrap.querySelector(`#artist-image-${artistId}`);
        const newFileInput = newArtistWrap.querySelector(`#artist-image-upload-${artistId}`);

        setupImageUploadForBoth(smallImageElement, desktopImageElement, newFileInput, 360, 416);
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
        <h2 contenteditable="true">New Artist</h2>
    `;

    // 블록 추가
    artistContainer.appendChild(newArtistBlock);

    // 이미지 업로드 이벤트 추가
    const newImageElement = newArtistBlock.querySelector(`#artist-image-${totalArtists}`);
    const newFileInput = newArtistBlock.querySelector(`#artist-image-upload-${totalArtists}`);
    setupImageUpload(newImageElement, newFileInput, resizeWidth, resizeHeight);
}

function setupImageUploadForBoth(mobileImageElement, desktopImageElement, uploadInput, resizeWidth, resizeHeight) {
    // 파일 선택 창 열기
    mobileImageElement.addEventListener('click', () => uploadInput.click());
    desktopImageElement.addEventListener('click', () => uploadInput.click());

    // 파일 변경 시 두 이미지를 동시에 업데이트
    uploadInput.addEventListener('change', (event) => {
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
                    const newImageSrc = canvas.toDataURL('image/png');
                    mobileImageElement.src = newImageSrc;
                    desktopImageElement.src = newImageSrc;
                };
            };
            reader.readAsDataURL(file);
        }
    });
}
