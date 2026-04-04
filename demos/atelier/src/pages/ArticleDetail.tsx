import {
  AuthorCard,
  Breadcrumb,
  BreadcrumbItem,
  Divider,
  Image,
  Modal,
  PullQuote,
  RelatedPosts,
  ScrollArea,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@arcana-ui/core';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AtelierNavbar } from '../components/AtelierNavbar';
import { articles, getArticle } from '../data/articles';
import { getAuthor } from '../data/authors';

/** Article body prose keyed by slug */
const articleBodies: Record<string, { paragraphs: string[]; pullQuote: string }> = {
  'the-weight-of-silence': {
    pullQuote: 'The building does not ask for your attention. It assumes it.',
    paragraphs: [
      'The road to the chapel at Kagawa is unmarked. There is no signage, no visitor center, no indication that one of the most significant religious buildings of the century sits at the end of a gravel path flanked by cedar. This is by design. Tadao Ando has never believed that architecture should announce itself. His buildings arrive the way a good sentence does — with an inevitability that makes you forget someone had to write it.',
      'The chapel is cast from a single pour of concrete, which Ando specified to be mixed with volcanic ash from Sakurajima. The result is a surface that reads as both ancient and impossibly precise. The formwork marks are visible, each one a record of the day the wall was made. In the main hall, a vertical slit in the eastern wall admits a blade of morning light that migrates across the floor over the course of two hours, tracing a line that arrives at the altar precisely at the vernal equinox. The engineering required to achieve this was considerable. Ando does not discuss it.',
      'Inside, the silence is structural. The chapel seats forty, on pews carved from a single hinoki cypress that fell in a typhoon in 2019. There is no music, no amplification. The acoustic design ensures that a whisper at the altar can be heard in the last row, but a conversation in the vestibule cannot penetrate the nave. The architect describes this as "selective silence" — the building chooses what it will carry.',
      'To visit Ando\u2019s chapel is to be reminded that architecture is not primarily a visual art. It is a temporal one. The building changes with every hour of daylight, every season, every shift in the weight of clouds above the Inland Sea. It does not photograph well. It does not need to. It is, in the most literal sense, a building that must be experienced — and in that requirement lies its most radical proposition: that some things cannot be mediated.',
    ],
  },
  'the-most-honest-apartment-in-berlin': {
    pullQuote: 'What remained was the truth of the building.',
    paragraphs: [
      'The apartment occupies the top two floors of a Gründerzeit building in Prenzlauer Berg, built in 1887 and left largely untouched by the renovations that swept through the neighborhood after reunification. When Katrin Müller acquired the space in 2022, the ceilings were dropped, the original stucco hidden behind plasterboard, the oak floors buried under laminate. Her first act was demolition.',
      'Removing the false ceilings revealed the original plasterwork — damaged, incomplete, but present. Müller, who trained as a conservator before turning to interior design, made the decision that would define the project: she would restore nothing. The fragments of decorative molding would remain as fragments. The water stains on the original ceiling beams would stay. The apartment would not pretend that the twentieth century had not happened.',
      'The furniture is sparse, each piece selected for its willingness to be honest about what it is. A sofa by Jasper Morrison sits in the main room, its grey wool the only soft surface visible. The dining table is a single slab of Douglas fir on steel trestles. In the kitchen, the cabinetry is birch plywood with exposed edges — no veneer, no paint, no concealment. The effect is not austere. It is clarifying.',
      'What Müller has built is not a minimalist apartment. Minimalism, in her view, is another form of decoration — an aesthetic choice that obscures as much as maximalism. Her apartment is something rarer: a space that refuses to perform. The walls show their age. The floors show their wear. The building, at last, is allowed to be exactly what it is.',
    ],
  },
  'concrete-revisited': {
    pullQuote: 'The rehabilitation of concrete is not aesthetic. It is moral.',
    paragraphs: [
      'For thirty years, concrete was the material architects apologized for. The legacy of Brutalism — misunderstood, poorly maintained, politically conscripted — had made raw concrete synonymous with failure. Institutions commissioned glass and timber. Residential developers specified anything with warmth. Concrete, when it appeared at all, was hidden behind cladding. The material that had built the modern world had become embarrassing.',
      'The reversal began slowly and from unexpected quarters. In 2018, a conservation campaign in London succeeded in listing the Barbican as a Grade II structure, not despite its concrete but because of it. In Tokyo, Kengo Kuma — an architect known primarily for wood — completed a pavilion in exposed concrete, citing the influence of Antonin Raymond. In Mexico City, a generation of young architects began working exclusively in concrete, not as a reference to the past but as an economic necessity that became an aesthetic conviction.',
      'What distinguishes this new concrete architecture from its Brutalist predecessors is not form but care. The formwork is exquisite. The aggregates are locally sourced and carefully graded. The surfaces are sealed and maintained. Where the Brutalists treated concrete as a blunt instrument of social ambition, the current generation treats it as a craft material — closer to rammed earth than to the megastructure. The result is buildings that age gracefully, that patinate rather than decay.',
      'The question of whether this represents a genuine revaluation or merely a cyclical fashion remains open. But the evidence suggests something deeper is at work. As the construction industry confronts its carbon legacy, concrete — which can now be mixed with industrial waste products, can sequester CO\u2082 during curing, and can be recycled indefinitely — is being reconsidered not merely as beautiful but as responsible. The material\u2019s rehabilitation is, in the end, inseparable from the industry\u2019s.',
    ],
  },
  'the-invisible-house': {
    pullQuote: 'Studio Mumbai builds nothing that the site does not already know.',
    paragraphs: [
      'Bijoy Jain does not keep a computer in his studio. The workshop at Alibag, an hour south of Mumbai by ferry, operates on a principle that most contemporary practices would find untenable: every element of a building is prototyped at full scale before construction begins. Walls, stairs, window frames, door handles — each is built, examined, revised, and rebuilt. A single door may go through twelve iterations. This is not perfectionism. It is listening.',
      'The house under discussion sits on a hillside in the Western Ghats, though Jain is reluctant to name the client or the precise location. What he will say is that the site contained a mango grove, a seasonal stream, and a basalt outcrop that the client wished to incorporate into the living space. The rock now forms one wall of the main room. It was not cut, not shaped, not polished. The house was designed around it.',
      'Construction took four years — long by international standards, unremarkable by Studio Mumbai\u2019s. The structure is load-bearing stone quarried from the site itself, with teak framing from trees that had fallen in the previous monsoon. The roof is a series of shallow vaults in thin-shell concrete, their curvature calculated to collect rainwater and direct it to cisterns below the kitchen garden. There is no air conditioning. The cross-ventilation, tested in the workshop with smoke and silk threads, maintains a temperature differential of eight degrees from the exterior.',
      'To describe a Studio Mumbai building in terms of sustainability metrics is to miss the point, though the metrics are impressive. What Jain has achieved is a practice in which the distinction between building and landscape, between construction and conservation, between architecture and agriculture has become meaningless. The house does not sit on the hill. It is, in a sense that Jain has spent thirty years making literal, part of the hill.',
    ],
  },
  'renzo-pianos-last-work': {
    pullQuote: 'He has always been interested in lightness. His late buildings have achieved it.',
    paragraphs: [
      'The building is a library, though Renzo Piano resists the word. "It is a room," he says, in the Genoese-inflected English that has not changed in sixty years of international practice. "A very large room, with very good light." The room in question occupies a headland on the Norwegian coast, north of Bergen, where the Renzo Piano Building Workshop was invited to design a cultural center that would, in the foundation\u2019s words, "make reading visible."',
      'Piano, now eighty-eight, visited the site once, in September 2024. His associates describe the visit as decisive. He spent three hours walking the headland, said almost nothing, and on the flight back to Genoa produced a sketch on the back of a boarding pass that is, in its essentials, the building as built. A long, low pavilion of glass and laminated timber, cantilevered over the cliff edge so that readers at the window desks look directly down to the sea. The structure is almost entirely transparent. At certain angles it disappears.',
      'The engineering is, as always with Piano, concealed within the apparent simplicity. The cantilever extends fourteen meters beyond the cliff face, supported by a post-tensioned concrete spine that is hidden within the timber floor plates. The glass is triple-laminated, with an interlayer that shifts from clear to translucent as the sun angle increases, reducing glare without mechanical intervention. The heating is geothermal. The timber is Norwegian spruce, certified and locally milled.',
      'Piano\u2019s late career has been marked by a progressive reduction — fewer materials, simpler forms, greater reliance on natural light and ventilation. This building represents the logical end of that trajectory: a structure so light, so transparent, so willing to defer to its landscape that it barely registers as architecture at all. It is, perhaps, the most difficult thing to build — a building that does not insist on being seen.',
    ],
  },
  'the-archive-ten-spaces': {
    pullQuote: 'From Maison de Verre to the Kimbell, the rooms we return to.',
    paragraphs: [
      'Every discipline has its canon — the works to which practitioners return not for instruction but for orientation. In architecture, the canon is spatial. It is not a list of buildings one has read about but a list of rooms one has stood in. The ten spaces collected here are not the most famous, nor the most influential, nor the most technically accomplished. They are the rooms that, once entered, alter the visitor\u2019s understanding of what a room can be.',
      'Pierre Chareau\u2019s Maison de Verre, completed in 1932, occupies a courtyard in the 7th arrondissement of Paris. Its glass-block facade — an industrial material repurposed with surgical precision — transforms the interior into a lantern. The light is not natural and not artificial but something between: diffused, even, unchanging. To enter is to step inside a piece of amber. Louis Kahn\u2019s Kimbell Art Museum in Fort Worth, completed in 1972, performs the opposite trick. Its cycloid vaults admit natural light through narrow slits at their apex, bouncing it off polished aluminum reflectors so that the galleries are lit from above by what Kahn called "silver light."',
      'Sigurd Lewerentz\u2019s St. Peter\u2019s Church in Klippan, Sweden, built between 1963 and 1966, is a room that seems to have been discovered rather than designed. The brickwork is deliberately rough, the mortar joints thick and irregular, the floor a single pour of dark concrete. There are no right angles. The windows are fixed directly into the brick without frames, sealed with mastic that Lewerentz applied himself. It is a building that looks like it was made by a mason, not an architect — and in that apparent crudeness lies its sophistication.',
      'The Farnsworth House, the Barcelona Pavilion, the Salk Institute courtyard, Barragan\u2019s Casa Gilardi, the Therme Vals, Zumthor\u2019s Bruder Klaus Chapel, and Sejima\u2019s Toledo Museum Glass Pavilion complete the list. Each operates on a different principle. Each achieves the same result: the temporary suspension of the visitor\u2019s belief that space is neutral. These are rooms that argue — quietly, through proportion and light and material — that the shape of a space is the shape of an experience.',
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  // Gallery images for the tabs
  const galleryImages = articles.slice(0, 4).map((a) => ({
    bg: a.image.bg,
    fg: a.image.fg,
    label: a.title,
    width: a.image.width,
    height: a.image.height,
  }));

  function openLightbox(index: number): void {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <>
      <AtelierNavbar />

      <div className="atelier-container atelier-section">
        <div className="atelier-reading-column">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbItem href="/">Atelier</BreadcrumbItem>
            <BreadcrumbItem href={`/archive?category=${article.category}`}>
              {article.category}
            </BreadcrumbItem>
            <BreadcrumbItem current>
              {article.title.length > 40 ? `${article.title.slice(0, 40)}\u2026` : article.title}
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Category */}
          <p
            className="atelier-smallcaps"
            style={{
              marginTop: 'var(--spacing-xl, 2rem)',
              marginBottom: 'var(--spacing-xs, 0.25rem)',
            }}
          >
            {article.category}
          </p>

          {/* Title */}
          <h1
            className="atelier-display atelier-display--lg"
            style={{ marginBottom: 'var(--spacing-md, 1rem)' }}
          >
            {article.title}
          </h1>

          {/* Byline */}
          <p
            style={{
              color: 'var(--color-fg-secondary)',
              marginBottom: 'var(--spacing-lg, 1.5rem)',
            }}
          >
            By {author?.name} &mdash; {article.readTime} min read
          </p>

          <Divider spacing="md" />

          {/* Tabs: Article | Gallery */}
          <Tabs defaultValue="article">
            <TabList>
              <Tab value="article">Article</Tab>
              <Tab value="gallery">Gallery</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="article">
                {/* Hero image */}
                <div style={{ margin: 'var(--spacing-lg, 1.5rem) 0' }}>
                  <Image
                    src={`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${article.image.width}" height="${article.image.height}"><rect fill="${article.image.bg}" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${article.image.fg}" font-family="Georgia" font-size="18" font-style="italic">${article.category}</text></svg>`)}`}
                    alt={article.title}
                    style={{ width: '100%', height: 'auto' }}
                    radius="none"
                  />
                </div>

                {/* Article body */}
                <article className="atelier-body--serif">
                  {body ? (
                    <>
                      <p>{body.paragraphs[0]}</p>
                      <p>{body.paragraphs[1]}</p>

                      <PullQuote quote={body.pullQuote} variant="accent" />

                      <p>{body.paragraphs[2]}</p>
                      <p>{body.paragraphs[3]}</p>
                    </>
                  ) : (
                    <>
                      <p>{article.excerpt}</p>
                      <Skeleton variant="text" lines={8} />
                    </>
                  )}
                </article>
              </TabPanel>

              <TabPanel value="gallery">
                <ScrollArea maxHeight="600px" style={{ marginTop: 'var(--spacing-lg, 1.5rem)' }}>
                  <div className="atelier-gallery-grid">
                    {galleryImages.map((img, i) => (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => openLightbox(i)}
                        style={{
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          background: 'none',
                        }}
                        aria-label={`View image: ${img.label}`}
                      >
                        <div
                          className="atelier-placeholder-image"
                          style={{
                            background: img.bg,
                            color: img.fg,
                            aspectRatio: '1',
                            width: '100%',
                            fontSize: 'var(--font-size-sm, 0.875rem)',
                          }}
                        >
                          {img.label.length > 30 ? `${img.label.slice(0, 30)}\u2026` : img.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </TabPanel>
            </TabPanels>
          </Tabs>

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
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl, 2rem) 0' }}>
            <button
              type="button"
              className="atelier-link"
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

      {/* Lightbox modal */}
      <Modal open={lightboxOpen} onClose={() => setLightboxOpen(false)} size="lg">
        <div
          className="atelier-placeholder-image"
          style={{
            background: galleryImages[lightboxIndex]?.bg,
            color: galleryImages[lightboxIndex]?.fg,
            aspectRatio: '4 / 3',
            width: '100%',
            fontSize: 'var(--font-size-lg, 1.125rem)',
          }}
        >
          {galleryImages[lightboxIndex]?.label}
        </div>
      </Modal>
    </>
  );
}
