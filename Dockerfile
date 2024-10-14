# Sử dụng Node.js 18 làm base image
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Biên dịch ứng dụng
# RUN npm run build

# Thiết lập biến môi trường
ENV NODE_ENV=production

# Mở cổng mà ứng dụng sẽ lắng nghe
EXPOSE 3000

# Chạy ứng dụng
CMD ["sh", "-c", "node webhook-server.js & npx serve out"]
