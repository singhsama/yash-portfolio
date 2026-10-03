import Nav from "./Nav";
import Hero from "./Hero";
import Capabilities from "./Capabilities";
import Work from "./Work";
import Articles from "./Articles";
import Bookshelf from "./Bookshelf";
import Connect, { Dock } from "./Connect";
import Footer from "./Footer";
import Spotlight from "./Spotlight";

/** The whole page. A server component that renders client islands. */
export default function Site() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to content
      </a>
      <Spotlight />
      <Nav />
      <main id="main" className="relative isolate overflow-x-clip">
        <Hero />
        <Capabilities />
        <Work />
        <Articles />
        <Bookshelf />
        <Connect />
      </main>
      <Footer />
      <Dock />
    </>
  );
}
