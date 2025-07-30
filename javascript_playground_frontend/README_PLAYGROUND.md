# JavaScript Playground Frontend

A modern React-based frontend for the JavaScript playground application that provides an interactive code editor with real-time execution capabilities.

## Features

### 🎯 Core Features
- **Live Code Editor**: Monaco Editor with JavaScript syntax highlighting and autocomplete
- **Real-time Execution**: Execute JavaScript code instantly and see results
- **User Authentication**: Complete sign up, sign in, and sign out functionality
- **Code Snippet Management**: Save, edit, delete, and organize code snippets
- **Share Functionality**: Generate shareable links for code snippets
- **Execution History**: View and replay previous code executions with statistics

### 🎨 UI/UX Features
- **Modern Design**: Clean, responsive interface with light theme
- **Split View Layout**: Editor pane on the left, output panel on the right
- **Mobile Responsive**: Optimized for mobile and tablet devices
- **Intuitive Navigation**: Easy-to-use navigation with clear visual feedback

### 🔧 Technical Features
- **React 18**: Built with the latest React version
- **React Router**: Client-side routing for seamless navigation
- **Axios Integration**: HTTP client for API communication
- **Monaco Editor**: Professional code editor (VS Code editor)
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during API operations

## Architecture

### Component Structure
```
src/
├── App.js                 # Main application component with routing
├── App.css               # Global styles and theme variables
├── components/
│   ├── Navbar.js         # Navigation bar with auth controls
│   ├── AuthForm.js       # Authentication (sign in/up) form
│   ├── CodeEditor.js     # Main code editor with execution
│   ├── SnippetManager.js # Snippet CRUD operations
│   ├── ExecutionHistory.js # View execution history & stats
│   └── SharedSnippet.js  # Public snippet viewer
```

### Key Features Implementation

#### 1. Code Editor (CodeEditor.js)
- **Monaco Editor Integration**: Professional code editing experience
- **Real-time Execution**: Execute JavaScript code with output display
- **Snippet Management**: Save and load code snippets
- **Error Handling**: Display execution errors and success states
- **Share Functionality**: Generate and copy shareable links

#### 2. Authentication (AuthForm.js)
- **Dual Mode**: Toggle between sign in and sign up
- **Form Validation**: Client-side validation with error messages
- **JWT Token Management**: Automatic token storage and headers
- **Error Handling**: User-friendly error messages

#### 3. Snippet Management (SnippetManager.js)
- **CRUD Operations**: Create, read, update, delete snippets
- **Grid Layout**: Visual card-based snippet display
- **Quick Actions**: Edit, share, delete with confirmation
- **Metadata Display**: Creation date, visibility status

#### 4. Execution History (ExecutionHistory.js)
- **Paginated History**: Load execution history with pagination
- **Statistics Dashboard**: Execution stats and metrics
- **Code Replay**: Copy and reuse previous code
- **Visual Feedback**: Color-coded success/error states

#### 5. Shared Snippets (SharedSnippet.js)
- **Public Access**: View shared snippets without authentication
- **Read-only Editor**: Display code with syntax highlighting
- **Execution Capability**: Run shared code snippets
- **Copy Functionality**: Copy code to clipboard

## API Integration

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/profile` - Get user profile

### Code Execution Endpoints
- `POST /api/execute` - Execute JavaScript code
- `GET /api/execute/history` - Get execution history
- `GET /api/execute/stats` - Get execution statistics

### Snippet Management Endpoints
- `GET /api/snippets` - Get user snippets
- `POST /api/snippets` - Create new snippet
- `GET /api/snippets/:id` - Get specific snippet
- `PUT /api/snippets/:id` - Update snippet
- `DELETE /api/snippets/:id` - Delete snippet
- `GET /api/snippets/share/:token` - Get shared snippet

## Design System

### Color Palette
- **Primary**: #1976d2 (Blue)
- **Secondary**: #424242 (Gray)
- **Accent**: #ffb300 (Amber)
- **Success**: #4caf50 (Green)
- **Error**: #f44336 (Red)

### Layout
- **Editor Layout**: Split-pane design (50/50)
- **Responsive Breakpoint**: 768px for mobile layout
- **Mobile Layout**: Stacked vertical layout
- **Navigation**: Fixed top navigation bar

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', etc.)
- **Code Font**: Monospace (Monaco, 'Courier New')
- **Font Sizes**: 12px-24px range with consistent scaling

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on port 3001

### Installation
```bash
npm install
```

### Development
```bash
npm start
```
Runs on port 3000 (or alternative if occupied)

### Build
```bash
npm run build
```

### Environment Variables
Create a `.env` file:
```
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_SITE_URL=http://localhost:3000
```

## Usage

### For Users
1. **Sign Up/Sign In**: Create account or log in
2. **Write Code**: Use the Monaco editor to write JavaScript
3. **Execute**: Click "Run Code" to see results
4. **Save Snippets**: Save code for later use
5. **Share**: Generate links to share code with others
6. **View History**: Check execution history and statistics

### For Developers
1. **Component Structure**: Each feature is a separate component
2. **State Management**: React hooks for local state
3. **API Integration**: Axios for HTTP requests
4. **Error Handling**: Try-catch blocks with user feedback
5. **Responsive Design**: CSS Grid and Flexbox

## Contributing

### Code Style
- Use functional components with hooks
- Follow React best practices
- Add PropTypes for type checking
- Include JSDoc comments for public functions
- Use semantic HTML and ARIA labels

### Adding Features
1. Create component in `src/components/`
2. Add route in `App.js` if needed
3. Update navigation in `Navbar.js`
4. Add styles in `App.css`
5. Test functionality thoroughly

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend allows frontend origin
2. **API Connection**: Check `REACT_APP_API_BASE_URL` environment variable
3. **Authentication**: Verify JWT token is stored in localStorage
4. **Monaco Editor**: Ensure Monaco Editor loads properly

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and React DevTools support.

## Performance

### Optimization
- Code splitting with React.lazy (future enhancement)
- Monaco Editor lazy loading
- Efficient re-renders with React.memo
- Proper dependency arrays in useEffect hooks

### Bundle Analysis
```bash
npm run build
npm install -g serve
serve -s build
```

## Security

### Client-side Security
- Input validation before API calls
- XSS prevention through React's built-in protection
- JWT token stored in localStorage (consider httpOnly cookies for production)
- Environment variables for sensitive configuration

### Best Practices
- Always validate user input
- Handle authentication errors gracefully
- Implement proper error boundaries
- Use HTTPS in production

---

Built with ❤️ using React, Monaco Editor, and modern web technologies.
