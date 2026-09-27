import { notFound } from "next/navigation";
import styles from "./page.module.css";

const publicMuralQuery = `
  query PublicMural($slug: String!) {
    publicMural(slug: $slug) {
      slug
      titulo
      descripcion
      informacionGeneral
      cursoNombre
      cursoDescripcion
      temas { titulo descripcion orden }
      examenes { titulo descripcion fecha informacionAdicional }
      avisos { titulo contenido fecha }
    }
  }
`;

async function getPublicMural(slug) {
  const endpoint = process.env.KEYSTONE_GRAPHQL_URL
    || "http://localhost:3001/api/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: publicMuralQuery,
      variables: { slug },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo consultar el mural público.");
  }

  const result = await response.json();
  if (result.errors?.length) {
    throw new Error("No se pudo consultar el mural público.");
  }

  return result.data?.publicMural || null;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function EmptySection({ children }) {
  return <p className={styles.empty}>{children}</p>;
}

export default async function PublicCourseMural({ params }) {
  const { slug } = await params;
  const mural = await getPublicMural(slug);

  if (!mural) notFound();

  return (
    <main className={styles.page}>
      <div className={`container ${styles.container}`}>
        <div className={styles.brandLine}>
          <span className={styles.brandMark} aria-hidden="true">P</span>
          <span>Planificación Docente</span>
          <span className={styles.publicLabel}>Mural público</span>
        </div>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>{mural.titulo}</p>
          <h1>{mural.cursoNombre}</h1>
          {mural.cursoDescripcion && (
            <p className={styles.courseDescription}>{mural.cursoDescripcion}</p>
          )}
          {mural.descripcion && (
            <p className={styles.muralDescription}>{mural.descripcion}</p>
          )}
        </header>

        {mural.informacionGeneral && (
          <section className={styles.generalInfo} aria-labelledby="general-title">
            <h2 id="general-title">Información general</h2>
            <p>{mural.informacionGeneral}</p>
          </section>
        )}

        <section className={styles.topics} aria-labelledby="topics-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Recorrido del curso</p>
              <h2 id="topics-title">Temas</h2>
            </div>
            <span className={styles.sectionCount}>{mural.temas.length}</span>
          </div>
          {mural.temas.length ? (
            <ol className={styles.topicList}>
              {mural.temas.map((tema, index) => (
                <li className={styles.topic} key={`${tema.orden}-${tema.titulo}`}>
                  <span className={styles.topicNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{tema.titulo}</h3>
                    {tema.descripcion && <p>{tema.descripcion}</p>}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <EmptySection>Todavía no hay temas publicados.</EmptySection>
          )}
        </section>

        <div className={styles.lowerGrid}>
          <section className={styles.exams} aria-labelledby="exams-title">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionKicker}>Fechas a tener en cuenta</p>
                <h2 id="exams-title">Próximos exámenes</h2>
              </div>
            </div>
            {mural.examenes.length ? (
              <ul className={styles.eventList}>
                {mural.examenes.map((exam) => (
                  <li className={styles.exam} key={`${exam.fecha}-${exam.titulo}`}>
                    <time className={styles.dateBlock} dateTime={exam.fecha}>
                      {formatDate(exam.fecha)}
                    </time>
                    <div>
                      <h3>{exam.titulo}</h3>
                      {exam.descripcion && <p>{exam.descripcion}</p>}
                      {exam.informacionAdicional && (
                        <p className={styles.additionalInfo}>{exam.informacionAdicional}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptySection>No hay exámenes próximos publicados.</EmptySection>
            )}
          </section>

          <section className={styles.notices} aria-labelledby="notices-title">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionKicker}>Novedades del curso</p>
                <h2 id="notices-title">Avisos importantes</h2>
              </div>
            </div>
            {mural.avisos.length ? (
              <ul className={styles.noticeList}>
                {mural.avisos.map((notice) => (
                  <li className={styles.notice} key={`${notice.fecha}-${notice.titulo}`}>
                    <time dateTime={notice.fecha}>{formatDate(notice.fecha)}</time>
                    <h3>{notice.titulo}</h3>
                    <p>{notice.contenido}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptySection>No hay avisos publicados.</EmptySection>
            )}
          </section>
        </div>

        <footer className={styles.footer}>
          <span>{mural.cursoNombre}</span>
          <span>Información del curso</span>
        </footer>
      </div>
    </main>
  );
}