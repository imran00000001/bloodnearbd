const blog = require("../models/blogPost");

// The very first blog post on the site, so the Blog page and the Content
// Management table are never empty for a fresh install. This runs once at
// server startup and only inserts anything if the "blogs" collection is
// completely empty — it will never duplicate or overwrite real posts that
// admins/users add later.
const FIRST_BLOG_POST = {
  title: "রক্তদানের গল্প: একজন অচেনা মানুষের জন্য ভালোবাসা",
  author: "BloodNear BD",
  blogImg: "/blood-donation-story.png",
  blogStatus: "published",
  date: new Date().toISOString(),
  blogContent: `
    <p>কখনো কখনো আমাদের জীবনের খুব ছোট একটি সিদ্ধান্ত, অন্য কারও জীবনে হয়ে উঠতে পারে সবচেয়ে বড় আশীর্বাদ।</p>
    <p>সেদিন আমি রক্ত দিতে গিয়েছিলাম শুধু একজন মানুষকে সাহায্য করার জন্য। কিন্তু রক্ত দেওয়ার পর মনে হলো, আমি হয়তো এমন একজন মানুষের পাশে দাঁড়িয়েছি, যাকে আমি কখনো চিনিও না। জানি না আমার রক্ত কার শরীরে যাবে, জানি না সে কে, কোথায় থাকে—শুধু জানি, হয়তো কোনো এক পরিবার সেই মানুষটির জন্য অপেক্ষা করছে।</p>
    <p>এক ব্যাগ রক্ত আমাদের কাছে হয়তো খুব সাধারণ একটি বিষয়। কিন্তু যার প্রয়োজন, তার কাছে এই এক ব্যাগ রক্তই হতে পারে বেঁচে থাকার শেষ আশা।</p>
    <p>রক্ত দেওয়ার সময় মনে হচ্ছিল, আমার শরীর থেকে কয়েক ফোঁটা রক্ত বের হচ্ছে, আর কোথাও একজন মানুষের জীবনে নতুন আশার জন্ম হচ্ছে।</p>
    <p>আমরা অনেক সময় ভাবি, অন্যের জন্য বড় কিছু করার মতো সামর্থ্য আমাদের নেই। কিন্তু সত্যি বলতে, মানবিক হতে সবসময় বড় কিছু প্রয়োজন হয় না। প্রয়োজন শুধু একটু ইচ্ছা, একটু সাহস আর অন্যের জন্য কিছু করার মানসিকতা।</p>
    <p>আজকের এই ছবিটা তাই শুধু রক্তদানের একটি ছবি নয়।<br/>এটা একজন মানুষের প্রতি আরেকজন মানুষের দায়িত্বের ছবি।<br/>এটা মানবতার ছবি।<br/>এটা একজন অচেনা মানুষের জন্য ভালোবাসার গল্প।</p>
    <p>এক ব্যাগ রক্ত—হয়তো কারও পুরো জীবন।</p>
    <p>তাই আসুন, আমরা রক্তদানে এগিয়ে আসি। কারণ আপনার দেওয়া রক্ত হয়তো কোনো এক মায়ের সন্তানকে, কোনো বাবার সন্তানকে, কোনো পরিবারের প্রিয় মানুষকে আবার তাদের কাছে ফিরিয়ে দিতে পারে।</p>
    <p><strong>রক্ত দিন, জীবন বাঁচান। মানবতার পাশে দাঁড়ান।</strong></p>
  `.trim(),
};

async function seedInitialBlog() {
  try {
    const existingCount = await blog.estimatedDocumentCount();
    if (existingCount > 0) return;

    await blog.create(FIRST_BLOG_POST);
    console.log("Seeded the first blog post.");
  } catch (err) {
    // Never let a seeding hiccup stop the server from starting.
    console.warn("Could not seed the first blog post:", err.message);
  }
}

module.exports = seedInitialBlog;
