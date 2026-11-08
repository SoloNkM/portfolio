import { useEffect, useRef, useState } from "react";

const GITHUB = "https://github.com/SoloNkM";
const REPO_AGENT = "https://github.com/SoloNkM/agent-";
const EMAIL = "ndamarc715@gmail.com";

const NIVEAUX = [
  ["apropos", "À propos"],
  ["projets", "Projets"],
  ["competences", "Compétences"],
  ["foi", "Foi"],
  ["ambitions", "Ambitions"],
  ["contact", "Contact"],
];

const BOOT = [
  ["[ OK ]", "démarrage du système"],
  ["[ OK ]", "chargement de /passion/code"],
  ["[ OK ]", "montage de /foi/fondation"],
  ["[ .. ]", "lecture : Deutéronome 28:3"],
  [">", "Que la lumière soit."],
];

// Barres d'XP : "bases" = barre courte (d'après ton CV). À régler à ta guise.
const SKILLS = [
  ["Python", 65],
  ["C#", 65],
  ["Java", 65],
  ["JavaScript", 65],
  ["Node.js, React", 45],
  ["Git / GitHub", 60],
  ["API Gemini", 60],
  ["Outils d’IA", 60],
  ["HTML, CSS, PHP (bases)", 35],
  ["SQL / MySQL, serveurs (bases)", 35],
  ["Programmation jeux vidéo : Unity, Unreal (bases)", 35],
];

const reduit = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useTyped(texte, actif, vitesse = 85) {
  const [n, setN] = useState(reduit() ? texte.length : 0);
  useEffect(() => {
    if (!actif || n >= texte.length) return;
    const t = setTimeout(() => setN(n + 1), vitesse);
    return () => clearTimeout(t);
  }, [n, texte, actif, vitesse]);
  return texte.slice(0, n);
}

function Reveal({ children }) {
  const ref = useRef(null);
  const [vu, setVu] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVu(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={"reveal" + (vu ? " in" : "")}>{children}</div>;
}

// Transition entre deux niveaux : une barre de chargement qui se remplit
function Chargement({ texte }) {
  return (
    <div className="wrap">
      <Reveal>
        <div className="loading" aria-hidden="true">
          <span>{texte}</span>
          <div className="ltrack"><div className="lfill" /></div>
        </div>
      </Reveal>
    </div>
  );
}

function Niveau({ n, children }) {
  return (
    <h2 className="level">
      <span className="lvl">Niveau {n}</span>
      {children}
    </h2>
  );
}

// Écran de démarrage : le terminal boote, puis « Que la lumière soit »
function Boot({ onLumiere, onFin }) {
  const [n, setN] = useState(0);
  const [phase, setPhase] = useState("boot");

  useEffect(() => {
    if (phase !== "boot") return;
    if (n < BOOT.length) {
      const t = setTimeout(() => setN(n + 1), n === 0 ? 350 : 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("flash"), 900);
    return () => clearTimeout(t);
  }, [n, phase]);

  useEffect(() => {
    if (phase === "flash") {
      const t = setTimeout(() => {
        setPhase("out");
        onLumiere();
      }, 450);
      return () => clearTimeout(t);
    }
    if (phase === "out") {
      const t = setTimeout(onFin, 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const passer = () => {
    onLumiere();
    onFin();
  };

  return (
    <div className={"boot " + phase} role="dialog" aria-label="Démarrage du portfolio">
      <div className="boot-lines">
        {BOOT.slice(0, n).map(([tag, txt], i) => (
          <p key={i} className={i === BOOT.length - 1 ? "last" : ""}>
            <span className="tag">{tag}</span> {txt}
          </p>
        ))}
        <span className="cursor" aria-hidden="true" />
      </div>
      <button className="skip" onClick={passer}>Passer</button>
    </div>
  );
}

export default function App() {
  const [etat, setEtat] = useState(() => {
    try {
      if (reduit() || sessionStorage.getItem("boot-vu")) return "pret";
    } catch (e) {}
    return "boot";
  });
  const [xp, setXp] = useState(0);
  const hello = useTyped("> bonjour, à tous", etat !== "boot");

  useEffect(() => {
    document.body.style.overflow = etat === "pret" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [etat]);

  useEffect(() => {
    const maj = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setXp(max > 0 ? Math.min(100, Math.round((h.scrollTop / max) * 100)) : 0);
    };
    maj();
    window.addEventListener("scroll", maj, { passive: true });
    return () => window.removeEventListener("scroll", maj);
  }, []);

  const fini = () => {
    try { sessionStorage.setItem("boot-vu", "1"); } catch (e) {}
    setEtat("pret");
  };

  return (
    <>
      {etat !== "pret" && (
        <Boot onLumiere={() => setEtat((e) => (e === "boot" ? "lumiere" : e))} onFin={fini} />
      )}

      <nav className="nav" aria-label="Navigation principale">
        <div className="wrap hud">
          <a className="brand" href="#accueil">JOUEUR 1</a>
          <div className="links">
            {NIVEAUX.map(([id, label], i) => (
              <a key={id} href={"#" + id}>{i + 1}. {label}</a>
            ))}
          </div>
          <span className="xp-label">XP {xp}%</span>
        </div>
        <div className="xp" aria-hidden="true"><div className="xp-fill" style={{ width: xp + "%" }} /></div>
      </nav>

      <header className="hero" id="accueil">
        <div className="wrap">
          <div>
            <p className="hello" aria-label="bonjour, à tous">
              {hello}
              <span className="cursor" aria-hidden="true" />
            </p>
            <h1>Marc N’da Kouassi</h1>
            <p className="role">Étudiant en informatique, Abidjan</p>
            <p className="tagline">Je construis des trucs qui marchent, un commit à la fois.</p>
            <div className="actions">
              <a className="btn primary" href="#apropos">Appuyer sur start</a>
              <a className="btn" href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
              <a className="btn" href="/CV_Marc_Nda_Kouassi.pdf" download>Télécharger mon CV</a>
            </div>
          </div>
          <div>
            <div className="window">
              <div className="bar">
                <i className="dot" /><i className="dot" /><i className="dot" />
                <span className="title">joueur1.jpg</span>
              </div>
              <img src="/photo-principale.jpg" alt="Portrait de Marc N’da Kouassi en costume noir" />
            </div>
            <dl className="stats">
              <dt>classe</dt><dd>étudiant développeur</dd>
              <dt>base</dt><dd>Bingerville, Abidjan</dd>
              <dt>quête</dt><dd>première expérience pro</dd>
            </dl>
          </div>
        </div>
      </header>

      <main>
        <Chargement texte="chargement du niveau 1…" />
        <section className="block" id="apropos">
          <div className="wrap">
            <Reveal>
              <Niveau n={1}>À propos</Niveau>
              <div className="about">
                <div className="window">
                  <div className="bar">
                    <i className="dot" /><i className="dot" /><i className="dot" />
                    <span className="title">apropos.jpg</span>
                  </div>
                  <img src="/photo-apropos.jpg" alt="Marc N’da Kouassi en costume bleu marine" loading="lazy" />
                </div>
                <div>
                  <p>
                    Je suis étudiant en licence professionnelle DASI (Développement
                    d’Applications et Systèmes d’Information) à l’ESATIC, à Abidjan.
                    Cette formation prépare à développer des applications et à
                    administrer des bases de données. J’aime les projets concrets : en
                    ce moment, je construis un agent IA personnel en Python.
                  </p>
                  <p>
                    Je cherche une première expérience au contact de professionnels
                    expérimentés, pour apprendre vite et bien.
                  </p>
                  <ul className="timeline">
                    <li><strong>Licence professionnelle DASI</strong>, ESATIC, Abidjan (en cours, après réussite au concours d’entrée)</li>
                    <li><strong>Licence 1 et 2, développement d’application</strong>, UVCI, en ligne (depuis sept. 2023)</li>
                    <li><strong>Baccalauréat série D</strong>, Collège Arhogninci (première et terminale)</li>
                    <li><strong>Cours Secondaire Méthodiste (CSM)</strong>, de la 4ᵉ à la 2nde</li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Chargement texte="chargement du niveau 2…" />
        <section className="block" id="projets">
          <div className="wrap">
            <Reveal>
              <Niveau n={2}>Projets</Niveau>
              <article className="featured">
                <p className="badge">★ projet phare</p>
                <h3>Agent IA personnel</h3>
                <p className="meta">2026 · Python · API Gemini</p>
                <p>
                  Un agent qui lit et écrit des fichiers et lance des commandes sur
                  mon PC. Il ne fait rien sans mon feu vert, et il s’arrête tout
                  seul quand ça part mal.
                </p>
                <p className="meta">Capacités débloquées</p>
                <ul className="features">
                  <li>Confirmation « go / non » avant chaque action</li>
                  <li>Sauvegarde des fichiers originaux avant toute modification</li>
                  <li>Journal de toutes les actions</li>
                  <li>Arrêt automatique après 3 échecs de suite</li>
                  <li>Clés secrètes protégées, nombreux tests de sécurité</li>
                </ul>
                <a className="btn primary" href={REPO_AGENT} target="_blank" rel="noreferrer">Voir sur GitHub</a>
              </article>
              <p className="meta side">Quêtes annexes</p>
              <div className="projects">
                <article className="project">
                  <h3>YaGaz</h3>
                  <p className="meta">Projet de groupe · application mobile</p>
                  <p>Application mobile ivoirienne pour trouver des points de vente de bouteilles de gaz.</p>
                </article>
                <article className="project">
                  <h3>Hydrotic CI</h3>
                  <p className="meta">Projet inter-spécialités</p>
                  <p>Solution technologique de prévention des inondations en Côte d’Ivoire. Ma part : la présentation du problème.</p>
                </article>
                <article className="project">
                  <h3>Sites web</h3>
                  <p className="meta">Projets web</p>
                  <p>Réalisation de plusieurs sites web.</p>
                </article>
                <article className="project">
                  <h3>Petits jeux vidéo</h3>
                  <p className="meta">Unity · Unreal Engine</p>
                  <p>Développement de petits jeux avec Unity et, un peu, Unreal Engine.</p>
                </article>
              </div>
            </Reveal>
          </div>
        </section>

        <Chargement texte="chargement du niveau 3…" />
        <section className="block" id="competences">
          <div className="wrap">
            <Reveal>
              <Niveau n={3}>Compétences</Niveau>
              <ul className="bars">
                {SKILLS.map(([nom, v]) => (
                  <li key={nom}>
                    <span className="bname">{nom}</span>
                    <div className="track"><div className="fill" style={{ "--w": v + "%" }} /></div>
                  </li>
                ))}
              </ul>
              <p className="meta side">Langues</p>
              <ul className="bars">
                <li>
                  <span className="bname">Français</span>
                  <div className="track"><div className="fill" style={{ "--w": "80%" }} /></div>
                </li>
                <li>
                  <span className="bname">Anglais · intermédiaire</span>
                  <div className="track"><div className="fill" style={{ "--w": "55%" }} /></div>
                </li>
              </ul>
            </Reveal>
          </div>
        </section>

        <Chargement texte="chargement du niveau 4…" />
        <section className="block" id="foi">
          <div className="wrap">
            <Reveal>
              <Niveau n={4}>Foi</Niveau>
              <p className="foi-intro">
                Je suis chrétien, et ma foi est le socle de tout ce que je construis.
                Deux versets me portent.
              </p>
              <div className="verses">
                <blockquote>
                  <p>Tu seras béni dans la ville, et tu seras béni dans les champs.</p>
                  <cite>Deutéronome 28:3</cite>
                </blockquote>
                <blockquote>
                  <p>Et voici, je suis avec vous tous les jours, jusqu’à la fin du monde.</p>
                  <cite>Matthieu 28:20</cite>
                </blockquote>
              </div>
            </Reveal>
          </div>
        </section>

        <Chargement texte="chargement du niveau 5…" />
        <section className="block" id="ambitions">
          <div className="wrap">
            <Reveal>
              <Niveau n={5}>Ambitions</Niveau>
              <p className="foi-intro">
                Je ne sais pas encore où je serai dans 5 ans, mais je sais où je veux aller.
              </p>
              <div className="verses">
                <article className="project">
                  <h3>À court terme</h3>
                  <p>Un stage ou une première expérience en développement d’applications, pour apprendre auprès de professionnels et transformer mes idées en solutions utilisables.</p>
                </article>
                <article className="project">
                  <h3>La suite</h3>
                  <p>Utiliser mes compétences en informatique et en intelligence artificielle pour concevoir des solutions à de vrais problèmes, en Afrique puis à l’international. À l’ère de l’IA, une bonne idée suffit pour créer des solutions innovantes, et je veux y contribuer.</p>
                </article>
              </div>
            </Reveal>
          </div>
        </section>

        <Chargement texte="chargement du niveau 6…" />
        <section className="block" id="contact">
          <div className="wrap">
            <Reveal>
              <Niveau n={6}>Contact</Niveau>
              <p className="foi-intro">Partie sauvegardée. On continue l’aventure ensemble ?</p>
              <ul className="contact">
                <li><span>email pro :</span><a href={"mailto:" + EMAIL}>{EMAIL}</a></li>
                <li><span>github</span><a href={GITHUB} target="_blank" rel="noreferrer">github.com/SoloNkM</a></li>
                <li><span>ville</span>Bingerville, Abidjan</li>
              </ul>
              <a className="btn primary" href="/CV_Marc_Nda_Kouassi.pdf" download>Télécharger mon CV (PDF)</a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <p className="verse">// « Je suis avec vous tous les jours, jusqu’à la fin du monde. » Matthieu 28:20</p>
          <p>© 2026 Marc N’da Kouassi</p>
        </div>
      </footer>
    </>
  );
}
