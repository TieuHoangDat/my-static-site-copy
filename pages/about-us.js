// pages/about-us.js
import React, { useState } from 'react';

const AboutUs = ({ contentData }) => {
  const [locale, setLocale] = useState('en'); // Ngôn ngữ mặc định là tiếng Anh

  const handleLanguageChange = (language) => {
    setLocale(language); // Thay đổi ngôn ngữ
  };

  // Lọc nội dung theo ngôn ngữ được chọn
  const content = contentData.find((item) => item.attributes.locale === locale)?.attributes.content || [];

  return (
    <div>
      <div className="container">
        <div className="d-flex justify-content-end my-3">
          <button
            className={`btn btn-${locale === 'en' ? 'primary' : 'outline-primary'} mx-1`}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
          <button
            className={`btn btn-${locale === 'vi' ? 'primary' : 'outline-primary'} mx-1`}
            onClick={() => handleLanguageChange('vi')}
          >
            Tiếng Việt
          </button>
        </div>

        <div>
          {content.map((paragraph, index) => (
            <p key={index}>
              {paragraph.children.map((child, i) => (
                <span key={i} className="font-weight-bold">
                  {child.text}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

// Lấy dữ liệu tĩnh tại thời điểm build
export async function getStaticProps() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about-us?locale=all`); // Lấy tất cả nội dung
    const data = await response.json();

    return {
      props: {
        contentData: data.data, // Trả về toàn bộ dữ liệu
      },
    };
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    return {
      props: {
        contentData: [], // Hoặc bạn có thể trả về một giá trị mặc định khác
      },
    };
  }
}

export default AboutUs;
