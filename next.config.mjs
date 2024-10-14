/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        domains: ['localhost'], // Thêm domain của API nếu bạn sử dụng component Image
    },
};

export default nextConfig;
