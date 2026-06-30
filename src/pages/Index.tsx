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

export default function Index() {
  const [active, setActive] = useState('Лента');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  // dialogs
  const [postOpen, setPostOpen] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [memeOpen, setMemeOpen] = useState(false);
  const [memeText, setMemeText] = useState('');
  const [search, setSearch] = useState('');

  // game
  const [playing, setPlaying] = useState(false);
  const [drawnCard, setDrawnCard] = useState<typeof CARD_POOL[number] | null>(null);
  const [cafUnlocked, setCafUnlocked] = useState(false);
  const [collection, setCollection] = useState(0);

  const goSection = (label: string) => {
    setActive(label);
    if (label === 'Игры') document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
    else if (label === 'Лента') document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
    else if (label === 'Мемы') setMemeOpen(true);
    else if (label === 'Поиск') document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
    else toast(`Раздел «${label}» скоро откроется ✦`);
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

  const filteredPosts = search.trim()
    ? posts.filter((p) => (p.text + p.name + p.tag).toLowerCase().includes(search.toLowerCase()))
    : posts;

  return (
    <div className="min-h-screen grain text-foreground overflow-x-hidden pb-24 lg:pb-0">
      <div className="pointer-events-none fixed -left-32 top-20 h-96 w-96 rounded-full bg-neon-violet/30 blur-[120px] animate-float" />
      <div className="pointer-events-none fixed right-0 top-1/2 h-80 w-80 rounded-full bg-neon-pink/20 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto flex max-w-[1400px] gap-6 px-4 py-6 lg:px-8">

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
                className={`group flex items-center gap-4 rounded-2xl px-4 py-3 text-left font-medium transition-all ${
                  active === item.label
                    ? 'bg-neon-lime text-background'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon name={item.icon} size={22} className="transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl border border-border bg-card/60 p-5 backdrop-blur">
            <p className="font-hand text-2xl text-neon-cyan">{cafUnlocked ? 'CAF активен ✓' : 'CAF разблокирован?'}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {cafUnlocked ? 'Нейросеть открыта — твори миры!' : 'Поймай золотую карту в играх и открой нейросеть.'}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Карт в коллекции: <span className="text-neon-lime font-bold">{collection}</span></p>
          </div>
        </aside>

        <main className="flex-1">
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

          {/* SEARCH */}
          <div id="search" className="mb-6 flex items-center gap-3 rounded-full border border-border bg-card/60 px-5 py-3 backdrop-blur focus-within:border-neon-cyan">
            <Icon name="Search" size={20} className="text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск людей, постов и сообществ..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')}><Icon name="X" size={18} className="text-muted-foreground hover:text-neon-pink" /></button>
            )}
          </div>

          <div id="feed" className="mb-4 flex items-center gap-3">
            <h2 className="font-display text-2xl font-extrabold">Лента активности</h2>
            <span className="h-px flex-1 bg-gradient-to-r from-neon-violet to-transparent" />
          </div>

          <div className="flex flex-col gap-5">
            {filteredPosts.length === 0 && (
              <p className="rounded-2xl border border-border bg-card/40 p-6 text-center text-muted-foreground">Ничего не найдено 🔍</p>
            )}
            {filteredPosts.map((post, i) => (
              <article
                key={post.id}
                className="animate-fade-in rounded-[1.6rem] border border-border bg-card/60 p-6 backdrop-blur transition-all hover:border-neon-lime/50 hover:-translate-y-1"
                style={{ animationDelay: `${Math.min(i, 4) * 100}ms` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <img src={AVATAR} alt={post.name} className="h-12 w-12 rounded-2xl object-cover ring-2" style={{ '--tw-ring-color': post.color } as React.CSSProperties} />
                  <div className="flex-1">
                    <p className="font-display font-bold leading-tight">{post.name}</p>
                    <p className="text-sm text-muted-foreground">{post.tag}</p>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${post.color}22`, color: post.color }}>
                    {post.badge}
                  </span>
                </div>
                <p className="mb-4 text-[15px] leading-relaxed">{post.text}</p>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 transition-all hover:text-neon-pink ${post.liked ? 'text-neon-pink' : ''}`}>
                    <Icon name="Heart" size={19} className={post.liked ? 'fill-current scale-110' : ''} /> <span className="text-sm">{post.likes}</span>
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
              <button
                key={g.name}
                onClick={() => playGame(g.name)}
                disabled={playing}
                className="group flex flex-col items-center gap-3 rounded-3xl border border-border bg-card/60 p-5 text-center backdrop-blur transition-all hover:-translate-y-2 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all group-hover:scale-110 ${playing ? 'animate-spin-slow' : ''}`}
                  style={{ background: `${g.glow}22`, color: g.glow }}
                >
                  <Icon name={g.icon} size={28} />
                </div>
                <span className="font-display text-sm font-bold">{g.name}</span>
                <span className="text-xs text-muted-foreground">{g.reward}</span>
              </button>
            ))}
          </div>

          {/* drawn card result */}
          {(playing || drawnCard) && (
            <div className="mt-6 flex flex-col items-center rounded-3xl border border-border bg-card/60 p-8 backdrop-blur animate-fade-in">
              {playing ? (
                <>
                  <div className="text-5xl animate-spin-slow">🎰</div>
                  <p className="mt-3 font-display font-bold">Тянем карту...</p>
                </>
              ) : drawnCard && (
                <>
                  <div className="text-6xl animate-scale-in" style={{ filter: `drop-shadow(0 0 24px ${drawnCard.color})` }}>{drawnCard.emoji}</div>
                  <p className="mt-3 font-display text-xl font-extrabold" style={{ color: drawnCard.color }}>{drawnCard.rarity} карта!</p>
                  {drawnCard.rarity === 'Золотая' && <p className="mt-1 font-hand text-2xl text-neon-gold">Нейросеть CAF разблокирована ✓</p>}
                </>
              )}
            </div>
          )}
        </main>

        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col gap-5 xl:flex">
          <div className={`relative overflow-hidden rounded-3xl border bg-card/60 p-5 backdrop-blur ${cafUnlocked ? 'border-neon-lime/50 animate-glow-pulse' : 'border-neon-gold/40'}`}>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-neon-gold/30 blur-2xl" />
            <img src={GOLD_CARD} alt="Золотая карта" className="mb-4 h-40 w-full rounded-2xl object-cover" />
            <p className="font-display font-extrabold text-neon-gold">Нейросеть CAF</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {cafUnlocked ? 'Открыта! Генерируй миры одной мыслью ✨' : 'Открывается при получении золотой карты в играх.'}
            </p>
            <button
              onClick={() => cafUnlocked ? toast.success('✨ CAF генерирует твою вселенную...') : (toast('Сыграй в «Золотой Куб» 🎲'), goSection('Игры'))}
              className={`mt-4 w-full rounded-full py-2.5 font-display font-bold transition-transform hover:scale-105 ${cafUnlocked ? 'bg-neon-lime text-background' : 'bg-neon-gold text-background'}`}
            >
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
          <button
            key={item.label}
            onClick={() => goSection(item.label)}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
              active === item.label ? 'bg-neon-lime text-background' : 'text-muted-foreground'
            }`}
          >
            <Icon name={item.icon} size={22} />
          </button>
        ))}
      </nav>

      {/* CREATE POST DIALOG */}
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

      {/* CREATE MEME DIALOG */}
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
    </div>
  );
}
