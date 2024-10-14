// pages/restaurants.js

import { useState } from 'react';
import Link from 'next/link';

export async function getStaticProps() {
  try {
    // Lấy danh sách nhà hàng
    const restaurantsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants?populate=*`);
    const restaurantsData = await restaurantsResponse.json();
    const restaurants = restaurantsData.data;

    // Lấy danh sách categories
    const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
    const categoriesData = await categoriesResponse.json();
    const categories = categoriesData.data;

    return {
      props: { restaurants, categories },
      // revalidate: 60, // Nếu bạn muốn sử dụng ISR (Incremental Static Regeneration)
    };
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return {
      props: { restaurants: [], categories: [] },
    };
  }
}

const Restaurants = ({ restaurants, categories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Hàm xử lý thay đổi trong thanh tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Hàm xử lý thay đổi category
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Lọc danh sách nhà hàng dựa trên từ khóa tìm kiếm và category
  const filteredRestaurants = restaurants
    .filter((restaurant) =>
      selectedCategory
        ? restaurant.attributes.categories.data.some(
            (category) => category.attributes.name === selectedCategory
          )
        : true
    )
    .filter((restaurant) =>
      searchQuery
        ? restaurant.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Danh sách Nhà Hàng</h1>

      {/* Thanh tìm kiếm và lọc category */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm nhà hàng..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-6 mb-2">
          <select
            className="form-control"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Tất cả loại món ăn</option>
            {categories.map((category) => (
              <option key={category.id} value={category.attributes.name}>
                {category.attributes.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hiển thị danh sách nhà hàng đã lọc */}
      <div className="row">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="col-md-4 mb-4">
              <div className="card h-100">
                {restaurant.attributes.image.data.length > 0 && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${restaurant.attributes.image.data[0].attributes.url}`}
                    className="card-img-top"
                    alt={restaurant.attributes.name}
                    style={{ objectFit: 'cover', height: '200px' }}
                    loading="lazy"
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{restaurant.attributes.name}</h5>
                  <p className="card-text flex-grow-1">
                    {restaurant.attributes.description[0]?.children[0]?.text || 'Không có mô tả'}
                  </p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Địa chỉ:</strong> {restaurant.attributes.address || 'Không rõ'}
                    </li>
                    <li className="list-group-item">
                      <strong>Giá trung bình:</strong> {restaurant.attributes.avgPrice ? `${restaurant.attributes.avgPrice} USD` : 'Không rõ'}
                    </li>
                    <li className="list-group-item">
                      <strong>Giờ mở cửa:</strong> {restaurant.attributes.openningHours?.hours || 'Không rõ'} (
                      {restaurant.attributes.openningHours?.days || 'Không rõ'})
                    </li>
                    <li className="list-group-item">
                      <strong>Loại món ăn:</strong>{' '}
                      {restaurant.attributes.categories.data.map((category) => category.attributes.name).join(', ')}
                    </li>
                  </ul>
                  {/* Nút xem chi tiết */}
                  <Link href={`/restaurants/${restaurant.id}`} passHref>
                    <div className="btn btn-primary mt-3">Xem Chi Tiết</div>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">Không tìm thấy nhà hàng nào phù hợp với tìm kiếm hoặc loại món ăn đã chọn.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
