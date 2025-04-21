// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtO7yMF8yhTkTv3faN0u1oNyJ0KpaBnsA",
  authDomain: "vu-tru-nghe-nghiep.firebaseapp.com",
  databaseURL: "https://vu-tru-nghe-nghiep-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vu-tru-nghe-nghiep",
  storageBucket: "vu-tru-nghe-nghiep.firebasestorage.app",
  messagingSenderId: "248626863436",
  appId: "1:248626863436:web:00362f550042ef8dd743e9",
  measurementId: "G-3QDN201BBD"
};

// Khởi tạo Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Biến để đếm số nghề nghiệp
let careerCount = {};

// Hàm chuyển đổi nhị phân thành văn bản (nghề nghiệp)
function binaryToText(binary) {
  const binaryArray = binary.split(' ');
  return binaryArray.map(bin => {
    const num = parseInt(bin, 2);
    return String.fromCharCode(num);
  }).join('');
}

// Hàm thêm ngôi sao (gửi dữ liệu lên Firebase)
async function addStar() {
  const binaryInput = document.getElementById('binaryInput').value.trim();
  if (!binaryInput) return;

  const career = binaryToText(binaryInput); // Chuyển nhị phân thành văn bản

  // Lưu dữ liệu vào Firebase
  const newData = {
    binary: binaryInput,
    career: career,
    timestamp: new Date().toISOString()
  };

  try {
    await firebase.database().ref('stars').push(newData);
    console.log('Dữ liệu đã được lưu vào Firebase');
  } catch (error) {
    console.error('Lỗi khi gửi dữ liệu lên Firebase', error);
  }

  document.getElementById('binaryInput').value = ''; // Xóa ô input sau khi gửi
}

// Hàm vẽ ngôi sao vào vũ trụ
function renderStar(binary, career) {
  const universe = document.getElementById('universe');
  const star = document.createElement('div');
  star.classList.add('star');
  star.innerHTML = `${career}`;
  
  // Tạo ngôi sao và gán vị trí ngẫu nhiên
  const randomAngle = Math.random() * 360;
  const randomDistance = 200 + Math.random() * 100;

  const x = randomDistance * Math.cos(randomAngle);
  const y = randomDistance * Math.sin(randomAngle);

  star.style.transform = `translate(${x}px, ${y}px)`;

  universe.appendChild(star);
}

// Hàm cập nhật thống kê số lượng nghề nghiệp
function updateStats() {
  let total = 0;
  for (const count of Object.values(careerCount)) {
    total += count;
  }

  let html = '<ul>';
  for (const career in careerCount) {
    const percent = ((careerCount[career] / total) * 100).toFixed(1);
    html += `<li><strong>${career}</strong>: ${careerCount[career]} lượt (${percent}%)</li>`;
  }
  html += `</ul><p><strong>Tổng cộng:</strong> ${total} nghề nghiệp đã được gửi 🚀</p>`;
  document.getElementById('stats').innerHTML = html;
}

// Hàm tải dữ liệu từ Firebase và hiển thị ngôi sao
window.onload = function () {
  firebase.database().ref('stars').on('value', function(snapshot) {
    const data = snapshot.val();
    if (data) {
      for (const key in data) {
        const item = data[key];
        renderStar(item.binary, item.career);  // Render ngôi sao
        if (!careerCount[item.career]) careerCount[item.career] = 0;
        careerCount[item.career]++;
      }
    }
    updateStats();  // Cập nhật thống kê
  });
};
