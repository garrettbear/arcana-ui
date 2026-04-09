import {
  AuthorCard,
  Breadcrumb,
  BreadcrumbItem,
  Divider,
  RelatedPosts,
  Skeleton,
} from '@arcana-ui/core';
import { Link, useParams } from 'react-router-dom';
import { AtelierNavbar } from '../components/AtelierNavbar';
import { articles, getArticle } from '../data/articles';
import { getAuthor } from '../data/authors';

/** Article body prose keyed by slug */
const articleBodies: Record<
  string,
  {
    paragraphs: string[];
    pullQuote: string;
    inlineImages?: Array<{ url: string; alt: string; caption: string }>;
  }
> = {
  'the-quiet-power-of-concrete': {
    pullQuote:
      'Brutalism was never about hostility. It was about honesty. About showing the world exactly what a building is made of.',
    inlineImages: [
      {
        url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=85',
        alt: 'Brutalist building exterior with deep shadow geometry',
        caption:
          "The building's north elevation. Raw concrete mixed with volcanic ash from Sakurajima.",
      },
      {
        url: 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?w=1200&q=85',
        alt: 'Interior concrete surface with natural light',
        caption: 'The main hall at midday. Formwork marks visible in the poured concrete surface.',
      },
    ],
    paragraphs: [
      "In the winding streets of Lisbon's Mouraria district, a former textile factory has been reborn as something quietly radical. Architect Paulo Mendes has stripped the building to its structural bones, exposing the raw concrete that previous renovators had spent decades hiding beneath plaster, laminate, and dropped ceilings. The result is an ode to honesty — a building that wears its age and its materials with a dignity that feels almost unfashionable in an era that mistakes novelty for ambition.",
      "The factory was built in 1948 and abandoned in 1991, when the last of Lisbon's textile manufacturing migrated east. For thirty years it stood vacant, its façade colonised by ferns and its interiors stripped of everything removable. What remained when Mendes first walked through it in 2022 was the structure itself: 400-millimetre walls of aggregate concrete, ceilings that rose to six metres at their apex, and windows that admitted a quality of light — diffused through decades of grime — that he would spend the next two years trying to preserve in the renovation.",
      "The rehabilitation is now complete, and the building functions as a shared workspace, archive, and lecture hall for the Lisbon School of Architecture. Mendes's interventions are deliberate in their restraint. New elements — a mezzanine floor of rolled steel, staircases of folded plate, handrails of black oxide — are clearly contemporary, clearly reversible, and clearly in conversation with rather than competition against the existing fabric. Where the concrete was damaged, it was repaired in matching aggregate. Where it was sound, it was left entirely alone.",
      'What makes the project significant is not the quality of the workmanship, though that is considerable. It is the argument the building makes about what renovation is for. In an era when adaptive reuse has become the default strategy for redundant industrial buildings, the standard procedure is to insert a layer of finish — polished concrete, white plaster, new glazing — that transforms the existing structure into a neutral backdrop. Mendes has done the opposite. The existing fabric is the foreground. The new elements defer to it.',
      'The building received the Prémio Nacional de Arquitectura in November 2025. At the ceremony, Mendes declined to give a speech. In the catalogue note that substituted for his remarks, he wrote: "The building was already there. I tried not to ruin it." It is a statement that could be read as false modesty, but it isn\'t. It is, rather, a precise description of a philosophy that the building itself enacts: that the most honest thing an architect can do with an existing structure is to trust it.',
    ],
  },
  'living-light-norwegian-fjords': {
    pullQuote:
      'The engineering required to achieve this was extraordinary. The architect does not discuss it.',
    paragraphs: [
      'The brief was simple: wake up to the fjord. The execution, however, required a structural engineering feat that took two years to resolve. The result is a 240-square-meter retreat outside Bergen where every room opens to a panorama of water and stone, and where the boundary between building and landscape has been dissolved so completely that it is difficult, on the best mornings, to say where one ends and the other begins.',
      'The house belongs to a family of four who spent years searching the Norwegian coast for a site that would deliver what the architect, Marte Haagensen, calls "the full Norwegian light." Not the soft, indirect light of the coastal lowlands, but the hard, crystalline light of the fjord interior — the light that arrives sideways in the blue hours of winter, that floods the cliffs in midsummer, that turns the water to hammered silver in the hour before dark.',
      'The structure is a single-story pavilion of glass and laminated larch, cantilevered six meters over the fjord cliff so that the living room floor is also, effectively, a bridge. The cantilever is supported by a post-tensioned concrete spine that runs through the hillside behind the house, its presence concealed within the landscape planting that Haagensen specified as part of the construction contract. From the fjord, the house appears to float. This is not an accident.',
      'Inside, the rooms are arranged in a single linear sequence — entrance, kitchen, living, sleeping — each one opening to the fjord through full-height pivoting panels of triple-laminated glass. The thermal performance is achieved not through insulation alone but through the orientation of the building, which tracks the sun across its 180-degree arc and admits it into every room in sequence over the course of the day. The heating is supplemented by a geothermal system that draws from the fjord water itself.',
    ],
  },
  'wabi-sabi-interiors': {
    pullQuote: 'The Japanese word for imperfection is not an apology. It is an aspiration.',
    paragraphs: [
      'Cracked plaster walls. Mismatched ceramics. A wooden table worn smooth by decades of use. These are not accidents to be corrected — they are the point. Wabi-sabi, the Japanese aesthetic philosophy that finds beauty in imperfection, impermanence, and incompleteness, is quietly reshaping how a generation of designers in Europe and North America approach the interior.',
      'The philosophy has Western analogues — in the Arts and Crafts movement\'s rejection of industrial perfection, in the patina-worship of antique dealers, in the current vogue for "lived-in" aesthetics. But wabi-sabi is something more specific and more demanding. It is not the simulation of age but the acceptance of it. A wabi-sabi interior does not look old because someone has applied a wash of grey paint and left it to dry unevenly. It looks old because it is old, because the aging has been allowed to proceed without intervention, and because that aging has been read as evidence of a life fully lived.',
      'The designer Chiaki Mori, who trained in Kyoto and practices in London, has spent the past decade attempting to translate the philosophy for Western clients who instinctively resist it. "The first response is always that it looks unfinished," she says. "People are trained to read cracks and chips and scratches as evidence of poor maintenance. The whole project of wabi-sabi is to retrain that response — to see those marks as evidence of time, and to understand time as something valuable rather than something to be concealed."',
      'The interiors Mori creates are not, it should be said, cheap. The aged ceramics she specifies are rare. The handmade plaster she uses is expensive to apply and requires skilled craftspeople who are becoming harder to find. The wood she selects — reclaimed, patinated, sometimes structurally compromised — must be assessed by specialists before installation. Wabi-sabi, as a practice, turns out to be a luxury. The irony is deliberate. "If we value imperfection," Mori says, "we should be willing to pay for it."',
    ],
  },
  'new-desert-modernism': {
    pullQuote: 'The desert is not a backdrop. It is a building material.',
    paragraphs: [
      'The mid-century modern homes of Palm Springs have always been about the dialogue between indoor and outdoor living. The Neutra houses, the Lautner structures, the work of William Cody and Donald Wexler — all of them negotiated the same fundamental proposition: that the California desert, with its extremes of temperature and its extraordinary quality of light, was not a hostile environment to be excluded but an active participant to be incorporated. Now, seventy years later, a new generation of architects is taking that dialogue to its logical conclusion.',
      'The houses being built around Palm Springs today are not mid-century modern. They acknowledge their predecessors — the flat rooflines, the clerestory windows, the connection between interior and exterior — but they go further. Where the Case Study architects worked against the climate with air conditioning and glass, the current generation works with it. Passive cooling strategies, carefully calculated overhangs, and rammed earth walls that absorb heat during the day and release it at night have allowed architects to reduce or eliminate mechanical climate control in buildings where the temperature differential between interior and exterior can reach forty degrees Celsius.',
      'The materials are different too. Mid-century desert modernism was a Southern California architecture — it used the concrete block, the steel beam, and the plate glass that were available in abundance to a postwar construction industry flush with industrial capacity. Contemporary desert architecture draws on the desert itself. Rammed earth, adobe, and compressed stabilized earth block — all of them local materials with deep roots in the vernacular architecture of the American Southwest — have been reintegrated into a contemporary practice that acknowledges their thermal mass and their visual rightness in a way that the mid-century architects, who were more interested in the industrial future than the pre-industrial past, could not quite manage.',
      'The result is a body of work that is both more modest and more ambitious than its predecessors. More modest because it does not try to conquer the desert; more ambitious because it tries to understand it.',
    ],
  },
  'material-conversations': {
    pullQuote: 'The joint is where the argument happens. Everything else is just waiting.',
    paragraphs: [
      'There is something inherently tense about pairing wood and steel. One is warm, organic, shaped by centuries of growth and subject to the same slow decay as everything that lives. The other is cold, precise, wrought in furnaces at temperatures that reduce everything to liquid, and subject to a different kind of decay — oxidation, stress fracture, fatigue. When skilled hands bring them together, that tension becomes a kind of poetry.',
      'The furniture maker and structural designer Lena Brandt has spent twenty years exploring the joint between these two materials — the literal, physical, engineered place where organic and industrial meet. Her studio in Hamburg produces objects that range from small-scale pieces to architectural elements: furniture, staircases, screens, and spatial dividers that use the junction between wood and steel not as a transition to be smoothed over but as the primary expressive element of the work.',
      '"The joint is where the argument happens," she says. "Everything else is just waiting for the joint." In practice, this means that Brandt designs her joints before she designs anything else. A table begins not with a question about proportion or material but with a question about how the steel leg will meet the timber top — whether it will penetrate through and be pinned, whether it will rest beneath and be welded to a hidden flange, whether it will be visible and celebrated or concealed and merely structural.',
      'The current body of work — fourteen pieces, ranging from a side table to a structural screen for a Berlin museum — is unified by a single formal constraint: every joint is visible, and every joint is different. No two pieces share the same solution to the same problem. "If you find a solution and repeat it," Brandt says, "you\'ve stopped designing. You\'ve started manufacturing." It is a distinction she makes without apology, and one that is increasingly legible in the work of the designers who have emerged from her studio.',
    ],
  },
  'tokyo-micro-living': {
    pullQuote: 'In Tokyo, compression is not a limitation. It is the premise.',
    paragraphs: [
      "In a city where space has always been a luxury, Tokyo's architects have spent decades perfecting the art of compression. The result is a body of residential work that is, paradoxically, one of the most liberating in the world — because when you have nothing to hide, you design with total honesty, and when every square meter must justify its existence, every element must be essential.",
      'The apartment belongs to Haruki Sato, a graphic designer in his early thirties who commissioned the architect Ai Fujiwara to transform a 28-square-meter unit in Shimokitazawa into a home that would function as a studio, a kitchen, a living room, a bedroom, and a place for receiving guests. The constraints were absolute. The budget was modest. The result, completed in 2025, has been published in twelve countries.',
      "Fujiwara's solution is a section. The apartment is divided not by walls — there are almost none — but by levels. A raised platform in the middle of the space, reached by two steps, serves as a sleeping area by night and a work platform by day, with a custom desk that folds down from the wall behind it. Below the platform is a concealed storage system that contains, according to Sato's count, more than three hundred objects. Above the platform is a skylight, one of two in the apartment, that was negotiated with considerable difficulty from the building's owners and that provides the apartment with the quality of light that makes the compression bearable.",
      'The kitchen is a single wall of custom cabinetry, three meters long and floor-to-ceiling, with a hob, a half-width refrigerator, and a sink hidden behind panels that, when closed, read as a continuation of the shelving system. The bathroom is the apartment\'s one concession to enclosure: a fully tiled room of 2.4 square meters with a soaking tub that folds up against the wall when not in use. Sato describes it as his favourite room. "It\'s the only place I can stand up without seeing my desk," he says.',
    ],
  },
};

function getRelated(
  currentSlug: string,
): Array<{ title: string; href: string; category: string; author: string }> {
  return articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 3)
    .map((a) => ({
      title: a.title,
      href: `/article/${a.slug}`,
      category: a.category,
      author: getAuthor(a.authorSlug)?.name ?? '',
    }));
}

export function ArticleDetail(): React.JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticle(slug ?? '');

  if (!article) {
    return (
      <>
        <AtelierNavbar />
        <div className="atelier-container atelier-section">
          <h1 className="atelier-display atelier-display--md">Article not found</h1>
          <Link to="/" className="atelier-link">
            Back to home
          </Link>
        </div>
      </>
    );
  }

  const author = getAuthor(article.authorSlug);
  const body = articleBodies[article.slug];
  const related = getRelated(article.slug);
  const inlineImages = body?.inlineImages ?? [];

  return (
    <>
      <AtelierNavbar />

      {/* Full-bleed hero image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '55vh',
          minHeight: '360px',
          maxHeight: '640px',
          overflow: 'hidden',
        }}
      >
        <img
          src={article.imageUrl}
          alt={article.imageAlt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
          }}
          loading="eager"
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 60%, rgba(253,251,247,0.95) 100%)',
          }}
        />
      </div>

      <div className="atelier-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        <div className="atelier-reading-column">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbItem href="/">Atelier</BreadcrumbItem>
            <BreadcrumbItem href={`/archive?category=${article.category}`}>
              {article.category}
            </BreadcrumbItem>
            <BreadcrumbItem current>
              {article.title.length > 45 ? `${article.title.slice(0, 45)}\u2026` : article.title}
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Category */}
          <p className="atelier-smallcaps" style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>
            {article.category}
          </p>

          {/* Title */}
          <h1 className="atelier-display atelier-display--lg" style={{ marginBottom: '0.75rem' }}>
            {article.title}
          </h1>

          {/* Subtitle */}
          <p
            className="atelier-body--serif"
            style={{
              color: 'var(--color-fg-secondary)',
              marginBottom: '1.5rem',
              fontSize: '1.1875rem',
            }}
          >
            {article.subtitle}
          </p>

          {/* Byline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-fg-secondary)',
              marginBottom: '2.5rem',
            }}
          >
            <span>By {author?.name}</span>
            <span>&middot;</span>
            <span>
              {new Date(article.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span>&middot;</span>
            <span>{article.readTime} min read</span>
          </div>

          <Divider spacing="md" />

          {/* Article body */}
          <article className="atelier-body--reading" style={{ marginTop: '2rem' }}>
            {body ? (
              <>
                <p style={{ marginTop: 0 }}>{body.paragraphs[0]}</p>
                <p>{body.paragraphs[1]}</p>

                {/* First inline image */}
                {inlineImages[0] && (
                  <figure className="atelier-inline-image">
                    <img
                      src={inlineImages[0].url}
                      alt={inlineImages[0].alt}
                      style={{ width: '100%', height: 'auto' }}
                      loading="lazy"
                    />
                    <figcaption>{inlineImages[0].caption}</figcaption>
                  </figure>
                )}

                <blockquote className="atelier-pull-quote">
                  <p className="atelier-pull-quote__text">{body.pullQuote}</p>
                </blockquote>

                <p>{body.paragraphs[2]}</p>

                {/* Second inline image */}
                {inlineImages[1] && (
                  <figure className="atelier-inline-image">
                    <img
                      src={inlineImages[1].url}
                      alt={inlineImages[1].alt}
                      style={{ width: '100%', height: 'auto' }}
                      loading="lazy"
                    />
                    <figcaption>{inlineImages[1].caption}</figcaption>
                  </figure>
                )}

                <p>{body.paragraphs[3]}</p>
                {body.paragraphs[4] && <p>{body.paragraphs[4]}</p>}
              </>
            ) : (
              <>
                <p>{article.excerpt}</p>
                <Skeleton variant="text" lines={8} />
              </>
            )}
          </article>

          <Divider spacing="lg" />

          {/* Author card */}
          {author && (
            <AuthorCard
              name={author.name}
              role={`Based in ${author.location}`}
              bio={author.bio}
              variant="card"
            />
          )}

          <Divider spacing="lg" />

          {/* Related posts */}
          <RelatedPosts title="More from Atelier" posts={related} columns={3} variant="list" />

          {/* Back to top */}
          <div style={{ textAlign: 'center', padding: '3rem 0 1rem' }}>
            <button
              type="button"
              className="atelier-link atelier-smallcaps"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
              }}
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
