# DesignPulse

DesignPulse is a modern, AI-powered e-commerce platform that revolutionizes custom product design. Built with React, it allows users to generate unique designs using artificial intelligence, browse and purchase products, manage orders, and more. The platform features an intuitive admin panel for managing users and orders, user authentication, and a responsive design for seamless experiences across devices.

## Features

- **AI Design Studio**: Generate custom designs with AI, adjust styles, colors, compositions, brightness, contrast, and saturation.
- **E-commerce Shop**: Browse products, view details, buy items, create new products, update existing ones, and manage inventory.
- **User Management**: Register, login, and manage user roles (admin/user).
- **Admin Panel**: View and manage orders, users, and order details.
- **Email Integration**: Contact form to send emails directly from the app.
- **Responsive Design**: Built with Bootstrap for mobile-first, responsive layouts.
- **Product Customization**: Overlay designs on products, save captured images, and manage stock by size.

## Tech Stack

- **Frontend**: React 19, React Router DOM for routing
- **UI Framework**: Bootstrap 5.3.5
- **HTTP Client**: Axios for API calls
- **Additional Libraries**:
  - html2canvas: For capturing and saving images
  - react-draggable: For draggable UI components
  - react-router-dom: For client-side routing
- **Build Tool**: Create React App
- **Backend**: Assumed to be running on `http://localhost:8080` (Spring Boot or similar, based on API calls)

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080` (not included in this repo)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd designpulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The app will run on [http://localhost:3000](http://localhost:3000).

## Usage

1. **Home Page**: Explore the platform's features and contact form.
2. **Authentication**: Register or login to access user-specific features.
3. **Shop**: Browse products, view details, and make purchases.
4. **AI Design Studio**: Generate and customize designs for products.
5. **Admin Panel** (Admin users only): Manage orders, users, and system settings.
6. **Product Management**: Create, update, and manage product inventory.

### API Endpoints

The frontend communicates with a backend API. Key endpoints include:

- **Users**: `/api/users/login`, `/api/users` (register assumed)
- **Products**: `/api/products`, `/api/products/{id}`, `/api/products/create`, etc.
- **Orders**: `/api/orders`, `/api/orders/{id}`, `/api/orders/create`
- **IA (AI)**: `/api/ia/generate`, `/api/design/product/{id}/saveImage`
- **Email**: `/api/email/send` (assumed based on service)

Ensure the backend is running and accessible at `http://localhost:8080`.

## Project Structure

```
src/
├── Components/          # Reusable UI components (Navbar, IA Window, etc.)
├── Pages/               # Page components (Home, Shop, Admin, etc.)
├── Routes/              # Routing configuration
├── Services/            # API service functions
├── Styles/              # CSS files for styling
├── Assets/              # Static assets
└── ...
```

## Available Scripts

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production.
- `npm run eject`: Ejects from Create React App (irreversible).

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
