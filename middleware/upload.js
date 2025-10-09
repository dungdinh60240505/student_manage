const multer = require('multer');
const path = require('path');
const fs = require('fs');
const allowedExtensions = ['.exe', '.php', '.js', '.c'];
const isInValidExtension = (fileName) => allowedExtensions.includes(path.extname(fileName).toLowerCase());
exports.middleware_upload_single = (field, originalDir) => {
    // Tạo các thư mục nếu chưa tồn tại
    createFolderIfNotExists(originalDir);

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            return cb(null, originalDir); // Lưu vào thư mục gốc
        },
        filename: function (req, file, cb) {
            if (isInValidExtension(file.originalname)) {
                return cb(new Error('Định dạng file không phù hợp'));
            } else {
                const name = path.basename(file.originalname, path.extname(file.originalname)); // tên không có đuôi
                const ext = path.extname(file.originalname).toLowerCase(); // đuôi file, ví dụ .png

                const safeName = name.replace(/[&<>"'()/\\`=%;:,?.!@#$^*+|[\]{}~\s]/g, ''); // loại ký tự đặc biệt + khoảng trắng
                const uniqueName = `${safeName}-${Date.now()}.${ext}`;

                cb(null, uniqueName);
            }
        }
    });

    const upload = multer({ storage: storage }).single(field); // Lưu vào thư mục gốc
    return (req, res, next) => {
        // Sử dụng try-catch để bắt lỗi từ middleware upload
        try {
            upload(req, res, async (err) => {
                if (err) {
                    // Trả về lỗi cho middleware xử lý lỗi
                   
                    return res.status(400).send(err.message);
                }
                try {

                    next(); // Tiếp tục xử lý sang middleware tiếp theo
                } catch (error) {
                    console.error(error);
            
                    return res.status(500).send('Lỗi trong quá trình xử lý hình ảnh');
                }
            });
        } catch (error) {
            console.error(error);
  
            // Trả về lỗi cho middleware xử lý lỗi
            return res.json(err.message);
        }
    };
};

const createFolderIfNotExists = (folderPath) => {
    return new Promise((resolve, reject) => {
      fs.access(folderPath, fs.constants.F_OK, (error) => {
        if (error) {
          // Thư mục không tồn tại, cần tạo mới
          fs.mkdir(folderPath, { recursive: true }, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        } else {
          // Thư mục đã tồn tại
          resolve();
        }
      });
    });
};
