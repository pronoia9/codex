import { useState, useEffect } from 'react';
import axios from 'axios';

import { Loader, Messages, Navbar, SidebarLeft, SidebarRight } from './components';

function App() {
  const [tags, setTags] = useState('');
  const [links, setLinks] = useState('');
  const [poem, setPoem] = useState('');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  // Check if theres data in local storage, if not fetch data
  useEffect(() => {
    const prevTags = localStorage.getItem('codexTags');
    const prevLinks = localStorage.getItem('codexLinks');
    const prevPoem = localStorage.getItem('codexPoem');
    !prevLinks && fetchLinks();
    !prevTags && fetchTags();
    !prevPoem && fetchPoem();
    if (!tags || !links || !poem) {
      setTimeout(() => { !tags && setTags(prevTags); }, 2000);
      setTimeout(() => { !links && setLinks(prevLinks); }, 2000);
      setTimeout(() => { !tags && setPoem(prevPoem); }, 2000);
    }
  }, []);

  // Once everythings fetched, check if the states have proper data, then cancel the loading screen
  useEffect(() => { setLoading(!(tags && links && poem)); }, [tags, links, poem]);

  // TAGS
  async function fetchTags() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_URL,
        { prompt: 'Get me the 5 trending twitter links and their tags in a json string format and remove whitespace' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setTags(response.data.bot.trim());
      localStorage.setItem('codexTags', response.data.bot.trim());
    } catch (error) {
      console.error(error);
      alert('There was an error fetching from OpenAI.');
    }
  }

  // LINKS
  async function fetchLinks() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_URL,
        { prompt: 'Give at least 7 links about programming and their title in a json string format and remove whitespace' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setLinks(response.data.bot.trim());
      localStorage.setItem('codexLinks', response.data.bot.trim());
    } catch (error) {
      console.error(error);
      alert('There was an error fetching from OpenAI.');
    }
  }

  // POEM
  async function fetchPoem() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_URL,
        { prompt: 'Give me a random short poem' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setPoem(response.data.bot.trim());
      localStorage.setItem('codexPoem', response.data.bot.trim());
      console.log('Finished fetching poems from Codex.');
    } catch (error) {
      console.error(error);
      alert('There was an error fetching from OpenAI.');
    }
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='app-skeleton'>
          <Navbar />
          <div className='app-container'>
            <SidebarLeft tags={tags} links={links} messages={messages} setMessages={setMessages} />
            <Messages messages={messages} setMessages={setMessages} />
            <SidebarRight poem={poem} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
