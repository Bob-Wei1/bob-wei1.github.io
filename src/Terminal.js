import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const ASCII = `
  o__ __o                  o                o              o                  o   
 <|     v\                <|>              <|>            <|>               _<|>_ 
 / \\     <\\               / >              / \\            / \\                     
 \\o/     o/    o__ __o    \\o__ __o         \\o/            \\o/    o__  __o     o   
  |__  _<|    /v     v\\    |     v\\         |              |    /v      |>   <|>  
  |       \\  />       <\\  / \\     <\\       < >            < >  />      //    / \\  
 <o>      /  \\         /  \\o/      /        \\o    o/\\o    o/   \\o    o/      \\o/  
  |      o    o       o    |      o          v\\  /v  v\\  /v     v\\  /v __o    |   
 / \\  __/>    <\\__ __/>   / \\  __/>           <\\/>    <\\/>       <\\/> __/>   / \\  
                                                                                   
`;

const WELCOME = `Welcome to Bob Wei's terminal. \nCE+Robotics @ Michigan, CTO @ Embedder, Embedded SWE @ Tesla.\nType help to get started. Or type exit for web version.\n\n`;

const HELP = [
  { cmd: 'help', desc: `list all commands (you're looking at it)` },
  { cmd: 'whois bob', desc: 'learn about me' },
  { cmd: 'resume', desc: 'my resume' },
  { cmd: 'linkedin', desc: 'my linkedin' },
  { cmd: 'email', desc: 'reach out to me' },
  { cmd: 'twitter', desc: 'twitter accounts' },
  { cmd: 'instagram', desc: 'instagram account' },
  { cmd: 'embedder', desc: 'check out how we are modernizing embedded software' },
  { cmd: 'git', desc: 'this repo' },
  { cmd: 'github', desc: 'all repos' },
  { cmd: 'locate', desc: 'physical address' },
  { cmd: 'test', desc: 'do not use' },
  { cmd: 'other', desc: 'try your fav commands (e.g. ls, groups, su)' },
];

const RESPONSES = {
  help: () => HELP.map(({ cmd, desc }) => (
    <div key={cmd}>
      <span className="terminal-help-cmd">{cmd.padEnd(18)}</span>
      <span className="terminal-help-desc">{desc}</span>
    </div>
  )),
  'whois bob': () => 'CE+Robotics @ Michigan, CTO @ Embedder, Embedded SWE @ Tesla',
  linkedin: () => <span>LinkedIn: <a className="terminal-link" href="https://www.linkedin.com/in/jiachew/" target="_blank" rel="noopener noreferrer">linkedin.com/in/jiachew</a></span>,
  email: () => <span>Email me at <a className="terminal-link" href="mailto:jiachew@umich.edu">jiachew@umich.edu</a></span>,
  twitter: () => <span>Twitter: <a className="terminal-link" href="https://twitter.com/bobwei" target="_blank" rel="noopener noreferrer">@bobwei</a></span>,
  instagram: () => <span>Instagram: <a className="terminal-link" href="https://www.instagram.com/bob_wei1/" target="_blank" rel="noopener noreferrer">@bob_wei1</a></span>,
  git: () => <span>Repo: <a className="terminal-link" href="https://github.com/Bob-Wei1" target="_blank" rel="noopener noreferrer">github.com/Bob-Wei1</a></span>,
  github: () => <span>All repos: <a className="terminal-link" href="https://github.com/Bob-Wei1" target="_blank" rel="noopener noreferrer">github.com/Bob-Wei1</a></span>,
  locate: () => 'Address: your mom\'s house, SF, CA',
  embedder: () => window.location.assign('https://www.embedder.dev/'),
  test: () => 'Command disabled.',
  other: () => 'Try commands like ls, groups, su (not all are supported).',
  exit: () => window.location.assign('https://motherfuckingwebsite.com/'),
  resume: () => window.location.assign(process.env.PUBLIC_URL + '/Jiachen_wei_Resume__fall_2025_.pdf'),
  groups: () => <span>V1@michigan</span>,
};

function parseCommand(input) {
  const trimmed = input.trim().toLowerCase();
  if (trimmed === '') return '';
  if (RESPONSES[trimmed]) return RESPONSES[trimmed]();
  if (trimmed.startsWith('whois ')) return RESPONSES['whois root']();
  if (trimmed.startsWith('tldr ')) return 'Portfolio company info not found.';
  return `Command not found: ${input}`;
}

export default function Terminal() {
  const [history, setHistory] = useState([
    { type: 'ascii', value: ASCII },
    { type: 'output', value: WELCOME },
    { type: 'output', value: '' },
    { type: 'prompt', value: '' },
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      const cmd = input;
      let output = parseCommand(cmd);
      setHistory((h) => [
        ...h.slice(0, -1),
        { type: 'prompt', value: cmd },
        { type: 'output', value: output },
        { type: 'prompt', value: '' },
      ]);
      setInput('');
    }
  };

  return (
    <div className="Terminal">
      {history.map((item, idx) => {
        if (item.type === 'ascii')
          return <pre className="terminal-ascii" key={idx}>{item.value}</pre>;
        if (item.type === 'output')
          return <div className="terminal-output" key={idx}>{item.value}</div>;
        if (item.type === 'prompt')
          return (
            <div className="terminal-output" key={idx}>
              <span className="terminal-prompt-user">guest</span>
              <span className="terminal-prompt">:rootpc</span>
              <span className="terminal-prompt-symbol"> ~ $ </span>
              {idx === history.length - 1 ? (
                <input
                  className="terminal-input"
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleInput}
                  autoFocus
                  spellCheck={false}
                />
              ) : (
                <span>{item.value}</span>
              )}
            </div>
          );
        return null;
      })}
      <div ref={bottomRef} />
    </div>
  );
} 