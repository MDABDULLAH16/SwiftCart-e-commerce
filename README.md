# What is the difference between null and undefined?

`undefined` মানে হলো ভ্যারিয়েবল declare করা হয়েছে কিন্তু কোনো মান দেওয়া হয়নি। এটি সাধারণত JavaScript নিজে থেকে সেট করে।

`null` মানে ইচ্ছাকৃতভাবে খালি মান সেট করা হয়েছে। এটি ডেভেলপার নিজে assign করে।


# What is the use of the map() function in JavaScript? How is it different from forEach()?

map() array-এর প্রতিটি element উপর কাজ করে এবং একটি নতুন array রিটার্ন করে।

forEach() শুধু প্রতিটি element উপর কাজ করে, কিন্তু কোনো কিছু রিটার্ন করে না।


# What is the difference between == and ===?

== মান তুলনা করে এবং প্রয়োজনে টাইপ পরিবর্তন করে।

=== মান এবং টাইপ দুটোই তুলনা করে, টাইপ পরিবর্তন করে না।

সাধারণভাবে নিরাপদ তুলনার জন্য === ব্যবহার করা ভালো।

# What is the significance of async/await in fetching API data?

API থেকে ডেটা লোড করা সময়সাপেক্ষ কাজ। async/await ব্যবহার করলে asynchronous কোড সহজভাবে লেখা যায়।

এতে কোড পড়তে সহজ হয় এবং error handle করা সুবিধাজনক হয়।

# Explain the concept of Scope in JavaScript (Global, Function, Block).

Scope মানে হলো কোনো ভ্যারিয়েবল কোথায় ব্যবহার করা যাবে।

Global Scope: সর্বত্র ব্যবহার করা যায়।
Function Scope: শুধু ফাংশনের ভিতরে ব্যবহার করা যায়।
Block Scope: {} এর ভিতরে সীমাবদ্ধ থাকে (let এবং const ক্ষেত্রে)।
