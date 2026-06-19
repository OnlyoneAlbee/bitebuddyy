oKAY Quick explanation for this project so firstly 
Bite-Buddy is a modern food ordering web application built with:
⚡ Vite (build tool)
 React (frontend UI)
 React Router (navigation)
 Supabase (authentication + database) for the login and storing SQL data
 Vercel was used for deployment

And its a Single Page Application (SPA)

so the Project Architecture is 
Frontend (React UI)
    ↓
Routing Layer (React Router)
    ↓
State & Logic Layer (Hooks / Context)
    ↓
Backend (Supabase Cloud)

so just say these project was built using  React or React Router, Supabase for authentication 

The Project Structure

firsly these are the file that made the site runing

index.html
vite.config.ts
package.json

and from src/ folder 

── main.jsx / main.tsx        # ENTRY FILE (App starts here)
── App.jsx                    # Main app wrapper + routes

├── from routes/ folder                 # All application pages
   ├── Home.jsx
   ├── Login.jsx
   ├── Signup.jsx
   ├── Restaurants.jsx
   ├── Cart.jsx
   ├── Checkout.jsx
   ├── AdminDashboard.jsx

── from components/ folder             # Reusable UI components
   ├── Navbar.jsx
   ├── Footer.jsx
   ├── RestaurantCard.jsx
   ├── FoodItem.jsx

── from hooks/ folder                     # Custom logic (state + API)
    ├── useAuth.js
    ├── useCart.js
    ├── useRestaurants.js

── from lib/ folder
   ├── supabaseClient.js     # DATABASE CONNECTION FILE

── context/   folder                # Global state management
      ├── AuthContext.jsx

── from styles/    folder                # styling (CSS)


so mind you what makes the pages start is Called the Entry File

and the entery file is "main.jsx" from the Src folder \

so how the Routing System Works "URL changes → React Router detects → loads correct page from /routes  simple as that
quick example 
URL          | Page Loaded        
------------ | ------------
 /            | Home.jsx           
 /login       | Login.jsx          
 /restaurants | Restaurants.jsx    
 /admin       | AdminDashboard.jsx 

 so basically not only does it loads the page  

i used normal base english so if you read it you should understand for example cart.jsx if for add carts in the site

FOR the Supabase Database (Backend System)
i had to use my persernal account because your group didnt provide any specific email or any account so i cant directly give you my account but i would give you a LINK to see hoe the SQL DATA base works here

  signin to the SQL DATABASE HERE  you can veiw how the database run how it works here you can view your product id user id and all
  ![alt text](<Screenshot (22).png>)
   https://supabase.com/dashboard/sign-in
Gmail : bitebuddyy06@gmail.com
password: @Admin2026


SQL Database Login Details

https://supabase.com/dashboard/sign-in?returnTo=%2Forg

Gmail: bitebuddyy06@gmail.com
Password : @Admin2026


simple creating row for the site row and columns like admin, user, email, user id and all so you should understand 

Frontend 
   ↓
supabaseClient.js
   ↓
Supabase Cloud API
   ↓
Database Tables + Auth System

just incase your asked which Environment Variables the site uses just tell them VITE and env VITE_SUPABASE_URL= your-project-url
 simple

 so Bite-Buddy is a Vite-based SPA + React Router frontend
Supabase-powered backend  and Fully deployable modern web app

and mind you only the admin user able to make a custommer or user an admin 
the Admin user can see the total user that joined 
the admin user can see how many admin the site has
the admin user can see how many restaurant the site has 
and the total orders taken on the site 
thats the user management

The dashboard was created with React
and but supabase is what runs it and keep it active 

think of it like The React dashboard is the car
While the SQL database(supabase) is the engine 

simple as that 
so understand the structure to understand how the site works 

BiteBuddysite
 https://bitebuddyy.vercel.app

BiteBuddysite admin details 

Username: Admin
Email: bitebuddyy06@gmail.com
Password: @biteadmin

You are expected to create an account first before using the Admin details 

*NOTE 
Only admin can make any other user or customer admin 

The group Creators details are visible all users on the creator’s dashboard when clicked
