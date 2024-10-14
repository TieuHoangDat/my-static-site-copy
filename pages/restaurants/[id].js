// pages/restaurants/[id].js

import React from 'react';
// import { useRouter } from 'next/router';
import Link from 'next/link';

export async function getStaticPaths() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants?populate=*`);
    const data = await response.json();
    const restaurants = data.data;

    // Tạo paths từ danh sách nhà hàng
    const paths = restaurants.map((restaurant) => ({
      params: { id: restaurant.id.toString() }, // Chuyển ID thành string
    }));

    return { paths, fallback: false }; // fallback: false nếu không tìm thấy đường dẫn thì trả về 404
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  const { id } = params;

  try {
    const restaurantResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${id}?populate=*`);
    const restaurantData = await restaurantResponse.json();
    const restaurant = restaurantData.data;

    return {
      props: { restaurant }, // Trả về dữ liệu nhà hàng cụ thể
    };
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    return { props: { restaurant: null } }; // Trả về null nếu không lấy được dữ liệu
  }
}

const RestaurantDetail = ({ restaurant }) => {
//   const router = useRouter();

  // Nếu không tìm thấy nhà hàng, có thể hiển thị trang 404 hoặc thông báo
  if (!restaurant) {
    return <p>Không tìm thấy nhà hàng.</p>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">{restaurant.attributes.name}</h1>
      {restaurant.attributes.image.data.length > 0 && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${restaurant.attributes.image.data[0].attributes.url}`}
          className="img-fluid mb-4"
          alt={restaurant.attributes.name}
          style={{ objectFit: 'cover', height: '300px' }}
          loading="lazy"
        />
      )}
      <p>{restaurant.attributes.description[0]?.children[0]?.text || 'Không có mô tả'}</p>
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
      <div className="mt-4">
        <Link href="/restaurants" passHref>
          <button className="btn btn-secondary">Quay lại danh sách nhà hàng</button>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantDetail;
