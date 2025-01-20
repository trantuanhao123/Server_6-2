import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import serverless from "serverless-http";  // Thêm thư viện serverless-http

const app = express();
const port = process.env.PORT || 5000; // Dùng biến môi trường PORT nếu có, nếu không thì mặc định là 5000

// Cấu hình CORS cho phép tất cả các nguồn
app.use(cors());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URL)  // Sử dụng biến môi trường để kết nối MongoDB
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

// Expose ứng dụng Express qua serverless handler
export const handler = serverless(app);
