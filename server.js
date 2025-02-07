import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv"; // Thêm dotenv để load biến môi trường

dotenv.config(); // Load biến môi trường từ file .env

const app = express();
const port = process.env.PORT || 5000;

// Cấu hình CORS
app.use(cors());

// Middleware để parse JSON từ client
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => {
    console.error("❌ Kết nối MongoDB thất bại:", err);
    process.exit(1); // Thoát nếu kết nối thất bại
  });

// Định nghĩa schema và model cho bệnh viện
const hospitalSchema = new mongoose.Schema({
  tenBenhVien: String,
  diaChi: String,
  soDienThoai: String,
  chuyenKhoa: [String],
  coDichVuCapCuu: Boolean,
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

// API: Tạo mới bệnh viện
app.post("/api/hospitals", async (req, res) => {
  try {
    const newHospital = new Hospital(req.body);
    const savedHospital = await newHospital.save();
    res.status(201).json(savedHospital);
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({
      error: "Có lỗi xảy ra khi lưu dữ liệu",
      details: error.message,
    });
  }
});

// API: Lấy danh sách bệnh viện
app.get("/api/hospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).json({
      error: "Có lỗi xảy ra khi lấy dữ liệu",
      details: error.message,
    });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
