import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Ribbon,
  Stethoscope,
  ScanLine,
  HeartPulse,
  Microscope,
  Leaf,
  Video,
  Siren,
  CreditCard,
  Smartphone,
  MessageCircle,
  Gift,
  Plus,
} from "lucide-react";

// Checkout exclusivo do Outubro Rosa — usado por todos os CTAs de assinatura
const CHECKOUT_URL = "https://compre.kivid.com.br/outubrorosa26";
const REDE_CREDENCIADA_URL = "https://rede.kivid.com.br/";
const REDE_PARCEIRO_URL = "https://redekivid.lovable.app/";

/* Fundos de seção — variações do magenta Kivid. Começam no #CC3A85 para o texto branco
   manter contraste ≥ 4,6:1 (WCAG AA) em todo o degradê. */
const BG_MAGENTA = "linear-gradient(160deg, #CC3A85 0%, #B8317A 55%, #A82E6C 100%)";
const BG_MAGENTA_DEEP = "linear-gradient(150deg, #A82E6C 0%, #B8317A 50%, #CC3A85 100%)";

/** Meta tags da LP. `path` é onde ela é servida ("/" no projeto kivid-outubro-rosa). */
export function outubroRosaHead(path: string) {
  return {
    meta: [
      { title: "Outubro Rosa Kivid — Saúde da mulher com preços acessíveis" },
      {
        name: "description",
        content:
          "Consultas e exames para a saúde da mulher com valores acessíveis. Assine o Passaporte Individual e ganhe um Passaporte Família grátis.",
      },
      { property: "og:title", content: "Outubro Rosa Kivid — Leve 2 Passaportes pagando 1" },
      {
        property: "og:description",
        content:
          "Mamografia, preventivo, ultrassom das mamas e consultas com preços que cabem na rotina. Passaporte Individual + Família grátis.",
      },
      { property: "og:url", content: path },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}


/* ------------------------------------------------------------------ */
/* Primitivos                                                          */
/* Regras da página: tudo alinhado à esquerda; botões sempre           */
/* preenchidos (solid em fundo claro, light em fundo magenta).         */
/* ------------------------------------------------------------------ */

function KividLogo({ className = "" }: { className?: string }) {
  return <img src="/brand/kivid-logo-dark.svg" alt="Kivid" className={`block h-6 w-auto sm:h-7 md:h-8 ${className}`} />;
}

function CtaButton({
  variant = "solid",
  children,
  className = "",
  href = CHECKOUT_URL,
}: {
  variant?: "solid" | "light";
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const base =
    "group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3 text-center text-base font-bold leading-tight tracking-wide transition-all duration-200 min-h-[56px] active:translate-y-0 active:scale-[0.98] hover:-translate-y-px";
  const styles =
    variant === "solid"
      ? "bg-magenta-600 text-white shadow-md hover:bg-magenta-700 hover:shadow-xl active:bg-magenta-800"
      : "bg-white text-magenta-700 shadow-lg hover:shadow-2xl hover:text-magenta-800 active:bg-white/90";
  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`font-bold uppercase ${light ? "text-white" : "text-chia-900"}`}
      style={{ letterSpacing: "0.12em", fontSize: 14 }}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  children,
  className = "",
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <h2
      className={`mt-4 font-extrabold uppercase leading-[1] text-[clamp(28px,8vw,36px)] md:text-[48px] ${
        light ? "text-white" : "text-chia-900"
      } ${className}`}
      style={{ letterSpacing: "-0.02em", textWrap: "balance" as React.CSSProperties["textWrap"] }}
    >
      {children}
    </h2>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${className}`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </div>
  );
}

/** Preço com centavos menores: R$ 80,60 → "R$" + "80" + ",60". O tamanho vem do font-size do className. */
function Price({ value, className = "" }: { value: string; className?: string }) {
  const [int, cents] = value.split(",");
  return (
    <span
      className={`inline-flex items-start whitespace-nowrap font-extrabold leading-none tabular-nums ${className}`}
      style={{ letterSpacing: "-0.03em" }}
    >
      <span className="mr-1 mt-[0.18em] text-[0.4em]" style={{ letterSpacing: 0 }}>
        R$
      </span>
      <span>{int}</span>
      {cents && <span className="mt-[0.12em] text-[0.5em]">,{cents}</span>}
    </span>
  );
}

/** Entrada do hero (keyframes fadeUp de styles.css). Não usa as classes .hero-*,
 *  que carregam regras de layout centralizado das outras LPs. */
const enter = (delayMs: number): React.CSSProperties => ({
  animation: `fadeUp 0.45s ease both ${delayMs}ms`,
});

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { href: "#precos", label: "Preços" },
    { href: "#rede", label: "Rede" },
    { href: "#oferta", label: "Oferta" },
    { href: "#como-comecar", label: "Como começar" },
  ];
  return (
    <nav
      className="navbar flex items-center justify-between gap-3 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.13)" : "0 4px 28px rgba(0,0,0,0.09)",
      }}
    >
      <KividLogo />
      <ul className="hidden items-center gap-8 lg:flex">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="relative inline-flex min-h-[44px] items-center text-[13px] font-semibold text-chia-900 no-underline transition-colors duration-150 hover:text-magenta-700 hover:underline underline-offset-4 decoration-2"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href={CHECKOUT_URL}
        className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-magenta-600 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-magenta-700 hover:shadow-md"
        style={{ padding: "10px 18px" }}
      >
        Garantir oferta
        <ArrowRight className="hidden h-4 w-4 sm:block" aria-hidden="true" />
      </a>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Hero — só texto, centralizado                                       */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-16 pt-[120px] md:pb-24 md:pt-[160px]"
      style={{ background: BG_MAGENTA }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 h-[480px] w-[480px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-10 h-[520px] w-[520px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(245,169,204,0.9) 0%, rgba(245,169,204,0) 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mx-auto max-w-[860px] text-center">
          <div
            style={enter(100)}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-bold uppercase tracking-widest text-white ring-1 ring-white/40 backdrop-blur-sm"
          >
            <Ribbon className="h-3.5 w-3.5" aria-hidden="true" />
            Outubro Rosa Kivid
          </div>

          <h1
            className="font-extrabold uppercase text-white text-[clamp(32px,9vw,44px)] md:text-[64px]"
            style={{
              ...enter(200),
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              textWrap: "balance" as React.CSSProperties["textWrap"],
            }}
          >
            Cuide da sua saúde com preços que cabem na rotina.
          </h1>

          <p
            className="mx-auto mt-6 max-w-[52ch] text-[17px] font-semibold text-white md:text-xl"
            style={{ ...enter(350), lineHeight: 1.6, textWrap: "pretty" as React.CSSProperties["textWrap"] }}
          >
            Encontre consultas e exames para a saúde da mulher com{" "}
            <strong className="font-extrabold">valores acessíveis</strong> na rede Kivid.
          </p>

          {/* Explica o modelo em 5 segundos: assinatura + exame pago na clínica */}
          <ul
            style={enter(420)}
            className="mx-auto mt-6 flex max-w-[860px] flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[15px] font-bold text-white md:text-base"
          >
            {["Passaporte por 12x de R$ 14,90", "Consultas e exames pagos direto na clínica", "Sem carência"].map(
              (t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                  {t}
                </li>
              ),
            )}
          </ul>

          <div style={enter(500)} className="mt-8">
            <CtaButton variant="light">Começar agora</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Preços — box logo abaixo do hero, com respiro                        */
/* ------------------------------------------------------------------ */

function Precos() {
  const items = [
    { icon: Stethoscope, title: "Ginecologista ou mastologista", price: "130" },
    { icon: ScanLine, title: "Mamografia", price: "111" },
    { icon: HeartPulse, title: "Ultrassom das mamas", price: "80,60" },
    { icon: Microscope, title: "Preventivo", price: "100" },
  ];
  return (
    <section id="precos" className="relative bg-chia-200 py-12 md:py-20">
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6">
        <Reveal className="rounded-[28px] bg-white p-3 shadow-[0_30px_60px_-30px_rgba(92,25,55,0.45)] ring-1 ring-black/5 md:p-6">
          {/* Cabeçalho do box */}
          <div className="flex flex-col items-center gap-3 px-1 pb-5 pt-2 text-center md:px-0 md:pb-6 md:pt-0 lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-magenta-100 px-3 py-1 text-[13px] font-extrabold uppercase tracking-wider text-magenta-700">
                <Ribbon className="h-3.5 w-3.5" aria-hidden="true" />
                Preços na rede
              </span>
              <h2
                className="mt-3 font-extrabold uppercase leading-[1.05] text-chia-900 text-[26px] md:text-[36px]"
                style={{ letterSpacing: "-0.02em" }}
              >
                Saúde da mulher <span className="text-magenta-600">na rede Kivid</span>
              </h2>
            </div>
            <p className="text-base font-bold text-chia-800 md:text-lg">Confira os valores a partir de:</p>
          </div>

          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4 md:gap-3">
            {items.map((s) => (
              <li
                key={s.title}
                className="group flex flex-col items-center rounded-[22px] bg-chia-200 p-4 text-center transition-colors duration-200 hover:bg-magenta-100 md:p-6 lg:items-start lg:text-left"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-magenta-700 shadow-sm transition-all group-hover:bg-magenta-600 group-hover:text-white">
                  <s.icon className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
                </span>
                <h3
                  className="mt-4 min-h-[2.5em] text-[15px] font-extrabold leading-[1.25] text-chia-900 md:text-lg"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {s.title}
                </h3>
                <div className="mt-auto pt-4">
                  <span className="block text-sm font-extrabold uppercase tracking-wider text-magenta-700 md:text-[15px]">
                    A partir de
                  </span>
                  <Price value={s.price} className="mt-1 text-[clamp(40px,12vw,52px)] text-magenta-600 md:text-[60px]" />
                </div>
              </li>
            ))}
          </ul>

          {/* Rodapé do box: nota à esquerda, CTA à direita (mesmas bordas dos cards) */}
          <div className="flex flex-col-reverse items-center gap-4 px-1 pb-1 pt-4 text-center md:px-0 md:pb-0 md:pt-6 lg:flex-row lg:justify-between lg:gap-8 lg:text-left">
            <p className="max-w-lg text-sm leading-[1.7] text-chia-800">
              Valores praticados na rede credenciada Kivid para assinantes do Passaporte, pagos direto ao credenciado.
              Podem variar por credenciado e cidade. <strong className="font-bold text-chia-900">O Kivid não é plano de saúde.</strong>
            </p>
            <CtaButton variant="solid" className="md:shrink-0">
              Simular trilha de saúde
            </CtaButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 01 — Rede credenciada                                                */
/* ------------------------------------------------------------------ */

function Rede() {
  // Logos em public/credenciados, recortados na área útil. `ratio` = largura/altura do arquivo;
  // o tamanho usa √ratio para que logos largos e compactos tenham o mesmo peso visual.
  // `scale` corrige logos de traço fino que parecem menores.
  // Cada card abre a página do credenciado no site da rede (REDE_PARCEIRO_URL + slug)
  const credenciados = [
    { name: "Labchecap", slug: "labchecap", logo: "/credenciados/labchecap.svg", ratio: 215 / 44, scale: 1 },
    { name: "Hospital da Bahia", slug: "hospital-da-bahia", logo: "/credenciados/hospital-da-bahia.svg", ratio: 123 / 42, scale: 1 },
    { name: "A Clínica da Mulher Anna Paola Noya Gatto", slug: "a-clinica-da-mulher-anna-paola-noya-gatto", logo: "/credenciados/clinica-da-mulher-ana-paola.svg", ratio: 219 / 76, scale: 1.15 },
    { name: "Clínica Eliz", slug: "clinica-eliz", logo: "/credenciados/clinica-eliz.svg", ratio: 128 / 53, scale: 1 },
    { name: "Clínica Bem-Estar", slug: "clinica-bem-estar", logo: "/credenciados/clinica-bem-estar.png", ratio: 3, scale: 1 },
    { name: "Nutriclin", slug: "nutriclin-cia", logo: "/credenciados/nutriclin.svg", ratio: 164 / 66, scale: 1 },
    { name: "Medjan", slug: "medjan", logo: "/credenciados/medjan.svg", ratio: 126 / 54, scale: 1 },
    { name: "Diagnor Imagem", slug: "diagnor-imagem", logo: "/credenciados/diagnor-imagem.svg", ratio: 1196 / 559, scale: 1.05 },
  ];
  return (
    <section id="rede" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Cabeçalho centralizado → faixa de logos → CTA, mesmo ritmo de "Como começar" */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>01 — Rede credenciada</Eyebrow>
          <SectionTitle>
            Uma rede pronta para <span className="text-magenta-600">cuidar de você.</span>
          </SectionTitle>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.7] text-chia-900 md:text-lg">
            Com o Kivid, você encontra consultas, exames e serviços para cuidar da saúde da mulher em{" "}
            <strong className="font-bold text-chia-900">diferentes momentos da vida</strong>.
          </p>
        </Reveal>

        {/* Faixa de logos na largura toda: 2 colunas até o tablet, 4 × 2 no desktop */}
        <Reveal className="mt-10 md:mt-12" delay={120}>
          <p className="mb-4 text-center text-base font-bold text-chia-900">
            Na nossa rede, você encontra credenciados como:
          </p>
          <ul className="grid grid-cols-2 gap-3 [--logo-k:54px] sm:[--logo-k:72px] md:gap-4 md:[--logo-k:98px] lg:grid-cols-4 lg:[--logo-k:84px]">
            {credenciados.map((c) => (
              <li key={c.name}>
                <a
                  href={`${REDE_PARCEIRO_URL}${c.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver ${c.name} na rede Kivid (abre em nova aba)`}
                  className="flex h-20 items-center justify-center rounded-2xl border border-chia-400/70 bg-white px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-magenta-300 hover:shadow-lg md:h-24 md:px-6"
                >
                  <img
                    src={c.logo}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="block h-auto max-h-full max-w-full object-contain mix-blend-multiply"
                    style={{ width: `calc(var(--logo-k) * ${(Math.sqrt(c.ratio) * c.scale).toFixed(3)})` }}
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-10 flex justify-center">
          <CtaButton variant="solid" href={REDE_CREDENCIADA_URL}>
            Conhecer a rede Kivid
          </CtaButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Oferta: seção magenta com "ticket" 2 por 1                       */
/* ------------------------------------------------------------------ */

const TICKET_ROW = "flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left";
const TICKET_LABEL = "text-sm font-extrabold uppercase tracking-wider text-chia-800";
const TICKET_NAME = "mt-1 text-xl font-extrabold leading-tight text-chia-900 md:text-2xl";

function Oferta() {
  return (
    <section id="oferta" className="relative overflow-hidden py-16 md:py-24" style={{ background: BG_MAGENTA_DEEP }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "#F5A9CC" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{ background: "#ffffff" }}
      />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-4 md:px-6 lg:grid-cols-12 lg:gap-14">
        <Reveal className="text-center lg:col-span-6 lg:text-left">
          <Eyebrow light>02 — Oferta Outubro Rosa</Eyebrow>
          <SectionTitle light>
            Cuide de você e leve o cuidado para sua família.
          </SectionTitle>
          <p className="mx-auto mt-6 max-w-md text-[17px] font-semibold leading-[1.7] text-white md:text-lg lg:mx-0">
            Assine o Passaporte Kivid Individual e ganhe um{" "}
            <strong className="font-extrabold">Passaporte Família grátis</strong>.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-3 ring-1 ring-white/30 backdrop-blur-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-magenta-600">
              <Gift className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-left text-[15px] font-semibold leading-snug text-white">
              Você leva <strong className="font-extrabold">2 Passaportes</strong> pagando apenas 1.
            </span>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-6" delay={150}>
          <div className="relative mx-auto w-full max-w-[560px] rounded-[28px] bg-white p-6 shadow-2xl md:p-8 lg:mr-0 lg:max-w-[520px]">
            <span className="absolute -top-3.5 left-6 rounded-full bg-magenta-600 px-3.5 py-1 text-[13px] font-extrabold uppercase tracking-wider text-white shadow-md md:left-8">
              2 por 1
            </span>

            {/* Passaporte Individual */}
            {/* As duas linhas do ticket usam o mesmo grid: nome à esquerda, valor à direita, centralizados na vertical */}
            <div className={TICKET_ROW}>
              <div>
                <div className={TICKET_LABEL}>Você assina</div>
                <div className={TICKET_NAME}>Passaporte Individual</div>
              </div>
              <div className="flex flex-col items-center sm:items-end">
                <span className="text-base font-bold text-chia-900">por apenas 12x de</span>
                <Price value="14,90" className="mt-1 text-[56px] text-magenta-600 md:text-[64px]" />
                <span className="mt-1.5 text-base font-bold text-chia-800">ou R$ 178,80 por ano</span>
              </div>
            </div>

            {/* Picote do ticket */}
            <div className="relative my-6 flex items-center" aria-hidden>
              <span className="w-full border-t-2 border-dashed border-chia-400" />
              <span className="absolute left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-magenta-600 text-white shadow-md">
                <Plus className="h-4 w-4" strokeWidth={3} />
              </span>
            </div>

            {/* Passaporte Família */}
            <div className={TICKET_ROW}>
              <div>
                <div className={TICKET_LABEL}>Você ganha</div>
                <div className={TICKET_NAME}>1 Passaporte Família</div>
              </div>
              <span className="rounded-full bg-magenta-100 px-6 py-2 text-2xl font-extrabold uppercase text-magenta-600 sm:self-auto md:text-[28px]">
                Grátis
              </span>
            </div>
            <p className="mt-4 text-center text-base leading-[1.7] text-chia-900 sm:text-left">
              Com o Passaporte Família, você pode compartilhar o acesso aos benefícios da rede Kivid com quem você ama.
            </p>

            <div className="mt-6">
              <CtaButton variant="solid" className="sm:w-full">
                Garantir oferta
              </CtaButton>
            </div>
            <p className="mt-4 text-center text-sm leading-[1.6] text-chia-800">
              O Kivid não é plano de saúde: consultas e exames são pagos com valores reduzidos direto na rede credenciada.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Como começar                                                    */
/* ------------------------------------------------------------------ */

function ComoComecar() {
  const steps = [
    {
      icon: CreditCard,
      title: "Assine o Passaporte Individual",
      text: (
        <>
          Faça sua compra pelo <strong className="font-extrabold text-chia-900">checkout exclusivo</strong> do Outubro
          Rosa.
        </>
      ),
    },
    {
      icon: Smartphone,
      title: "Comece a aproveitar o Kivid",
      text: <>Acesse consultas, exames e serviços disponíveis na rede.</>,
    },
    {
      icon: MessageCircle,
      title: "Ative seu Passaporte Família grátis",
      text: (
        <>
          Depois da compra, você será direcionado para o nosso{" "}
          <strong className="font-extrabold text-chia-900">WhatsApp</strong> para concluir a ativação.
        </>
      ),
    },
  ];
  return (
    <section id="como-comecar" className="bg-chia-200 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>03 — Como começar</Eyebrow>
          <SectionTitle>
            Começar é <span className="text-magenta-600">simples.</span>
          </SectionTitle>
        </Reveal>

        <ol className="mt-10 grid gap-4 md:mt-12 lg:grid-cols-3 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal
                delay={i * 100}
                className="flex h-full flex-col items-center gap-4 rounded-[22px] bg-white p-6 text-center shadow-sm ring-1 ring-chia-400/60 md:p-8 lg:items-start lg:gap-0 lg:text-left"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-magenta-500 to-magenta-600 text-white shadow-lg shadow-magenta-500/25">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="lg:mt-5">
                  <span className="text-sm font-extrabold uppercase tracking-wider text-magenta-700">
                    Passo {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-lg font-extrabold leading-snug text-chia-900" style={{ letterSpacing: "-0.01em" }}>
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-base leading-[1.7] text-chia-900 md:text-[17px]">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-10 flex justify-center">
          <CtaButton variant="solid">Quero meu passaporte</CtaButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 — O que é o Kivid: bento grid                                     */
/* ------------------------------------------------------------------ */

function Beneficios() {
  const cards = [
    { icon: Microscope, title: "Exames", desc: "Milhares de opções entre exames laboratoriais e de imagem." },
    {
      icon: Leaf,
      title: "Saúde e bem-estar",
      desc: "Psicologia, nutrição, fisioterapia, pilates, RPG, acupuntura e outros serviços.",
    },
    { icon: Video, title: "Teleconsulta", desc: "Cuide da sua saúde de onde estiver." },
    { icon: Siren, title: "Pronto atendimento on-line 24h", desc: "Atendimento médico quando precisar." },
  ];
  return (
    <section id="beneficios" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <Reveal className="grid gap-6 text-center lg:grid-cols-12 lg:items-end lg:gap-12 lg:text-left">
          <div className="lg:col-span-7">
            <Eyebrow>04 — O que é o Kivid</Eyebrow>
            <SectionTitle>
              Mais acesso à saúde. <span className="text-magenta-600">Menos complicação.</span>
            </SectionTitle>
          </div>
          <p className="mx-auto max-w-md text-[17px] leading-[1.7] text-chia-900 md:text-lg lg:col-span-5 lg:mx-0">
            O Kivid é uma plataforma de saúde que conecta você a uma rede de consultas, exames e serviços com{" "}
            <strong className="font-bold text-chia-900">preços diferenciados</strong>.
          </p>
        </Reveal>

        <p className="mt-10 text-center text-base font-bold text-chia-900 lg:text-left">Com o Passaporte Kivid, você pode acessar:</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {/* Destaque */}
          <Reveal className="relative overflow-hidden rounded-[22px] p-6 text-center text-white sm:col-span-2 md:p-8 lg:col-span-1 lg:row-span-2 lg:text-left">
            <div aria-hidden className="absolute inset-0" style={{ background: BG_MAGENTA }} />
            <div className="relative flex h-full flex-col items-center lg:items-start">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-magenta-600">
                <Stethoscope className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-extrabold" style={{ letterSpacing: "-0.01em" }}>
                Consultas médicas
              </h3>
              <div className="mt-auto pt-8">
                <div className="font-extrabold leading-none" style={{ fontSize: 80, letterSpacing: "-0.04em" }}>
                  +40
                </div>
                <p className="mt-2 text-base font-semibold leading-[1.5]">especialidades disponíveis na rede.</p>
              </div>
            </div>
          </Reveal>

          {cards.map((c, i) => (
            <Reveal
              key={c.title}
              delay={(i % 2) * 100}
              className="group rounded-[22px] border border-chia-400/60 bg-chia-100 p-6 text-center transition-all lg:text-left duration-200 hover:border-magenta-300 hover:bg-white hover:shadow-xl"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-magenta-100 text-magenta-700 transition-all lg:mx-0 group-hover:scale-110 group-hover:bg-magenta-600 group-hover:text-white">
                <c.icon className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-extrabold text-chia-900" style={{ letterSpacing: "-0.01em" }}>
                {c.title}
              </h3>
              <p className="mt-1.5 text-base leading-[1.7] text-chia-900 md:text-[17px]">{c.desc}</p>
            </Reveal>
          ))}
        </div>

        {/* Faixa: app + sem carência */}
        <Reveal className="mt-4 flex flex-col items-center gap-5 rounded-[22px] bg-chia-200 p-6 text-center md:p-8 lg:flex-row lg:justify-between lg:text-left">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-magenta-700 shadow-sm">
              <Smartphone className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-base font-extrabold text-chia-900 md:text-lg">
              Tudo de forma simples, direto pelo app Kivid.
            </p>
          </div>
          <ul className="flex flex-wrap justify-center gap-2">
            {["Sem carência", "Sem burocracia"].map((t) => (
              <li
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[15px] font-bold text-magenta-700 shadow-sm"
              >
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Fechamento — banner magenta com imagem                               */
/* ------------------------------------------------------------------ */

function Fechamento() {
  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <Reveal
          className="relative overflow-hidden shadow-2xl ring-1 ring-black/10"
          style={{ background: BG_MAGENTA, borderRadius: 28 }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ background: "#F5A9CC" }}
          />
          <div className="relative grid md:grid-cols-12">
            <div className="px-6 pt-9 text-center md:col-span-7 md:py-10 md:pl-6 md:pr-0 lg:pl-24 lg:pr-2">
              <div className="mb-4 flex justify-center">
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-1.5 backdrop-blur-sm"
                  style={{ fontSize: 13, letterSpacing: "0.16em" }}
                >
                  <Ribbon className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                  <span className="font-extrabold uppercase text-white">Outubro Rosa</span>
                </span>
              </div>
              <h3
                className="font-extrabold uppercase leading-[1.05] text-white text-[clamp(28px,8vw,36px)] md:text-[38px] lg:text-[44px]"
                style={{ letterSpacing: "-0.02em", textWrap: "balance" as React.CSSProperties["textWrap"] }}
              >
                Cuidar de você pode começar hoje.
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-[17px] font-semibold leading-[1.7] text-white md:text-lg">
                Aproveite o Outubro Rosa para ter acesso a uma rede de saúde com preços acessíveis — e ainda compartilhar
                esse cuidado com sua família.
              </p>

              {/* Preço em destaque com o CTA ao lado no tablet e no desktop (empilha no celular) */}
              <div className="mt-5 flex flex-col items-center gap-5 md:flex-row md:items-end md:justify-center md:gap-4 lg:gap-8">
                <div className="text-white">
                  <div className="whitespace-nowrap text-xl font-extrabold md:text-lg lg:text-2xl">por apenas 12x de</div>
                  <Price value="14,90" className="text-[72px] md:text-[60px] lg:text-[84px]" />
                </div>
                <div className="w-full sm:w-auto md:mb-[5px] lg:mb-[18px]">
                  <CtaButton variant="light" className="whitespace-nowrap md:px-5 lg:px-8">
                    Garantir oferta
                  </CtaButton>
                </div>
              </div>
            </div>

            {/* Desktop: arco + foto 4:5 ancorada na base. Tablet: só a foto, na altura toda do box, encostada à direita. */}
            <div className="relative mt-8 flex items-end justify-center px-6 md:absolute md:inset-y-0 md:right-0 md:mt-0 md:w-[42%] md:px-0 lg:static lg:col-span-5 lg:w-auto lg:px-6 lg:pt-7">
              <div className="relative w-full max-w-[300px] md:h-full md:max-w-none lg:h-auto lg:max-w-[364px]">
                <div aria-hidden className="absolute inset-x-0 -top-5 bottom-0 rounded-t-full bg-white/85 md:hidden lg:block" />
                <img
                  src="/manual/senhora-compras.png"
                  alt="Mulher caminhando com carrinho de feira cheio de alimentos saudáveis"
                  width={494}
                  height={494}
                  loading="lazy"
                  decoding="async"
                  className="relative block aspect-[4/5] h-auto w-full object-cover object-[55%_100%] md:aspect-auto md:h-full md:object-[40%_0%] lg:aspect-[4/5] lg:h-auto lg:object-[55%_100%]"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-chia-900 text-chia-300" style={{ padding: "40px 0" }}>
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:grid-cols-2 md:items-center md:px-6">
        <div className="text-sm leading-[1.7] text-chia-300">
          <p>
            © 2026 Kivid Saúde e Tecnologia. As consultas e exames são agendados e pagos diretamente à rede
            credenciada. Kivid não é plano de saúde.
          </p>
          <p className="mt-3">(55) 7133.458210 · www.kivid.com.br</p>
        </div>
        <div className="flex md:justify-end">
          <img src="/brand/kivid-logo-white.svg" alt="Kivid" className="block h-8 w-auto md:h-10" />
        </div>
      </div>
    </footer>
  );
}

function MobileStickyCta() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const obs = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
      rootMargin: "0px 0px -10% 0px",
    });
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      role="region"
      aria-label="Ação rápida — Outubro Rosa"
      aria-hidden={!visible}
      className="fixed inset-x-0 bottom-0 z-40 px-4 py-2 md:hidden"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 -8px 24px rgba(57,62,62,0.08)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0) + 10px)",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "transform 0.3s ease, opacity 0.3s ease",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="whitespace-nowrap text-[13px] font-extrabold uppercase tracking-[0.08em] text-magenta-700">
            + Família grátis
          </div>
          <div className="whitespace-nowrap text-base font-extrabold text-chia-900">12x de R$ 14,90</div>
        </div>
        <a
          href={CHECKOUT_URL}
          tabIndex={visible ? 0 : -1}
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-magenta-600 px-5 text-[14px] font-extrabold text-white shadow-sm transition-all duration-200 hover:bg-magenta-700 active:bg-magenta-800 min-[360px]:px-6 min-[360px]:text-[15px]"
          style={{ height: 52 }}
        >
          Garantir oferta
          <ArrowRight className="hidden h-4 w-4 min-[360px]:block" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export function OutubroRosaPage() {
  return (
    <div className="min-h-dvh bg-background pb-24 md:pb-0">
      <Navbar />
      <main>
        <Hero />
        <Precos />
        <Rede />
        <Oferta />
        <ComoComecar />
        <Beneficios />
        <Fechamento />
      </main>
      <Footer />
      <MobileStickyCta />
    </div>
  );
}
