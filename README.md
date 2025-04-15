# Frontend Web App for Interactive Banner Design

## Description

This is a React-Vite-made web application for creating interactive and responsive web ad banners. It allows users to dynamically customize banner properties such as text, colors, images, and more, without any fuss. Whether you're designing banners for events, promotions, or campaigns, this tool simplifies the process with an intuitive interface and real-time previews.

---

## What the Project Does

This project provides a user-friendly web application for designing dynamic and responsive web ad banners. Key features include:

- **Dynamic Customization**:
  - Change banner text, background color, images, and other properties in real-time.
  - Interactive controls (e.g., dropdowns, sliders, buttons) to modify banner elements.
- **Responsive Design**:

  - Previews for different screen sizes (desktop, tablet, mobile).

- **Real-Time Previews**:

  - See changes instantly without reloading the page.

- **Template Support**:
  - Start with pre-designed templates and customize them to fit your needs.

---

## Why the Project is Useful

- **Simplifies Banner Creation**:
  - No need for advanced coding skills—design banners with ease.
- **Saves Time**:
  - Quickly create and customize banners without starting from scratch.
- **Ensures Responsiveness**:
  - Design banners that look great on all devices.
- **Promotes Consistency**:
  - Use templates to maintain a consistent look and feel across campaigns.
- **Open Source**:
  - Free to use, modify, and contribute to.

---

## How Users Can Get Started with the Project

### Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Git**

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/konyhea/Web-App-for-interactive-banner-design.git
   cd web-App-interactive-Banner-Design

   ```

2. **Install Dependencies:**:

   ```bash
    npm install

   ```

3. **Run the Development Server:**:

   ```bash
    npm run dev


   ```

4. **Run the test:**:

   ```bash
    npm run test


   ```

5. **Open the Application:**:
   Visit http://localhost:3000 in your browser to view the app.

---

## Cloudinary Setup (For Image Uploads)

To enable image upload functionality in the banner editor, you'll need to:

### 1. Create a Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com/users/register_free) and sign up for a free account
2. Verify your email address if required

### 2. Get Your API Credentials

1. From your Cloudinary dashboard, note your:
   - Cloud Name (shown in dashboard header)
   - API Key (under Account Details)
2. Create an upload preset:
   - Go to Settings → Upload
   - Under "Upload presets", click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Click "Save"

### 3. Configure Environment Variables

Create a `.env` file in your project root with these variables (use your actual credentials):

        ```env
        VITE_CLOUDINARY_API_KEY=your_api_key_here
        VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
        VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name_here


## Using the Application

1. **Choose a Template**:
   - Select a pre-designed banner template to start.

2. **Customize the Banner**:
   - Use the interactive controls to modify text, colors, images, and other properties.

3. **Preview the Banner**:
   - View the banner in real-time and test its responsiveness.





## Technologies Used
- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**:  CSS Modules
- **Testing**: Jest + React Testing Library
- **Version Control**: Git


---

## License
This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
```
