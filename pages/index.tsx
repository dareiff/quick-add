import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import { addListener } from 'process';
import dayjs from 'dayjs';

const Home: React.FC = () => {
    const categories = [{ name: 'MFD Supplies' }, { name: 'Restaurants' }];
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const insertTransaction = async () => {
        setLoading(true);
        if (amount === 0) {
            setLoading(false);
            return;
        } else {
            var now = dayjs();
            await fetch('/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    transactions: [
                        {
                            amount: 0,
                            category: 222,
                            date: now.format(),
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
                {setSuccess && <span>we good</span>}
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
                <select className={styles.category} id='categorySelect'>
                    {categories.map((category, i) => (
                        <option
                            key={i}
                            className={styles.category}
                            value={category.name}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
                <button className={styles.button} onClick={insertTransaction}>
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
