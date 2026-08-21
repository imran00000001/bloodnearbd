import SecTitle from "../../../Components/SectionTitle/SecTitle";


const AboutUs = () => {
    return (
        <div className="bg-ivory py-14">
            <style>{`
                @keyframes dropPulse {
                    0%   { transform: scale(1); opacity: 0.9; }
                    50%  { transform: scale(1.12); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.9; }
                }
                @keyframes lineDraw {
                    to { stroke-dashoffset: 0; }
                }
                .about-visual svg .drop {
                    animation: dropPulse 2.4s ease-in-out infinite;
                    transform-origin: center;
                }
                .about-visual svg .pulse-line {
                    stroke-dasharray: 500;
                    stroke-dashoffset: 500;
                    animation: lineDraw 3.5s ease-in-out infinite;
                }
            `}</style>

            <SecTitle title={"রক্তদানের ইতিহাস"} subHeading={"Save blood for Future"} />

            <div className="grid grid-cols-1 container mx-auto md:grid-cols-2 gap-10 items-center px-6">

                <div className="about-visual order-2 md:order-1 flex items-center justify-center">
                    <svg viewBox="0 0 400 400" className="w-full max-w-sm">
                        <circle cx="200" cy="200" r="180" fill="#FFF1E6" />
                        <path className="drop" fill="#7A1128"
                            d="M200 70 C 260 150, 300 210, 300 260 C 300 315, 255 350, 200 350 C 145 350, 100 315, 100 260 C 100 210, 140 150, 200 70 Z" />
                        <path className="drop" fill="#E8A33D" opacity="0.85"
                            d="M200 150 C 225 190, 245 220, 245 250 C 245 280, 225 300, 200 300 C 175 300, 155 280, 155 250 C 155 220, 175 190, 200 150 Z" />
                        <polyline className="pulse-line" fill="none" stroke="#ffffff" strokeWidth="5"
                            strokeLinecap="round" strokeLinejoin="round"
                            points="90,255 150,255 170,215 200,290 220,235 240,255 310,255" />
                    </svg>
                </div>

                <div className="order-1 md:order-2">
                    <h3 className="text-lg leading-8 text-justify text-gray-700 mb-6">গুহাবাসী এই মানুষদের রক্ত সম্পর্কে কোনো ধারণা ছিল না। তবে আঘাতে দেহের কোথাও থেকে রক্ত ঝরলে বা অতিরিক্ত রক্তক্ষরণে কাউকে মারা যেতে দেখলে তারা বুঝতো যে, রক্ত এমন এক জিনিস যার ওপর জীবন-মরণ নির্ভর করে!
                        প্রাচীন মিশরীয়দের বর্ণনা থেকে মনে হয়, হৃৎপিণ্ড এবং রক্ত সংবহন প্রক্রিয়া সম্পর্কে তাদের ধারণা ছিল। নাড়ির উল্লেখ সর্বপ্রথম তাদের কাছ থেকেই পাওয়া যায়।
                    </h3>
                    <h3 className="text-lg leading-8 text-justify text-gray-700 border-l-4 border-amber pl-4 italic">হাসপাতালের বিছানায় শুয়ে থাকা মানুষটি হয়তো আপনার পরিচিত কেউ নয়। কিন্তু সে কারো বাবা, কারো আদরের সন্তান, কিংবা কোনো একটি পরিবারের একমাত্র অবলম্বন। যখন চিকিৎসকের হাত গুটিয়ে যায়, যখন চারপাশের সব আশা নিভে যায়—তখন আপনার দেওয়া এক ব্যাগ রক্তই পারে একটি নিভু নিভু প্রাণকে আবার আলোতে ফেরাতে।
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
