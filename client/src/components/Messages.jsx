import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { unionBy } from 'lodash';

import { generateUniqueId, getTimestamp } from '../utils/utils';

const Message = ({ id, message, from, time }) => {
  return (
    <div className={`message${from == 'Codex' ? ' message-ai' : ''}`} id={id}>
      <div className='message__body'>{message}</div>
      <div className='message__footer'>
        <span className='message__authoring'>
          {from}
          {time}
        </span>
      </div>
    </div>
  );
};

const Messages = ({ messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [fetched, setFetched] = useState(false);
  let lastUid = useRef(), loadInterval = useRef(), typingInterval = useRef();

  const addMessage = (id, from, message, time) => {
    setMessages((messages) => [...messages, { id, from, message, time }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim().length) return alert('You gotta type something you know...');

    let lastInput = input; // Save the input for axios post since itll be cleared after adding the message
    lastUid.current = generateUniqueId(); // Save the bot's unique id

    addMessage(generateUniqueId(), 'An Awesome User', input, getTimestamp(new Date())); // Add user's message
    setInput(''); // Reset user input/textarea

    addMessage(lastUid.current, 'Codex', ' ', ''); // Add empty message for bot
    setLoading(lastUid.current); // Set loading to bots id to useEffect and load the typing ...s

    // Fetch AI's response
    try {
      const response = await axios.post(
        import.meta.env.VITE_URL,
        { prompt: lastInput || "I can't be bothered to fetch and waste my OpenAI free plan..." },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setFetched(response.data.bot.trim());
    } catch (error) {
      console.error(error);
      alert('There was an error getting a response from OpenAI.');
    }
  };

  useEffect(() => {
    if (loading) {
      loadInterval.current = setInterval(() => {
        setMessages(
          messages.map((msg) => {
            if (msg.id === lastUid.current) msg.message.includes('...') ? (msg.message = ' ') : (msg.message += '.');
            return msg;
          })
        );
      }, 300);
    } else {
      clearInterval(loadInterval.current);
      if (messages.length) {
        setMessages(
          messages?.map((msg) => {
            if (msg.id === lastUid.current) msg.message = ''; // Reset any lingering .s on the no longer loading message
            return msg;
          })
        );
      }
    }
  }, [loading]);

  useEffect(() => {
    if (fetched) {
      setLoading(false); // Once fetched is set, stop loading the ...s
      setTyping(fetched); // and start "typing" the fetched message instead
    }
    return setFetched(false);
  }, [fetched]);

  useEffect(() => {
    let i = 0;
    if (typing) {
      typingInterval.current = setInterval(() => {
        if (i < typing.length) {
          setMessages(
            messages.map((msg) => {
              if (msg.id === lastUid.current) msg.message += typing.charAt(i);
              return msg;
            })
          );
          i++;
        } else {
          clearInterval(typingInterval.current); // Once all the chars are added, stop the interval
          setMessages(
            messages.map((msg) => {
              if (msg.id === lastUid.current) msg.time = getTimestamp(new Date());
              return msg;
            })
          );
          lastUid.current = false;
        }
      }, 10);
    }
    return setTyping(false); // Set typing to false once done
  }, [typing]);

  useEffect(() => {
    // Saves messages whenever theyre updated (without the minor changes aka loading/typing)
    if (messages.length && !lastUid.current) {
      const prev = localStorage.getItem('codexMessages');
      localStorage.setItem('codexMessages', prev?.length ? JSON.stringify(unionBy(JSON.parse(prev), messages, 'id')) : JSON.stringify(messages));
    }
  }, [messages]);

  return (
    <div className='app-main'>
      <div className='channel-feed'>
        {/* Only Visual Not Functional */}
        <MessagesTopBar />

        {/* Messages Area */}
        <div id='chat_container' className='channel-feed__body'>
          {messages?.map((msg) => (
            <Message key={msg.id} {...msg} />
          ))}
        </div>

        {/* Input / Send Message */}
        <div className='channel-feed__footer'>
          <form className='channel-message-form' onSubmit={(e) => handleSubmit(e)}>
            <div className='form-group'>
              <label className='form-label' htmlFor='message'>
                Message
              </label>
              <div className='form-control'>
                <textarea
                  id='message'
                  className='form-control'
                  name='message'
                  placeholder='Ask Codex...'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.keyCode == 13 && !e.shiftKey) handleSubmit(e);
                  }}></textarea>
              </div>
            </div>
            <div className='form-footer'>
              <button className='button button--primary button--size-xl' type='submit'>
                <span className='button__content'>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;

function MessagesTopBar() {
  return (
    <div className='segment-topbar'>
      {/* Fake Text */}
      <div className='segment-topbar__header'>
        <span className='segment-topbar__overline segment-topbar__overline'>
          NetWire_Seed: d869db7fe62fb07c25a0403ecaea55031744b5fb
        </span>
        <h4 className='text-heading4 segment-topbar__title'>
          <span className='channel-link'>
            <span className='channel-link__icon'>#</span>
            <span className='channel-link__element'>OpenAI</span>
          </span>
        </h4>
      </div>
      {/* Icons / Fake Buttons */}
      <div className='segment-topbar__aside'>
        <div className='button-toolbar'>
          {/* Bell Icon */}
          <p className='button button--default'>
            <svg className='button__icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M18 9.5c2.481 0 4.5 1.571 4.5 3.503 0 1.674-1.703 3.48-4.454 3.48-.899 0-1.454-.156-2.281-.357-.584.358-.679.445-1.339.686.127-.646.101-.924.081-1.56-.583-.697-1.007-1.241-1.007-2.249 0-1.932 2.019-3.503 4.5-3.503zm0-1.5c-3.169 0-6 2.113-6 5.003 0 1.025.37 2.032 1.023 2.812.027.916-.511 2.228-.997 3.184 1.302-.234 3.15-.754 3.989-1.268.709.173 1.388.252 2.03.252 3.542 0 5.954-2.418 5.954-4.98.001-2.906-2.85-5.003-5.999-5.003zm-.668 6.5h-1.719v-.369l.938-1.361v-.008h-.869v-.512h1.618v.396l-.918 1.341v.008h.95v.505zm3.035 0h-2.392v-.505l1.306-1.784v-.011h-1.283v-.7h2.25v.538l-1.203 1.755v.012h1.322v.695zm-10.338 9.5c1.578 0 2.971-1.402 2.971-3h-6c0 1.598 1.45 3 3.029 3zm.918-7.655c-.615-1.001-.947-2.159-.947-3.342 0-3.018 2.197-5.589 5.261-6.571-.472-1.025-1.123-1.905-2.124-2.486-.644-.374-1.041-1.07-1.04-1.82v-.003c0-1.173-.939-2.123-2.097-2.123s-2.097.95-2.097 2.122v.003c.001.751-.396 1.446-1.041 1.82-4.667 2.712-1.985 11.715-6.862 13.306v1.749h9.782c.425-.834.931-1.764 1.165-2.655zm-.947-15.345c.552 0 1 .449 1 1 0 .552-.448 1-1 1s-1-.448-1-1c0-.551.448-1 1-1z'></path>
            </svg>
          </p>
          {/* Filter Icon */}
          <p className='button button--default'>
            <svg className='button__icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M6 16h-6v-3h6v3zm-2-5v-10h-2v10h2zm-2 7v5h2v-5h-2zm13-7h-6v-3h6v3zm-2-5v-5h-2v5h2zm-2 7v10h2v-10h-2zm13 3h-6v-3h6v3zm-2-5v-10h-2v10h2zm-2 7v5h2v-5h-2z'></path>
            </svg>
          </p>
          {/* Settings/More Icon */}
          <p className='button button--default'>
            <svg className='button__icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z'></path>
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
};