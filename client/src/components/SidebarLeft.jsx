import { useState, useEffect } from 'react';

const SidebarSectionItem = ({ type, url, title }) => {
  return (
    <li className='nav__item'>
      <a className='nav__link' href={url} target='_blank'>
        <span className={`${type == 'tag' ? 'channel' : 'conversation'}-link`}>
          <span className={`${type == 'tag' ? 'channel' : 'conversation'}-link__icon`}>{type == 'tag' ? '#' : ' '}</span>
          <span className={`${type == 'tag' ? 'channel' : 'conversation'}-link__element`}>{title}</span>
        </span>
      </a>
    </li>
  );
};

const SidebarSection = ({ type, title, children }) => {
  return (
    <div className={`nav-section nav-${type}`}>
      <div className='nav-section__header'>
        <h2 className='nav-section__title'>{title}</h2>
      </div>
      <div className='nav-section__body'>
        <ul className='nav'>{children}</ul>
      </div>
    </div>
  );
};

const SidebarLeft = ({ tags, links, messages, setMessages }) => {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const prev = localStorage.getItem('codexMessages');
    (prev && messages) && setPending(messages.length !== JSON.parse(prev).length);
  }, [])

  const loadPreviousMessages = () => {
    const prev = localStorage.getItem('codexMessages');
    if (prev) setMessages(JSON.parse(prev));
    setPending(false);
  };

  return (
    <div className='app-a'>
      <div className='segment-topbar'>
        <div className='segment-topbar__header'>
          <h3 className='text-heading3 segment-topbar__title'>Messages</h3>
        </div>
        <div className='segment-topbar__aside'>
          <div className='button-toolbar'>
            <button
              className={`button button--primary button--size-lg${pending ? ' button-pending' : ''}`}
              onClick={loadPreviousMessages}>
              <svg className='button__icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z'></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className='form-search'>
        <div className='form-group'>
          <div className='form-control form-control--with-addon'>
            {/* <input name="query" placeholder="Search..." type="text" /> */}
            <div className='form-control__addon form-control__addon--prefix'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M21.172 24l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z'></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <SidebarSection
        type='tags'
        title='Trending'
        children={
          tags?.length &&
          Object.values(JSON.parse(tags)).map(({ url, tags }) => (
            <SidebarSectionItem type='tag' url={url} title={tags[0]} key={tags[0]} />
          ))
        }
      />

      <SidebarSection
        type='links'
        title='Links'
        children={
          links?.length &&
          Object.values(JSON.parse(links.trim()))
            .slice(4)
            .map((link, i, links) => {
              if (!(i % 2)) return <SidebarSectionItem type='link' url={links} title={links[i + 1]} key={links[i + 1]} />;
            })
        }
      />
    </div>
  );
};

export default SidebarLeft;
