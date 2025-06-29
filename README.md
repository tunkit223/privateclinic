Project: Phòng khám tư nhân – SE104
Board: https://trello.com/b/g814nemC/privateclinic
Members:
  Trương Tuấn Kiệt - 23520823
  Võ Tuấn Kiệt - 23520826
  Nguyễn Tuấn Kiệt - 23520815
Cách tải code về, kết nối với database để chạy được:
Bước 1: clone dự án từ github https://github.com/tunkit223/privateclinic.git
Bước 2: chạy lệnh npm install để tải các thư viện cần thiết
Bước 3: tạo 1 file là .env.local
Bước 4: dán nội dung sau vào .env.local
PROJECT_ID=6785e3b8002e9c709766
API_KEY=standard_2e6d8f4e1c0351cc3774af4e86444008985ce3b346db88426e0a2c4fb629679f09a0127facf012756e9eb59206dd164d0238447ad6d0a6d008411c77d3201995f89da0627dbc030d36773384dea002cc7e11a66bce9c3630faef65f56d9bf38ff877f4199444245326a982e7b33b8315b437f512ef5e3d2d237211c32c6c6461
DATABASE_ID=6785e47f000971f0f63d
PATIENT_COLLECTION_ID=6785e4b5001c8f761799
DOCTOR_COLLECTION_ID=6785e4ff002aaa69a8fb
APPOINTMENT_COLLECTION_ID=6785e56500245b15c2a2
NEXT_PUBLIC_BUCKET_ID=6785e5ac0003f1ff57f1
NEXT_PUBLIC_ENDPOINT=https://cloud.appwrite.io/v1

NEXT_PUBLIC_ADMIN_PASSKEY=123456

MONGODB_URI=mongodb+srv://tuankietwork22:Nd8h7lTCRpmwGgQF@privateclinic.w9fpf.mongodb.net/
EMAIL_USER=tunkit371@gmail.com
EMAIL_PASS=pmpe rgqs yyyu ujnz 
UPLOADTHING_TOKEN='eyJhcGlLZXkiOiJza19saXZlXzNkYWI2YTc3Yjg0ZGVlOTY0MzYzMWNlMDg4ODgyOTY0NzEwNjY4YjA2NmI3MTljMzVhNjRjYmYxYmVkN2MwY2YiLCJhcHBJZCI6Im1hMDliNnI2bXkiLCJyZWdpb25zIjpbInNlYTEiXX0='

CLOUDINARY_CLOUD_NAME=dtt9eodin
CLOUDINARY_API_KEY=522641976118531
CLOUDINARY_API_SECRET=BHhq5FwVJyHBEI4Y-L2SuX1qWOY
Bước 5: trong thư mục chạy lệnh npm run dev để chạy dự án.
