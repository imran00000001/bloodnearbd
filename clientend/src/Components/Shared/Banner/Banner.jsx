import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import ButtonCom from '../../Button/ButtonCom';
import { Button } from '@mui/material';
import { BloodtypeOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';


const Banner = () => {
  return <div className='relative overflow-hidden grid bg-cover bg-opacity-100 grid-cols-1  md:grid-cols-2 gap-0 h-[650px] items-center   
  
  transform'>

    <style>{`
      @keyframes bloodFlowMove {
        0%   { transform: translate(0, 0) scale(1); }
        33%  { transform: translate(-12%, 8%) scale(1.5); }
        66%  { transform: translate(10%, -8%) scale(1.3); }
        100% { transform: translate(0, 0) scale(1); }
      }
      .blood-flow-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        background: #FFF3EC;
      }
      .blood-flow-bg span {
        position: absolute;
        border-radius: 50%;
        filter: blur(35px);
        animation: bloodFlowMove 7s ease-in-out infinite;
        opacity: 0.75;
      }
      .blood-flow-bg span:nth-child(1){ width:420px; height:420px; left:-10%; top:-5%; background:#B33951; animation-duration: 11s; }
      .blood-flow-bg span:nth-child(2){ width:340px; height:340px; right:-5%; top:-8%; background:#7A1128; animation-duration: 8s; animation-delay: 1s; }
      .blood-flow-bg span:nth-child(3){ width:460px; height:460px; right:0%; bottom:-20%; background:#A32638; animation-duration: 12s; animation-delay: 2s; }
      .blood-flow-bg span:nth-child(4){ width:320px; height:320px; left:20%; bottom:-15%; background:#E8A33D; animation-duration: 9s; animation-delay: 0.5s; }
      .blood-flow-bg span:nth-child(5){ width:280px; height:280px; left:2%; top:60%; background:#D64550; animation-duration: 6s; animation-delay: 1.5s; }
    `}</style>

    <div className='blood-flow-bg'>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div className='relative z-10 text-center  mx-auto'>
      <div>  <img className='w-48 relative z-0 bottom-0 -top-10 -right-10' src="https://www.cpsmumbai.org/Uploads/2762023161833920.png" alt="" /></div>
      <div className='flex gap-5  h-17 justify-center items-center'>
        <div>
          <Link to='/signUp'> <Button variant='contained' sx={{ bgcolor: "#4A2C17", color: "white", "&:hover": { bgcolor: "#3A2210" } }}> Join as a donor </Button></Link>
        </div>
        <div>
          <Link to='/searchDonors' > <ButtonCom text={'Search Donors'} /> </Link>
        </div>
      </div>
    </div>

    < div className='relative z-10 px-6' >
      <Swiper
        spaceBetween={30}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className='text-center md:text-left'>
            <BloodtypeOutlined sx={{ fontSize: '48px', color: '#7A1128' }} />
            <h1
              className='font-display font-bold leading-tight text-[#7A1128]'
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', textShadow: '0 2px 10px rgba(255,255,255,0.7)' }}
            >
              আপনার এক ব্যাগ রক্ত, <br /> কারো নতুন জীবন
            </h1>
            <p className='mt-4 text-lg md:text-xl font-semibold max-w-xl' style={{ color: '#3B1418' }}>
              আজই একজন স্বেচ্ছা রক্তদাতা হয়ে উঠুন — আপনার একটি সিদ্ধান্ত বাঁচাতে পারে তিনটি প্রাণ।
            </p>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='text-center md:text-left'>
            <BloodtypeOutlined sx={{ fontSize: '48px', color: '#7A1128' }} />
            <h1
              className='font-display font-bold leading-tight text-[#7A1128]'
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', textShadow: '0 2px 10px rgba(255,255,255,0.7)' }}
            >
              সম্মানিত স্বেচ্ছা রক্তদাতা, <br /> আপনাকে অভিনন্দন
            </h1>
            <p className='mt-4 text-lg md:text-xl font-semibold max-w-xl' style={{ color: '#3B1418' }}>
              আমাদের দেশে প্রয়োজনীয় রক্তের একটি বড় অংশ আসে স্বেচ্ছা রক্তদাতাদের কাছ থেকেই — এই সংখ্যা যত বাড়বে, তত বেশি প্রাণ বাঁচবে।
            </p>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='text-center md:text-left'>
            <BloodtypeOutlined sx={{ fontSize: '48px', color: '#7A1128' }} />
            <h1
              className='font-display font-bold leading-tight text-[#7A1128]'
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', textShadow: '0 2px 10px rgba(255,255,255,0.7)' }}
            >
              তিনটি প্রাণ, <br /> একটি সিদ্ধান্ত
            </h1>
            <p className='mt-4 text-lg md:text-xl font-semibold max-w-xl' style={{ color: '#3B1418' }}>
              একটি মাত্র রক্তদান সর্বোচ্চ তিনজন মানুষের জীবন বাঁচাতে সাহায্য করতে পারে।
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div >

  </div >;
};

export default Banner;
