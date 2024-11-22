document.getElementById('add-artist-button').addEventListener('click', function () {
    // 현재 아티스트 항목의 개수를 기준으로 순차적인 ID를 생성
    const totalArtists = document.querySelectorAll('.lineup-artists-wrap').length + 1; // 기존 아티스트 수 + 1
    const artistId = totalArtists;

    // 새로운 아티스트 항목을 위한 div 생성
    const newArtistWrap = document.createElement('div');
    newArtistWrap.classList.add('lineup-artists-wrap', 'flex', 'flex-wrap');
    newArtistWrap.setAttribute('id', `artist-${artistId}`);

    // 홀수 번째 아티스트는 왼쪽 이미지, 오른쪽 설명
    if (artistId % 2 === 1) {
        newArtistWrap.innerHTML = `
            <figure class="featured-image editable-image">
                <a>
                    <img id="artist-image-${artistId}" src="images/default.png" alt="New Artist Image">
                </a>
                <input type="file" id="artist-image-upload-${artistId}" class="hidden-input" accept="image/*">
            </figure>
            <div class="lineup-artists-description">
                <div class="lineup-artists-description-container">
                    <div class="entry-title" contenteditable="true">
                        아티스트 이름을 입력해주세요.
                    </div>
                    <div class="entry-content" contenteditable="true">
                        <p>아티스트에 대한 설명을 입력해주세요.</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        // 짝수 번째 아티스트는 오른쪽 이미지, 왼쪽 설명
        newArtistWrap.innerHTML = `
            <div class="lineup-artists-description">
                <div class="lineup-artists-description-container">
                    <div class="entry-title" contenteditable="true">
                        아티스트 이름을 입력해주세요.
                    </div>
                    <div class="entry-content" contenteditable="true">
                        <p>아티스트에 대한 설명을 입력해주세요.</p>
                    </div>
                </div>
            </div>
            <figure class="featured-image editable-image">
                <label for="artist-image-upload-${artistId}">
                    <img id="artist-image-${artistId}" src="images/default.png" alt="New Artist Image">
                </label>
                <input type="file" id="artist-image-upload-${artistId}" class="hidden-input" accept="image/*">
            </figure>
        `;
    }

    // 추가한 아티스트 항목을 기존 .lineup-artists에 삽입
    document.querySelector('.lineup-artists').appendChild(newArtistWrap);

    // 업로드된 이미지로 변경하는 이벤트 추가
    const newFileInput = newArtistWrap.querySelector(`#artist-image-upload-${artistId}`);
    const newImageElement = newArtistWrap.querySelector(`#artist-image-${artistId}`);
    
    if (newFileInput && newImageElement) {
        // 업로드 이미지 변경 이벤트 설정
        setupImageUploadEvent(newImageElement, newFileInput);
    }

    // 버튼을 아티스트 항목 뒤로 이동
    const addButton = document.getElementById('add-artist-button');
    addButton.parentElement.appendChild(addButton);
});

// 이미지 업로드 이벤트 처리
function setupImageUploadEvent(imageElement, uploadInput) {
    // 요소가 존재하는지 확인 후 이벤트 추가
    if (imageElement && uploadInput) {
        // 클릭 핸들러 정의 (이미지 클릭 시 업로드 창 열기)
        const clickHandler = () => uploadInput.click();

        // 클릭 이벤트가 이미 등록되어 있는지 확인하고, 있으면 제거 후 다시 추가
        if (imageElement._clickHandler) {
            imageElement.removeEventListener('click', imageElement._clickHandler);
        }

        // 클릭 이벤트 추가, once: true로 한 번만 실행되도록 설정
        imageElement._clickHandler = clickHandler; // 핸들러를 속성으로 저장
        imageElement.addEventListener('click', clickHandler, { once: true });

        // 파일 업로드 후 이미지를 리사이즈하여 변경
        uploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = new Image();
                    img.src = e.target.result;

                    img.onload = function () {
                        // Canvas에서 이미지 크기 조정
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        // 리사이즈할 크기 설정 (360x416)
                        const width = 360;
                        const height = 416;

                        // Canvas 크기 설정
                        canvas.width = width;
                        canvas.height = height;

                        // 이미지를 Canvas에 그리기
                        ctx.drawImage(img, 0, 0, width, height);

                        // 리사이즈된 이미지의 데이터 URL을 얻어서 <img> 태그에 설정
                        const resizedImage = canvas.toDataURL('image/png');
                        imageElement.src = resizedImage; // 업로드된 이미지로 변경
                    };
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// 초기 이미지 업로드 이벤트 처리
document.querySelectorAll('.featured-image').forEach((imageContainer) => {
    const uploadInput = imageContainer.querySelector('input[type="file"]');
    const imageElement = imageContainer.querySelector('img');
    setupImageUploadEvent(imageElement, uploadInput);
});
