// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

export default function HeroSection() {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
    >
    

      <SwiperSlide>
        <img
          src="https://picsum.photos/300/200?random=2"
          alt="Slide 2"
          style={{ width: '100%', borderRadius: '10px' }}
        />
      </SwiperSlide>

      <SwiperSlide>
        <img
          src="https://picsum.photos/300/200?random=3"
          alt="Slide 3"
          style={{ width: '100%', borderRadius: '10px' }}
        />
      </SwiperSlide>

      <SwiperSlide>
        <img
          src="https://picsum.photos/300/200?random=4"
          alt="Slide 4"
          style={{ width: '100%', borderRadius: '10px' }}
        />
      </SwiperSlide>
    </Swiper>
  );
}