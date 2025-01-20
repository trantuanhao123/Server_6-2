// File: server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const app = express(); // Khởi tạo app trước khi sử dụng
const port = 5000;

// Cấu hình CORS cho phép tất cả các nguồn
app.use(cors());

// Kết nối MongoDB
mongoose
  .connect(
    "mongodb+srv://trantuanhao123:Hao123456@cluster0.4tjhm.mongodb.net/test"
  )
  .then(() => console.log("Kết nối MongoDB thành công"))
  .catch((err) => console.error("Kết nối MongoDB thất bại:", err));

// Định nghĩa schema cho bệnh viện
const hospitalSchema = new mongoose.Schema({
  tenBenhVien: String,
  diaChi: String,
  soDienThoai: String,
  chuyenKhoa: [String],
  coDichVuCapCuu: Boolean,
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

// Middleware để parse dữ liệu từ client
app.use(bodyParser.json());

// API để lưu thông tin bệnh viện vào MongoDB
app.post("/api/hospitals", (req, res) => {
  const newHospital = new Hospital(req.body);

  newHospital
    .save()
    .then((hospital) => {
      res.status(201).json(hospital);
    })
    .catch((error) => {
      console.error("Error saving data:", error); // Log lỗi để kiểm tra chi tiết
      res.status(500).json({
        error: "Có lỗi xảy ra khi lưu dữ liệu",
        details: error.message,
      });
    });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
