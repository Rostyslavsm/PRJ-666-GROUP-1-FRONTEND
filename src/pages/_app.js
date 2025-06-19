import '../styles/globals.css';
import '../styles/sidebar.css';
import '../styles/mobile-nav.css';
import '../styles/layout.css';
import '../styles/profile.css';
import '../styles/courses.css';
import '../styles/events.css';
import '../styles/auth.css';
import '../styles/notfound.css';
import '../styles/calendar.css';
import '../styles/modal.css';
import '../styles/tabs.css';
import '../styles/tips.css';
import '../styles/avatar.css';
import '../styles/goals.css';
import '../styles/SmartTodoContent.css';
import '../features/auth/lib/amplifyClient';
import { AuthProvider } from '../features/auth';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
