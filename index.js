document.getElementById('uploadButton').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    
    if (!imageInput.files || imageInput.files.length === 0) {
        alert('Please select an image file.');
        return;
    }

    const imageFile = imageInput.files[0];

    try {
        // 이미지를 Base64로 인코딩하는 함수
        const base64Image = await convertToBase64(imageFile);
        
        // Cloudflare를 통해 Lambda에 이미지 업로드
        const response = await uploadImageToAPI(base64Image);

        // 응답 결과가 성공적이라면
        if (response.success) {
            console.log('Analysis result:', response.analysisResult);
        } else {
            console.error('Error from server:', response.error);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});

// 이미지를 Base64로 변환하는 함수
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);  // Base64 데이터만 추출
        reader.onerror = error => reject(error);
    });
}

// API에 이미지 업로드하는 함수
async function uploadImageToAPI(base64Image) {
    const apiUrl = 'https://ai-dog4cut.cc/uploads';  // API Gateway URL

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),  // Base64로 인코딩된 이미지를 전달
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    return await response.json();  // Lambda 함수에서 반환된 JSON 응답
}