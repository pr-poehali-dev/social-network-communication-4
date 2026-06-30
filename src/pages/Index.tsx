import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const AVATAR = 'https://cdn.poehali.dev/projects/711ac42f-25c6-4d87-bc4c-13696c06d5cd/files/33947bdc-6266-4afc-af72-a4d08eed7efc.jpg';
const GOLD_CARD = 'https://cdn.poehali.dev/projects/711ac42f-25c6-4d87-bc4c-13696c06d5cd/files/1dd043a1-7e1b-44c0-9818-ddee01634d7d.jpg';
const IMG1 = 'https://cdn.poehali.dev/projects/711ac42f-25c6-4d87-bc4c-13696c06d5cd/files/2feb6456-edd7-432c-b4a9-f4046f206ad4.jpg';
const IMG2 = 'https://cdn.poehali.dev/projects/711ac42f-25c6-4d87-bc4c-13696c06d5cd/files/02d30949-ec48-466b-99fa-3a87a6603cd7.jpg';

const NAV = [
  { icon: 'Sparkles', label: 'Лента' },
  { icon: 'MessageCircle', label: 'Сообщения' },
  { icon: 'Users', label: 'Группы' },
  { icon: 'Image', label: 'Галерея' },
  { icon: 'Gamepad2', label: 'Игры' },
  { icon: 'Laugh', label: 'Мемы' },
  { icon: 'Search', label: 'Поиск' },
  { icon: 'Bell', label: 'Уведомления' },
];

type Post = { id: number; name: string; tag: string; color: string; text: string; likes: number; comments: number; badge: string; liked?: boolean };

const INITIAL_POSTS: Post[] = [
  { id: 1, name: 'Луна Векторова', tag: '@vector_moon', color: '#FF3CAC', text: 'Сегодня собрала золотую карточку и открыла нейросеть CAF! Теперь генерирую целые миры одной мыслью ✨', likes: 482, comments: 37, badge: '🥇 Золотая карта' },
  { id: 2, name: 'Кирилл Пиксель', tag: '@pixel_kir', color: '#00F0FF', text: 'Новый мем разлетелся на 12к репостов за ночь. Творчество живёт, друзья!', likes: 1290, comments: 211, badge: '🔥 В тренде' },
  { id: 3, name: 'Ная Сторм', tag: '@storm_naya', color: '#CCFF00', text: 'Создала сообщество для тех, кто рисует на грани сна. Заходите, нас уже 340 ✦', likes: 256, comments: 48, badge: '✦ Новое комьюнити' },
];

const GAMES = [
  { name: 'Космо-Дуэль', icon: 'Rocket', reward: 'Обычная карта', glow: '#7B2FF7' },
  { name: 'Неон-Гонка', icon: 'Zap', reward: 'Редкая карта', glow: '#00F0FF' },
  { name: 'Битва Мемов', icon: 'Swords', reward: 'Эпик карта', glow: '#FF3CAC' },
  { name: 'Золотой Куб', icon: 'Crown', reward: '🥇 Золотая → CAF', glow: '#FFD600' },
];

const CARD_POOL = [
  { rarity: 'Обычная', emoji: '🎴', color: '#9CA3AF' },
  { rarity: 'Редкая', emoji: '💠', color: '#00F0FF' },
  { rarity: 'Эпическая', emoji: '🔮', color: '#FF3CAC' },
  { rarity: 'Золотая', emoji: '🥇', color: '#FFD600' },
];

type Message = { id: number; from: string; color: string; preview: string; time: string; unread: number };
const MESSAGES: Message[] = [
  { id: 1, from: 'Луна Векторова', color: '#FF3CAC', preview: 'Привет! Видела твой последний пост — огонь 🔥', time: '12:41', unread: 2 },
  { id: 2, from: 'Кирилл Пиксель', color: '#00F0FF', preview: 'Скинь ту карточку, которую вчера нашёл?', time: '11:03', unread: 0 },
  { id: 3, from: 'Ная Сторм', color: '#CCFF00', preview: 'Заходи в группу «Сны на границе» ✦', time: 'вчера', unread: 5 },
  { id: 4, from: 'Арт-Клуб NEBULA', color: '#7B2FF7', preview: 'Новый конкурс мемов стартовал!', time: 'вчера', unread: 1 },
];

type Group = { id: number; name: string; members: number; color: string; emoji: string; joined: boolean };
const INITIAL_GROUPS: Group[] = [
  { id: 1, name: 'Сны на границе', members: 340, color: '#CCFF00', emoji: '🌙', joined: false },
  { id: 2, name: 'Неон Арт', members: 1820, color: '#FF3CAC', emoji: '🎨', joined: true },
  { id: 3, name: 'Мем-лаборатория', members: 5600, color: '#00F0FF', emoji: '😂', joined: false },
  { id: 4, name: 'CAF Избранные', members: 88, color: '#FFD600', emoji: '🥇', joined: false },
  { id: 5, name: 'Космо-Дуэлянты', members: 2100, color: '#7B2FF7', emoji: '🚀', joined: true },
  { id: 6, name: 'Фото-Вселенная', members: 910, color: '#FF3CAC', emoji: '📸', joined: false },
];

type Photo = { id: number; src: string; title: string; likes: number };
const GALLERY: Photo[] = [
  { id: 1, src: IMG1, title: 'Неоновый город', likes: 312 },
  { id: 2, src: IMG2, title: 'Космический сон', likes: 540 },
  { id: 3, src: GOLD_CARD, title: 'Золотая карта', likes: 888 },
  { id: 4, src: IMG1, title: 'Геометрия нова', likes: 220 },
  { id: 5, src: IMG2, title: 'Пурпурная туманность', likes: 174 },
  { id: 6, src: GOLD_CARD, title: 'Легенда CAF', likes: 999 },
];

type Notif = { id: number; icon: string; color: string; text: string; time: string; read: boolean };
const INITIAL_NOTIFS: Notif[] = [
  { id: 1, icon: 'Heart', color: '#FF3CAC', text: 'Луна Векторова лайкнула твой пост', time: '2 мин назад', read: false },
  { id: 2, icon: 'UserPlus', color: '#00F0FF', text: 'Кирилл Пиксель подписался на тебя', time: '15 мин назад', read: false },
  { id: 3, icon: 'MessageCircle', color: '#7B2FF7', text: 'Ная Сторм прокомментировала твой пост', time: '1 час назад', read: false },
  { id: 4, icon: 'Crown', color: '#FFD600', text: 'Ты получил золотую карту CAF! Нейросеть разблокирована', time: '3 часа назад', read: true },
  { id: 5, icon: 'Users', color: '#CCFF00', text: 'Тебя пригласили в группу «Мем-лаборатория»', time: 'вчера', read: true },
];

const CONTACT_SUGGESTIONS = [
  { name: 'Луна Векторова', tag: '@vector_moon', color: '#FF3CAC' },
  { name: 'Кирилл Пиксель', tag: '@pixel_kir', color: '#00F0FF' },
  { name: 'Ная Сторм', tag: '@storm_naya', color: '#CCFF00' },
  { name: 'Рей Квант', tag: '@rey_quantum', color: '#7B2FF7' },
  { name: 'Зора Флэш', tag: '@zora_flash', color: '#FFD600' },
];

const GROUP_EMOJIS = ['🌙','🎨','🚀','🔥','✦','💠','🎭','🌈','⚡','🎲'];
const GROUP_COLORS = ['#CCFF00','#FF3CAC','#00F0FF','#7B2FF7','#FFD600'];

export default function Index() {
  const [active, setActive] = useState('Лента');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [contacts, setContacts] = useState<typeof CONTACT_SUGGESTIONS>([]);
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const [activeChat, setActiveChat] = useState<Message | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ from: 'me' | 'them'; text: string }[]>([
    { from: 'them', text: 'Привет! Видела твой последний пост — огонь 🔥' },
  ]);

  const [postOpen, setPostOpen] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [memeOpen, setMemeOpen] = useState(false);
  const [memeText, setMemeText] = useState('');
  const [search, setSearch] = useState('');
  const [photoOpen, setPhotoOpen] = useState<Photo | null>(null);

  // Создание группы
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupEmoji, setGroupEmoji] = useState('🌙');
  const [groupColor, setGroupColor] = useState('#CCFF00');

  // Добавление контакта
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [contactSearch, setContactSearch] = useState('');

  const [playing, setPlaying] = useState(false);
  const [drawnCard, setDrawnCard] = useState<typeof CARD_POOL[number] | null>(null);
  const [cafUnlocked, setCafUnlocked] = useState(false);
  const [collection, setCollection] = useState(0);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const goSection = (label: string) => {
    setActive(label);
    if (label === 'Игры') document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
    else if (label === 'Лента') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (label === 'Мемы') setMemeOpen(true);
    else if (label === 'Поиск') document.getElementById('search-bar')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleLike = (id: number) => {
    setPosts((prev) => prev.map((p) =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p,
    ));
  };

  const publishPost = () => {
    if (!newPost.trim()) { toast.error('Напиши что-нибудь ✍️'); return; }
    setPosts((prev) => [
      { id: Date.now(), name: 'Ты', tag: '@me', color: '#CCFF00', text: newPost, likes: 0, comments: 0, badge: '🚀 Только что' },
      ...prev,
    ]);
    setNewPost('');
    setPostOpen(false);
    toast.success('Пост опубликован! 🎉');
  };

  const publishMeme = () => {
    if (!memeText.trim()) { toast.error('Добавь подпись к мему 😄'); return; }
    setPosts((prev) => [
      { id: Date.now(), name: 'Ты', tag: '@me', color: '#FF3CAC', text: `😂 МЕМ: «${memeText}»`, likes: 0, comments: 0, badge: '🎭 Свежий мем' },
      ...prev,
    ]);
    setMemeText('');
    setMemeOpen(false);
    toast.success('Мем отправлен в ленту! 🔥');
    setActive('Лента');
  };

  const playGame = (gameName: string) => {
    if (playing) return;
    setPlaying(true);
    setDrawnCard(null);
    const isGoldGame = gameName === 'Золотой Куб';
    setTimeout(() => {
      const roll = Math.random();
      let card;
      if (isGoldGame) card = roll < 0.4 ? CARD_POOL[3] : CARD_POOL[Math.floor(Math.random() * 3)];
      else card = roll < 0.05 ? CARD_POOL[3] : CARD_POOL[Math.floor(Math.random() * 3)];
      setDrawnCard(card);
      setCollection((c) => c + 1);
      setPlaying(false);
      if (card.rarity === 'Золотая') {
        if (!cafUnlocked) {
          setCafUnlocked(true);
          toast.success('🥇 ЗОЛОТАЯ КАРТА! Нейросеть CAF разблокирована!', { duration: 5000 });
        } else {
          toast.success('🥇 Ещё одна золотая карта в коллекцию!');
        }
      } else {
        toast(`${card.emoji} Выпала ${card.rarity.toLowerCase()} карта!`);
      }
    }, 1400);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { from: 'me', text: chatInput }]);
    const reply = chatInput;
    setChatInput('');
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { from: 'them', text: `Получила! «${reply}» — 🔥` }]);
    }, 1000);
  };

  const toggleGroup = (id: number) => {
    setGroups((prev) => prev.map((g) =>
      g.id === id ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 } : g,
    ));
    const g = groups.find((gr) => gr.id === id);
    if (g) toast(g.joined ? `Ты вышел из «${g.name}»` : `Ты вступил в «${g.name}» ${g.emoji}`);
  };

  const createGroup = () => {
    if (!groupName.trim()) { toast.error('Введи название группы'); return; }
    const newGroup: Group = {
      id: Date.now(), name: groupName, members: 1,
      color: groupColor, emoji: groupEmoji, joined: true,
    };
    setGroups((prev) => [newGroup, ...prev]);
    toast.success(`Группа «${groupName}» создана ${groupEmoji}`);
    setGroupName(''); setGroupDesc(''); setGroupEmoji('🌙'); setGroupColor('#CCFF00');
    setCreateGroupOpen(false);
  };

  const addContact = (c: typeof CONTACT_SUGGESTIONS[number]) => {
    if (contacts.find((x) => x.tag === c.tag)) { toast(`${c.name} уже в контактах`); return; }
    setContacts((prev) => [...prev, c]);
    toast.success(`${c.name} добавлен в контакты!`);
  };

  const readAllNotifs = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const filteredPosts = search.trim()
    ? posts.filter((p) => (p.text + p.name + p.tag).toLowerCase().includes(search.toLowerCase()))
    : posts;

  return (
    <div className="min-h-screen grain text-foreground overflow-x-hidden pb-24 lg:pb-0">
      <div className="pointer-events-none fixed -left-32 top-20 h-96 w-96 rounded-full bg-neon-violet/30 blur-[120px] animate-float" />
      <div className="pointer-events-none fixed right-0 top-1/2 h-80 w-80 rounded-full bg-neon-pink/20 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto flex max-w-[1400px] gap-6 px-4 py-6 lg:px-8">

        {/* SIDEBAR */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neon-lime animate-glow-pulse">
              <Icon name="Orbit" className="text-background" size={26} />
            </div>
            <span className="font-display text-2xl font-extrabold tracking-tight gradient-text">NEBULA</span>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => goSection(item.label)}
                className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3 text-left font-medium transition-all ${
                  active === item.label
                    ? 'bg-neon-lime text-background'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon name={item.icon} size={22} className="transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
                {item.label === 'Уведомления' && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-neon-pink text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl border border-border bg-card/60 p-5 backdrop-blur">
            <p className="font-hand text-2xl text-neon-cyan">{cafUnlocked ? 'CAF активен ✓' : 'CAF разблокирован?'}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {cafUnlocked ? 'Нейросеть открыта — твори миры!' : 'Поймай золотую карту в играх.'}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Карт: <span className="text-neon-lime font-bold">{collection}</span></p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">

          {/* === ЛЕНТА === */}
          {active === 'Лента' && (
            <>
              <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-border bg-card/50 p-8 backdrop-blur lg:p-12">
                <div className="absolute right-6 top-6 hidden rotate-12 font-hand text-3xl text-neon-pink sm:block">твоя вселенная ↗</div>
                <h1 className="font-display text-4xl font-black leading-[0.95] sm:text-6xl">
                  <span className="block">ТВОРИ.</span>
                  <span className="block gradient-text">ИГРАЙ.</span>
                  <span className="block text-stroke">ОБЩАЙСЯ.</span>
                </h1>
                <p className="mt-5 max-w-md text-lg text-muted-foreground">
                  Социальная сеть, где посты, мемы и игры с карточками превращаются в твою личную галактику.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={() => setPostOpen(true)} className="rounded-full bg-neon-lime px-7 py-3 font-display font-bold text-background transition-transform hover:scale-105">
                    Создать пост
                  </button>
                  <button onClick={() => goSection('Игры')} className="rounded-full border-2 border-neon-pink px-7 py-3 font-display font-bold text-neon-pink transition-colors hover:bg-neon-pink hover:text-white">
                    Играть →
                  </button>
                </div>
              </section>

              <div id="search-bar" className="mb-6 flex items-center gap-3 rounded-full border border-border bg-card/60 px-5 py-3 backdrop-blur focus-within:border-neon-cyan">
                <Icon name="Search" size={20} className="text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по постам..." className="w-full bg-transparent placeholder:text-muted-foreground focus:outline-none" />
                {search && <button onClick={() => setSearch('')}><Icon name="X" size={18} className="text-muted-foreground hover:text-neon-pink" /></button>}
              </div>

              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-display text-2xl font-extrabold">Лента активности</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-neon-violet to-transparent" />
              </div>
              <div className="flex flex-col gap-5">
                {filteredPosts.length === 0 && (
                  <p className="rounded-2xl border border-border bg-card/40 p-6 text-center text-muted-foreground">Ничего не найдено 🔍</p>
                )}
                {filteredPosts.map((post, i) => (
                  <article key={post.id} className="animate-fade-in rounded-[1.6rem] border border-border bg-card/60 p-6 backdrop-blur transition-all hover:border-neon-lime/50 hover:-translate-y-1"
                    style={{ animationDelay: `${Math.min(i, 4) * 100}ms` }}>
                    <div className="mb-4 flex items-center gap-3">
                      <img src={AVATAR} alt={post.name} className="h-12 w-12 rounded-2xl object-cover ring-2" style={{ '--tw-ring-color': post.color } as React.CSSProperties} />
                      <div className="flex-1">
                        <p className="font-display font-bold leading-tight">{post.name}</p>
                        <p className="text-sm text-muted-foreground">{post.tag}</p>
                      </div>
                      <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${post.color}22`, color: post.color }}>{post.badge}</span>
                    </div>
                    <p className="mb-4 text-[15px] leading-relaxed">{post.text}</p>
                    <div className="flex items-center gap-6 text-muted-foreground">
                      <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 transition-all hover:text-neon-pink ${post.liked ? 'text-neon-pink' : ''}`}>
                        <Icon name="Heart" size={19} className={post.liked ? 'fill-current' : ''} /> <span className="text-sm">{post.likes}</span>
                      </button>
                      <button onClick={() => toast('💬 Комментарии скоро откроются')} className="flex items-center gap-2 transition-colors hover:text-neon-cyan">
                        <Icon name="MessageCircle" size={19} /> <span className="text-sm">{post.comments}</span>
                      </button>
                      <button onClick={() => toast.success('🔗 Ссылка скопирована!')} className="flex items-center gap-2 transition-colors hover:text-neon-lime">
                        <Icon name="Share2" size={19} /> <span className="text-sm">Поделиться</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div id="games" className="mb-4 mt-10 flex items-center gap-3">
                <h2 className="font-display text-2xl font-extrabold">Игры и карточки</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan to-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {GAMES.map((g) => (
                  <button key={g.name} onClick={() => playGame(g.name)} disabled={playing}
                    className="group flex flex-col items-center gap-3 rounded-3xl border border-border bg-card/60 p-5 text-center backdrop-blur transition-all hover:-translate-y-2 disabled:opacity-50">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all group-hover:scale-110 ${playing ? 'animate-spin-slow' : ''}`}
                      style={{ background: `${g.glow}22`, color: g.glow }}>
                      <Icon name={g.icon} size={28} />
                    </div>
                    <span className="font-display text-sm font-bold">{g.name}</span>
                    <span className="text-xs text-muted-foreground">{g.reward}</span>
                  </button>
                ))}
              </div>
              {(playing || drawnCard) && (
                <div className="mt-6 flex flex-col items-center rounded-3xl border border-border bg-card/60 p-8 backdrop-blur animate-fade-in">
                  {playing ? (
                    <><div className="text-5xl animate-spin-slow">🎰</div><p className="mt-3 font-display font-bold">Тянем карту...</p></>
                  ) : drawnCard && (
                    <><div className="text-6xl" style={{ filter: `drop-shadow(0 0 24px ${drawnCard.color})` }}>{drawnCard.emoji}</div>
                      <p className="mt-3 font-display text-xl font-extrabold" style={{ color: drawnCard.color }}>{drawnCard.rarity} карта!</p>
                      {drawnCard.rarity === 'Золотая' && <p className="mt-1 font-hand text-2xl text-neon-gold">Нейросеть CAF разблокирована ✓</p>}
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* === СООБЩЕНИЯ === */}
          {active === 'Сообщения' && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="font-display text-3xl font-extrabold">Сообщения</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-neon-pink to-transparent" />
                <button onClick={() => setAddContactOpen(true)}
                  className="flex items-center gap-2 rounded-full border-2 border-neon-pink px-5 py-2 font-display text-sm font-bold text-neon-pink transition-colors hover:bg-neon-pink hover:text-white">
                  <Icon name="UserPlus" size={16} /> Добавить
                </button>
              </div>
              {contacts.length > 0 && !activeChat && (
                <div className="mb-5">
                  <p className="mb-3 font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">Мои контакты</p>
                  <div className="flex flex-wrap gap-3">
                    {contacts.map((c) => (
                      <div key={c.tag} className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-bold"
                          style={{ background: `${c.color}22`, color: c.color }}>{c.name[0]}</div>
                        <span className="text-sm font-medium">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!activeChat ? (
                <div className="flex flex-col gap-3">
                  {MESSAGES.map((m) => (
                    <button key={m.id} onClick={() => { setActiveChat(m); setChatMessages([{ from: 'them', text: m.preview }]); }}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-4 text-left backdrop-blur transition-all hover:border-neon-pink/50 hover:-translate-y-0.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-bold"
                        style={{ background: `${m.color}22`, color: m.color }}>
                        {m.from[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold">{m.from}</p>
                        <p className="truncate text-sm text-muted-foreground">{m.preview}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs text-muted-foreground">{m.time}</span>
                        {m.unread > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neon-pink text-[10px] font-bold text-white">{m.unread}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button onClick={() => setActiveChat(null)} className="flex items-center gap-2 text-muted-foreground hover:text-neon-cyan transition-colors self-start">
                    <Icon name="ArrowLeft" size={20} /> Назад
                  </button>
                  <div className="rounded-3xl border border-border bg-card/60 p-5 backdrop-blur">
                    <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl font-display font-bold"
                        style={{ background: `${activeChat.color}22`, color: activeChat.color }}>
                        {activeChat.from[0]}
                      </div>
                      <p className="font-display font-bold">{activeChat.from}</p>
                    </div>
                    <div className="flex flex-col gap-3 min-h-48 max-h-80 overflow-y-auto mb-4">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${msg.from === 'me' ? 'bg-neon-lime text-background font-medium' : 'bg-muted text-foreground'}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Написать сообщение..." className="bg-background flex-1" />
                      <button onClick={sendMessage} className="rounded-full bg-neon-lime px-5 py-2 font-display font-bold text-background transition-transform hover:scale-105">
                        <Icon name="Send" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === ГРУППЫ === */}
          {active === 'Группы' && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="font-display text-3xl font-extrabold">Группы</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-neon-lime to-transparent" />
                <button onClick={() => setCreateGroupOpen(true)}
                  className="flex items-center gap-2 rounded-full bg-neon-lime px-5 py-2.5 font-display text-sm font-bold text-background transition-transform hover:scale-105">
                  <Icon name="Plus" size={16} /> Создать группу
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {groups.map((g) => (
                  <div key={g.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur transition-all hover:border-neon-lime/40">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
                      style={{ background: `${g.color}18` }}>
                      {g.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold">{g.name}</p>
                      <p className="text-sm text-muted-foreground">{g.members.toLocaleString()} участников</p>
                    </div>
                    <button onClick={() => toggleGroup(g.id)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all hover:scale-105 ${
                        g.joined ? 'border-2 border-muted-foreground text-muted-foreground hover:border-neon-pink hover:text-neon-pink'
                          : 'bg-neon-lime text-background'
                      }`}>
                      {g.joined ? 'Выйти' : 'Вступить'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === ГАЛЕРЕЯ === */}
          {active === 'Галерея' && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="font-display text-3xl font-extrabold">Галерея</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan to-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {GALLERY.map((photo, i) => (
                  <button key={photo.id} onClick={() => setPhotoOpen(photo)}
                    className="group animate-fade-in relative overflow-hidden rounded-2xl border border-border transition-all hover:-translate-y-1 hover:border-neon-cyan/50"
                    style={{ animationDelay: `${i * 80}ms` }}>
                    <img src={photo.src} alt={photo.title} className="h-44 w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-sm font-bold text-white">{photo.title}</p>
                      <p className="text-xs text-neon-pink">❤ {photo.likes}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* === УВЕДОМЛЕНИЯ === */}
          {active === 'Уведомления' && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="font-display text-3xl font-extrabold">Уведомления</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-neon-pink to-transparent" />
                {unreadCount > 0 && (
                  <button onClick={readAllNotifs} className="text-sm text-muted-foreground hover:text-neon-lime transition-colors">
                    Прочитать все
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {notifs.map((n) => (
                  <div key={n.id} onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 backdrop-blur transition-all hover:-translate-y-0.5 ${
                      n.read ? 'border-border bg-card/40' : 'border-neon-pink/30 bg-card/70'
                    }`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${n.color}22`, color: n.color }}>
                      <Icon name={n.icon} size={22} fallback="Bell" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${n.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{n.text}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                    </div>
                    {!n.read && <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-neon-pink" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === ПОИСК === */}
          {active === 'Поиск' && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="font-display text-3xl font-extrabold">Поиск</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan to-transparent" />
              </div>
              <div className="mb-6 flex items-center gap-3 rounded-full border border-border bg-card/60 px-5 py-3 backdrop-blur focus-within:border-neon-cyan">
                <Icon name="Search" size={20} className="text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск людей, постов и сообществ..."
                  className="w-full bg-transparent placeholder:text-muted-foreground focus:outline-none" autoFocus />
                {search && <button onClick={() => setSearch('')}><Icon name="X" size={18} className="text-muted-foreground hover:text-neon-pink" /></button>}
              </div>
              <div className="flex flex-col gap-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
                    <p className="font-bold">{post.name} <span className="font-normal text-muted-foreground text-sm">{post.tag}</span></p>
                    <p className="mt-1 text-sm text-muted-foreground">{post.text}</p>
                  </div>
                ))}
                {search && filteredPosts.length === 0 && <p className="text-center text-muted-foreground py-10">Ничего не найдено 🔍</p>}
                {!search && <p className="text-center text-muted-foreground py-10">Начни вводить — покажем результаты</p>}
              </div>
            </div>
          )}

          {/* === ИГРЫ === */}
          {active === 'Игры' && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="font-display text-3xl font-extrabold">Игры и карточки</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan to-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {GAMES.map((g) => (
                  <button key={g.name} onClick={() => playGame(g.name)} disabled={playing}
                    className="group flex flex-col items-center gap-3 rounded-3xl border border-border bg-card/60 p-5 text-center backdrop-blur transition-all hover:-translate-y-2 disabled:opacity-50">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all group-hover:scale-110 ${playing ? 'animate-spin-slow' : ''}`}
                      style={{ background: `${g.glow}22`, color: g.glow }}>
                      <Icon name={g.icon} size={28} />
                    </div>
                    <span className="font-display text-sm font-bold">{g.name}</span>
                    <span className="text-xs text-muted-foreground">{g.reward}</span>
                  </button>
                ))}
              </div>
              {(playing || drawnCard) && (
                <div className="mt-6 flex flex-col items-center rounded-3xl border border-border bg-card/60 p-10 backdrop-blur animate-fade-in">
                  {playing ? (
                    <><div className="text-6xl animate-spin-slow">🎰</div><p className="mt-4 font-display font-bold">Тянем карту...</p></>
                  ) : drawnCard && (
                    <><div className="text-7xl" style={{ filter: `drop-shadow(0 0 32px ${drawnCard.color})` }}>{drawnCard.emoji}</div>
                      <p className="mt-4 font-display text-2xl font-extrabold" style={{ color: drawnCard.color }}>{drawnCard.rarity} карта!</p>
                      {drawnCard.rarity === 'Золотая' && <p className="mt-2 font-hand text-3xl text-neon-gold">Нейросеть CAF разблокирована ✓</p>}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </main>

        {/* RIGHT RAIL */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col gap-5 xl:flex">
          <div className={`relative overflow-hidden rounded-3xl border bg-card/60 p-5 backdrop-blur ${cafUnlocked ? 'border-neon-lime/50 animate-glow-pulse' : 'border-neon-gold/40'}`}>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-neon-gold/30 blur-2xl" />
            <img src={GOLD_CARD} alt="Золотая карта" className="mb-4 h-40 w-full rounded-2xl object-cover" />
            <p className="font-display font-extrabold text-neon-gold">Нейросеть CAF</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {cafUnlocked ? 'Открыта! Генерируй миры одной мыслью ✨' : 'Открывается при получении золотой карты.'}
            </p>
            <button
              onClick={() => cafUnlocked ? toast.success('✨ CAF генерирует твою вселенную...') : (toast('Сыграй в «Золотой Куб» 🎲'), goSection('Игры'))}
              className={`mt-4 w-full rounded-full py-2.5 font-display font-bold transition-transform hover:scale-105 ${cafUnlocked ? 'bg-neon-lime text-background' : 'bg-neon-gold text-background'}`}>
              {cafUnlocked ? 'Запустить CAF ✨' : 'Заблокировано 🔒'}
            </button>
          </div>

          <div className="rounded-3xl border border-border bg-card/60 p-5 backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display font-bold">Мем дня</p>
              <Icon name="Laugh" className="text-neon-pink" size={20} />
            </div>
            <div className="flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet/40 to-neon-pink/40 text-center font-hand text-2xl px-3">
              «когда поймал золотую карту»
            </div>
            <button onClick={() => setMemeOpen(true)} className="mt-3 w-full rounded-full border-2 border-neon-lime py-2 text-sm font-bold text-neon-lime transition-colors hover:bg-neon-lime hover:text-background">
              Создать мем
            </button>
          </div>
        </aside>
      </div>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-border bg-card/80 px-3 py-2 backdrop-blur-xl lg:hidden">
        {NAV.slice(0, 5).map((item) => (
          <button key={item.label} onClick={() => goSection(item.label)}
            className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all ${active === item.label ? 'bg-neon-lime text-background' : 'text-muted-foreground'}`}>
            <Icon name={item.icon} size={22} />
            {item.label === 'Уведомления' && unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-neon-pink text-[8px] font-bold text-white">{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* DIALOGS */}
      <Dialog open={postOpen} onOpenChange={setPostOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display">Новый пост ✨</DialogTitle>
            <DialogDescription>Поделись мыслью со своей вселенной.</DialogDescription>
          </DialogHeader>
          <Textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Что у тебя нового?" className="min-h-28 bg-background" />
          <DialogFooter>
            <button onClick={publishPost} className="rounded-full bg-neon-lime px-6 py-2.5 font-display font-bold text-background transition-transform hover:scale-105">
              Опубликовать
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={memeOpen} onOpenChange={setMemeOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display">Создать мем 🎭</DialogTitle>
            <DialogDescription>Придумай дерзкую подпись — отправим в ленту.</DialogDescription>
          </DialogHeader>
          <div className="flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet/40 to-neon-pink/40 text-center font-hand text-2xl px-4">
            {memeText || 'твоя подпись здесь...'}
          </div>
          <Input value={memeText} onChange={(e) => setMemeText(e.target.value)} placeholder="Введи текст мема" className="bg-background" />
          <DialogFooter>
            <button onClick={publishMeme} className="rounded-full bg-neon-pink px-6 py-2.5 font-display font-bold text-white transition-transform hover:scale-105">
              Запостить мем
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREATE GROUP DIALOG */}
      <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display">Создать группу ✦</DialogTitle>
            <DialogDescription>Собери своё сообщество по интересам.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Название группы</label>
              <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Например: Неон Арт" className="bg-background" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Описание (необязательно)</label>
              <Textarea value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} placeholder="О чём ваше сообщество?" className="bg-background min-h-20" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Иконка</label>
              <div className="flex flex-wrap gap-2">
                {GROUP_EMOJIS.map((e) => (
                  <button key={e} onClick={() => setGroupEmoji(e)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all hover:scale-110 ${groupEmoji === e ? 'ring-2 ring-neon-lime scale-110' : 'bg-muted'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Цвет</label>
              <div className="flex gap-2">
                {GROUP_COLORS.map((c) => (
                  <button key={c} onClick={() => setGroupColor(c)}
                    className={`h-8 w-8 rounded-full transition-all hover:scale-110 ${groupColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-card scale-110' : ''}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={createGroup} className="rounded-full bg-neon-lime px-6 py-2.5 font-display font-bold text-background transition-transform hover:scale-105">
              Создать {groupEmoji}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD CONTACT DIALOG */}
      <Dialog open={addContactOpen} onOpenChange={(v) => { setAddContactOpen(v); setContactSearch(''); }}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display">Добавить контакт</DialogTitle>
            <DialogDescription>Найди человека по имени или тегу.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2.5 focus-within:border-neon-cyan">
            <Icon name="Search" size={18} className="text-muted-foreground shrink-0" />
            <input value={contactSearch} onChange={(e) => setContactSearch(e.target.value)}
              placeholder="Имя или @тег..." autoFocus
              className="w-full bg-transparent placeholder:text-muted-foreground focus:outline-none text-sm" />
          </div>
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {CONTACT_SUGGESTIONS.filter((c) =>
              !contactSearch || c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.tag.includes(contactSearch)
            ).map((c) => {
              const added = contacts.some((x) => x.tag === c.tag);
              return (
                <div key={c.tag} className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display font-bold"
                    style={{ background: `${c.color}22`, color: c.color }}>{c.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.tag}</p>
                  </div>
                  <button onClick={() => addContact(c)} disabled={added}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all hover:scale-105 disabled:opacity-60 ${
                      added ? 'bg-muted text-muted-foreground' : 'bg-neon-lime text-background'
                    }`}>
                    {added ? '✓ Добавлен' : 'Добавить'}
                  </button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!photoOpen} onOpenChange={() => setPhotoOpen(null)}>
        <DialogContent className="border-border bg-card max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{photoOpen?.title}</DialogTitle>
          </DialogHeader>
          {photoOpen && (
            <>
              <img src={photoOpen.src} alt={photoOpen.title} className="w-full rounded-2xl object-cover" />
              <div className="flex items-center gap-4 pt-2">
                <button onClick={() => toast.success('❤️ Лайк!')} className="flex items-center gap-2 text-muted-foreground hover:text-neon-pink transition-colors">
                  <Icon name="Heart" size={20} /> <span>{photoOpen.likes}</span>
                </button>
                <button onClick={() => toast.success('🔗 Ссылка скопирована!')} className="flex items-center gap-2 text-muted-foreground hover:text-neon-lime transition-colors">
                  <Icon name="Share2" size={20} /> <span>Поделиться</span>
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}