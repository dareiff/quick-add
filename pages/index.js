import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
    const categories = [{ name: 'MFD Supplies' }, { name: 'Restaurants' }];
    return (
        <div className={styles.container}>
            <Head>
                <title>Lunch Money Quick Add</title>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Cookie Jar</h1>
                <label className={styles.label} for='lineItem'>
                    Cash Entry:
                </label>
                <input
                    id='lineItem'
                    className={styles.numberEntry}
                    type='number'
                />
                <label className={styles.label} for='categorySelect'>
                    Category:
                </label>
                <select className={styles.category} id='categorySelect'>
                    {categories.map(category => (
                        <option className={styles.category} value={category.name}>{category.name}</option>
                    ))}
                </select>
            </main>

            <footer className={styles.footer}>
                <a
                    href='https://derekr.net'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    team fun
                </a>
            </footer>
        </div>
    );
}
