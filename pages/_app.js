import '../styles/reset.css';
import '../styles/main.css';

// This default export is required in a new `pages/_app.js` file.
export default function App({ Component, pageProps }) {
  return (
    <div
      className="single-page-container" >
      <Component {...pageProps} />
    </div>
  );
}
