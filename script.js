var heartRateData = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [{
        label: 'Nhịp tim',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.1
    }]
};

var heartRateConfig = {
    type: 'line',
    data: heartRateData,
    options: {}
};

var heartRateChart = new Chart(
    document.getElementById('heartRateChart'),
    heartRateConfig
);

document.getElementById('temperature').innerText = '37°C';
document.getElementById('oxygenLevel').innerText = '98%';

// Bắt sự kiện khi người dùng nhấn vào liên kết "Mua thuốc"
document.getElementById('buyMedicine').addEventListener('click', function(event) {
    // Ngăn chặn hành vi mặc định của liên kết
    event.preventDefault();
    // Mở liên kết trong một tab mới
    window.open(this.href, '_blank');
});

//Tính bmi

// Lấy tham chiếu đến các phần tử HTML
var heightInput = document.getElementById('height');
var weightInput = document.getElementById('weight');
var bmiInput = document.getElementById('BMI');
var calculateButton = document.getElementById('cal');

// Hàm tính toán BMI
function calculateBMI(height, weight) {
    // Chuyển đổi chiều cao từ cm sang mét
    var heightInMeter = height / 100;
    // Tính BMI
    var bmi = weight / (heightInMeter * heightInMeter);
    // Trả về kết quả BMI với 2 chữ số sau dấu thập phân
    return bmi.toFixed(2);
}

// Bắt sự kiện click vào nút Calculate
calculateButton.addEventListener('click', function() {
    // Lấy giá trị chiều cao và cân nặng từ ô nhập
    var height = parseFloat(heightInput.value);
    var weight = parseFloat(weightInput.value);
    
    // Kiểm tra xem liệu dữ liệu nhập vào có hợp lệ không
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        // Hiển thị thông báo nếu dữ liệu không hợp lệ
        alert('Vui lòng nhập lại chiều cao cân nặng!');
    } else {
        // Tính toán BMI
        var bmi = calculateBMI(height, weight);
        // Hiển thị kết quả BMI lên ô BMI
        bmiInput.value = bmi;
        
        // Hiển thị kết quả BMI trong console cho mục đích kiểm tra
        console.log('BMI:', bmi);
        if(bmi < 18.5){
            alert('Bạn bị gầy, nguy cơ phát triển bệnh thấp');
        } else if(bmi >= 18.5 && bmi <= 24.9){
            alert('Bạn bình thường, nguy cơ phát triển bệnh trung bình');
        } else if(bmi >= 25 && bmi <= 29.9){
            alert('Bạn hơi béo, nguy cơ phát triển bệnh cao');
        } else if(bmi >= 30 && bmi <= 34.9){
            alert('Bạn béo phì cấp độ 1, nguy cơ phát triển bệnh cao');
        } else if(bmi >= 35 && bmi <= 39.9){
            alert('Bạn béo phì cấp độ 2, nguy cơ phát triển bệnh rất cao');
        } else if(bmi > 40){
            alert('Bạn béo phì cấp độ 3, nguy cơ phát triển bệnh nguy hiểm');
        }
    }
});

// Kết nối với MQTT broker
var client = mqtt.connect('wss://921a09fc37d74795bcc88e4fade20d14.s1.eu.hivemq.cloud:8884', {
    username: 'vulol123cx', // Thay thế bằng tên người dùng của bạn
    password: 'Taehoon0912' // Thay thế bằng mật khẩu của bạn

});

// Xử lý khi kết nối thành công
client.on('connect', function () {
    console.log('Connected to MQTT broker');
    
    // Đăng ký để nhận dữ liệu từ chủ đề 'health_data'
    client.subscribe('health_data', function (err) {
        if (!err) {
            console.log('Subscribed to health_data topic');
        }
    });
});

// Xử lý khi nhận được dữ liệu từ MQTT broker
client.on('message', function (topic, message) {
    // Đoạn code này được gọi mỗi khi nhận được dữ liệu từ MQTT broker
    // Ở đây, bạn có thể xử lý dữ liệu nhận được từ chủ đề và cập nhật giao diện người dùng của bạn
    console.log('Received message:', message.toString());
});
// Xử lý khi nhận được dữ liệu từ MQTT broker cho nhịp tim
client.on('message', function (topic, message) {
    // Đảm bảo rằng chủ đề nhận được là cho nhịp tim
    if (topic === 'heart_rate_data') {
        // Giả sử dữ liệu nhận được là một số nguyên, bạn cần phải chuyển đổi sang dạng phù hợp
        var heartRate = parseInt(message.toString());
        
        // Cập nhật dữ liệu lên biểu đồ
        heartRateData.datasets[0].data.push(heartRate);
        heartRateChart.update();
    }
});
// Xử lý khi nhận được dữ liệu từ MQTT broker cho nhiệt độ và nồng độ oxi
client.on('message', function (topic, message) {
    // Đảm bảo rằng chủ đề nhận được là cho nhiệt độ hoặc nồng độ oxi
    if (topic === 'temperature_data') {
        var temperature = message.toString();
        // Cập nhật dữ liệu nhiệt độ lên giao diện web
        document.getElementById('temperature').innerText = temperature;
    } else if (topic === 'oxygen_level_data') {
        var oxygenLevel = message.toString();
        // Cập nhật dữ liệu nồng độ oxi lên giao diện web
        document.getElementById('oxygenLevel').innerText = oxygenLevel;
    }
});


