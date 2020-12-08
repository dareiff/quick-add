import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useReducer, useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';

const FavSelector = styled.span`
    text-align: left;
    width: 100%;
    font-size: 18px;
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    background-color: ${props => (props.odd ? '#fafafa' : '#fff')};
`;

const Bubble = styled.span`
    background-color: ${props => (!props.selected ? '#eaeaea' : '#f79677')};
    padding: 8px 15px;
    border-radius: 18px;
    margin: 5px;
`;

const BubbleHolder = styled.div`
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
`;

const reducer = (state, action) => {
    console.log('ACTION', action);
    if (state.categories.filter(cat => cat.id === action.value.id).length > 0) {
        const filterCats = state.categories.filter(
            currentFavorite => currentFavorite.id !== action.value.id
        );
        return { categories: filterCats };
    } else {
        return {
            categories: [
                { id: action.value.id, name: action.value.name },
                ...state.categories,
            ],
        };
    }
};

const Home: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [favs, setFavs] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [cats, setCats] = useState<any>(null);
    const [categoryID, setCategoryID] = useState<number | null>(null);

    const favoriteCategories = { categories: [] };

    const [favCats, dispatch] = useReducer(reducer, favoriteCategories);

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
                            category_id: categoryID,
                            date: now.format('YYYY-MM-DD').toString(),
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
                    pattern='\d*'
                    onChange={e => setAmount(parseInt(e.target.value))}
                />
                {favCats.categories.length > 0 && (
                    <BubbleHolder>
                        {favCats.categories.map(cat => {
                            return (
                                <Bubble
                                    selected={categoryID === cat.id}
                                    key={cat.id}
                                    onClick={() => setCategoryID(cat.id)}
                                >
                                    {cat.name}
                                </Bubble>
                            );
                        })}
                    </BubbleHolder>
                )}
                <label className={styles.label} htmlFor='categorySelect'>
                    <span>Category:</span>{' '}
                    <span
                        style={{
                            fontWeight: 400,
                            fontSize: '12px',
                            marginLeft: 'auto',
                        }}
                        onClick={() => setFavs(!favs)}
                    >
                        Set Favs
                    </span>
                </label>
                {favs &&
                    cats !== null &&
                    cats.map((category, i) => (
                        <FavSelector key={i} odd={i & 1 && true}>
                            <label
                                style={{
                                    width: '200px',
                                }}
                                htmlFor='categorySelect'
                            >
                                {category.name}
                            </label>
                            <input
                                type='checkbox'
                                style={{ width: '18px', height: '20px' }}
                                onChange={() =>
                                    dispatch({
                                        value: {
                                            id: category.id,
                                            name: category.name,
                                        },
                                    })
                                }
                            ></input>
                        </FavSelector>
                    ))}
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
                        <option>Loading</option>
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
