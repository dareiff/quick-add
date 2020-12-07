import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { addListener } from 'process';
import dayjs from 'dayjs';

const Home: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [cats, setCats] = useState<any>(null);
    const [categoryID, setCategoryID] = useState<number | null>(null);

    const downloadCats = async () => {
        await fetch('/api/getCat')
            .then(result => result.json())
            .then((result: any) => {
                console.log(result);
                setCats(result.categories);
            })
            .catch(err => setCats(undefined));
    };

    useEffect(() => {
        downloadCats();
    }, []);

    const insertTransaction = async () => {
        setLoading(true);
        if (amount === 0 || categoryID === null) {
            setLoading(false);
            return;
        } else {
            var now = dayjs();
            await fetch('/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactions: [
                        {
                            amount: amount,
                            category: categoryID,
                            date: now.format().toString(),
                            payee: 'CASH',
                        },
                    ],
                }),
            })
                .then(res => {
                    console.log(res);
                    setLoading(false);
                    setSuccess(true);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Lunch Money Quick Add</title>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Cookie Jar</h1>
                {success && <span>we good</span>}
                {cats === null && <span>loading</span>}
                <label className={styles.label} htmlFor='lineItem'>
                    Cash Entry:
                </label>
                <input
                    id='lineItem'
                    className={styles.numberEntry}
                    type='number'
                    onChange={e => setAmount(parseInt(e.target.value))}
                />
                <label className={styles.label} htmlFor='categorySelect'>
                    Category:
                </label>
                <select
                    onChange={e => setCategoryID(parseInt(e.target.value))}
                    className={styles.category}
                    id='categorySelect'
                >
                    {cats !== null ? (
                        cats.map((category, i) => (
                            <option
                                className={styles.category}
                                key={i}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))
                    ) : (
                        <h2>Loading</h2>
                    )}
                </select>
                <button
                    className={styles.button}
                    onClick={() => insertTransaction()}
                >
                    Add
                </button>
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
};

export default Home;
