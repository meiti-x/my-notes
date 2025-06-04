import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'آسان و سریع',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        من این پروژه برای نگه داشت و یاددآوری یادداشت هام ساختم. سادگی برام مهمترین ویژگی بوده      </>
    ),
  },
  {
    title: 'تمرکز بر محتوا',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        من این سیستم یادداشت‌برداری رو طوری طراحی کردم که بتونم روی چیزهایی که واقعا مهمن تمرکز کنم و افکار و پروژه‌هام رو به صورت واضح و مختصر سازماندهی کنم.
      </>
    ),
  },
  {
    title: 'ساخته شده با React',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
