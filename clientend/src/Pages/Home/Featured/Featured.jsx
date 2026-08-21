import SecTitle from "../../../Components/SectionTitle/SecTitle";

import FeaturedCard from "./FeaturedCard";

const Featured = () => {
  return (
    <div
      className="bg-fixed bg-cover h-[400] "
      style={{
        backgroundImage:
          "url(https://images.pexels.com/photos/297485/pexels-photo-297485.jpeg?auto=compress&cs=tinysrgb&w=1200)",
      }}
    >
      <SecTitle title={"Featured"} />

      <div className="container mx-auto  items-center ">
        <div className="grid grid-cols-1 gap-10  md:grid-cols-3 justify-around ">
          <FeaturedCard
            title="নিরাপদ রক্তদান"
            description="প্রশিক্ষিত মেডিকেল স্টাফ ও জীবাণুমুক্ত সরঞ্জামের মাধ্যমে প্রতিটি রক্তদান সম্পূর্ণ নিরাপদভাবে সম্পন্ন করা হয়।"
          ></FeaturedCard>
          <FeaturedCard
            title="জরুরি রক্তের চাহিদা"
            description="দুর্ঘটনা, অস্ত্রোপচার বা প্রসবকালীন জটিলতায় প্রতিদিন হাজারো মানুষের জরুরি রক্তের প্রয়োজন হয়।"
          ></FeaturedCard>
          <FeaturedCard
            title="একটি দান, তিনটি জীবন"
            description="আপনার একটি রক্তদান তিনজন পর্যন্ত মানুষের জীবন বাঁচাতে সাহায্য করতে পারে।"
          ></FeaturedCard>
        </div>
      </div>
    </div>
  );
};

export default Featured;
